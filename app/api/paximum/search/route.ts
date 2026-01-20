import { NextRequest, NextResponse } from 'next/server';

const PAXIMUM_API_BASE = 'http://service.stage.paximum.com/v2';
const PAXIMUM_CREDENTIALS = {
  Agency: 'PXM25952',
  User: 'USR1',
  Password: '!23'
};

// Cache token for 1 hour
let cachedToken: { token: string; expiresOn: Date } | null = null;

async function getAuthToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && new Date(cachedToken.expiresOn) > new Date()) {
    return cachedToken.token;
  }

  const response = await fetch(`${PAXIMUM_API_BASE}/api/authenticationservice/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(PAXIMUM_CREDENTIALS)
  });

  const data = await response.json();
  
  if (!data.header?.success || !data.body?.token) {
    throw new Error('Authentication failed: ' + JSON.stringify(data));
  }

  cachedToken = {
    token: data.body.token,
    expiresOn: new Date(data.body.expiresOn)
  };

  return data.body.token;
}

function calculateNights(departureDate: string, returnDate: string): number {
  const departure = new Date(departureDate);
  const returnD = new Date(returnDate);
  const diffTime = Math.abs(returnD.getTime() - departure.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.from || !body.to || !body.departureDate) {
      return NextResponse.json(
        { error: 'Missing required fields: from, to, departureDate' },
        { status: 400 }
      );
    }

    // Get authentication token (REQUIRED for PriceSearch)
    const token = await getAuthToken();

    // Build Paximum payload
    const serviceType = body.returnDate ? '2' : '1'; // 2=RoundTrip, 1=OneWay
    
    const paximumPayload: any = {
      ProductType: 3, // Flight
      ServiceTypes: [serviceType],
      CheckIn: body.departureDate,
      DepartureLocations: [
        {
          id: body.from.toUpperCase(),
          type: 5 // Type 5 for Airport (IATA code)
        }
      ],
      ArrivalLocations: [
        {
          id: body.to.toUpperCase(),
          type: 5 // Type 5 for Airport (IATA code)
        }
      ],
      Passengers: [
        {
          type: 1, // Adult
          count: parseInt(body.adult) || 1
        }
      ],
      showOnlyNonStopFlight: false,
      additionalParameters: {
        getOptionsParameters: {
          flightBaggageGetOption: 0
        }
      },
      acceptPendingProviders: false,
      forceFlightBundlePackage: false,
      disablePackageOfferTotalPrice: true,
      calculateFlightFees: false,
      flightClasses: [
        parseInt(body.cabin) || 0 // 0=Economy, 1=Business, 2=First
      ],
      Currency: 'EUR',
      Culture: 'fr-FR'
    };

    // Add children if specified
    if (body.child && parseInt(body.child) > 0) {
      paximumPayload.Passengers.push({
        type: 2, // Child
        count: parseInt(body.child)
      });
    }

    // Add infants if specified
    if (body.infant && parseInt(body.infant) > 0) {
      paximumPayload.Passengers.push({
        type: 3, // Infant
        count: parseInt(body.infant)
      });
    }

    // For RoundTrip, add Night (number of nights, NOT CheckOut)
    if (body.returnDate) {
      const nights = calculateNights(body.departureDate, body.returnDate);
      paximumPayload.Night = nights;
    }

    console.log('🚀 Paximum Request:', JSON.stringify(paximumPayload, null, 2));

    // Call Paximum API WITH Authorization header
    const searchResponse = await fetch(`${PAXIMUM_API_BASE}/api/productservice/pricesearch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}` // REQUIRED
      },
      body: JSON.stringify(paximumPayload)
    });

    const searchData = await searchResponse.json();
    
    console.log('📦 Paximum Response:', JSON.stringify(searchData.header, null, 2));

    if (!searchData.header?.success) {
      return NextResponse.json(
        { 
          error: 'Paximum search failed',
          details: searchData.header?.messages || searchData
        },
        { status: 500 }
      );
    }

    // Extract flights with offers (USE flight.items NOT flight.legs)
    const flights = searchData.body?.flights || [];
    const offers = [];

    for (const flight of flights) {
      if (flight.offers && flight.offers.length > 0) {
        for (const offer of flight.offers) {
          // Use flight.items (CORRECT structure from real API response)
          const firstItem = flight.items?.[0];
          const firstSegment = firstItem?.segments?.[0];
          const lastSegment = firstItem?.segments?.[firstItem.segments.length - 1];

          offers.push({
            offerId: offer.offerId,
            price: offer.price?.amount || 0,
            currency: offer.price?.currency || 'EUR',
            airline: firstSegment?.operatingAirline?.name || 'Unknown',
            departure: firstSegment?.departureDate,
            arrival: lastSegment?.arrivalDate,
            duration: firstItem?.duration,
            stops: (firstItem?.segments?.length || 1) - 1,
            cabinClass: offer.services?.[0]?.cabinClass?.name || 'Economy'
          });
        }
      }
    }

    console.log(`✅ Found ${offers.length} offers`);

    return NextResponse.json({
      success: true,
      searchId: searchData.body?.searchId,
      expiresOn: searchData.body?.expiresOn,
      offers,
      totalResults: offers.length
    });

  } catch (error: any) {
    console.error('❌ Search error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
