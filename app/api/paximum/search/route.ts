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

    // Build Paximum payload (NO TOKEN REQUIRED for PriceSearch)
    const serviceType = body.returnDate ? '2' : '1'; // 2=RoundTrip, 1=OneWay
    
    const paximumPayload: any = {
      ProductType: 3, // Flight
      ServiceTypes: [serviceType],
      CheckIn: body.departureDate,
      DepartureLocations: [
        {
          id: body.from.toUpperCase(),
          type: 2 // Type 2 for IATA code
        }
      ],
      ArrivalLocations: [
        {
          id: body.to.toUpperCase(),
          type: 2 // Type 2 for IATA code
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

    // For RoundTrip, add return date
    if (body.returnDate) {
      paximumPayload.CheckOut = body.returnDate;
    }

    console.log('🚀 Paximum Request:', JSON.stringify(paximumPayload, null, 2));

    // Call Paximum API (NO Authorization needed for PriceSearch)
    const searchResponse = await fetch(`${PAXIMUM_API_BASE}/api/productservice/pricesearch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
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

    // Extract flights with offers
    const flights = searchData.body?.flights || [];
    const offers = [];

    for (const flight of flights) {
      if (flight.offers && flight.offers.length > 0) {
        for (const offer of flight.offers) {
          offers.push({
            offerId: offer.offerId,
            price: offer.price?.amount || 0,
            currency: offer.price?.currency || 'EUR',
            airline: flight.legs?.[0]?.segments?.[0]?.operatingAirline?.name || 'Unknown',
            departure: flight.legs?.[0]?.segments?.[0]?.departureDate,
            arrival: flight.legs?.[0]?.segments?.[flight.legs[0].segments.length - 1]?.arrivalDate,
            duration: flight.legs?.[0]?.duration,
            stops: (flight.legs?.[0]?.segments?.length || 1) - 1,
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
