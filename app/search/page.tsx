'use client';

import { useState } from 'react';

export default function SearchPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [searchId, setSearchId] = useState<string | null>(null);

  const [form, setForm] = useState({
    from: 'BRU',
    to: 'IST',
    departureDate: '',
    returnDate: '',
    adult: 1,
    child: 0,
    infant: 0,
    cabin: '1'
  });

  const updateForm = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = async () => {
    if (!form.departureDate) {
      setError('Veuillez sélectionner une date de départ');
      return;
    }

    if (form.returnDate && form.returnDate < form.departureDate) {
      setError('La date de retour doit être après la date de départ');
      return;
    }

    setLoading(true);
    setError(null);
    setOffers([]);
    setSearchId(null);

    try {
      const response = await fetch('/api/paximum/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setSearchId(data.searchId);
      setOffers(data.offers || []);

    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0B0B0B 0%, #1F1F1F 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: '300', 
            color: '#F5F5F5',
            letterSpacing: '2px',
            marginBottom: '10px'
          }}>
            JOLIE TOURS ✦
          </h1>
          <p style={{ 
            color: '#C9A24D', 
            fontSize: '18px',
            fontWeight: '300'
          }}>
            Recherche de vols de luxe
          </p>
        </div>

        {/* Search Form */}
        <div style={{ 
          background: 'rgba(31, 31, 31, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(201, 162, 77, 0.2)',
          borderRadius: '16px',
          padding: '40px',
          marginBottom: '40px'
        }}>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            
            {/* Departure */}
            <div>
              <label style={{ 
                display: 'block',
                color: '#C9A24D', 
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                Départ
              </label>
              <input
                type="text"
                placeholder="BRU"
                value={form.from}
                onChange={(e) => updateForm('from', e.target.value.toUpperCase())}
                maxLength={3}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#0B0B0B',
                  border: '1px solid rgba(201, 162, 77, 0.3)',
                  borderRadius: '8px',
                  color: '#F5F5F5',
                  fontSize: '16px',
                  fontFamily: 'monospace',
                  outline: 'none'
                }}
              />
            </div>

            {/* Arrival */}
            <div>
              <label style={{ 
                display: 'block',
                color: '#C9A24D', 
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                Arrivée
              </label>
              <input
                type="text"
                placeholder="IST"
                value={form.to}
                onChange={(e) => updateForm('to', e.target.value.toUpperCase())}
                maxLength={3}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#0B0B0B',
                  border: '1px solid rgba(201, 162, 77, 0.3)',
                  borderRadius: '8px',
                  color: '#F5F5F5',
                  fontSize: '16px',
                  fontFamily: 'monospace',
                  outline: 'none'
                }}
              />
            </div>

            {/* Departure Date */}
            <div>
              <label style={{ 
                display: 'block',
                color: '#C9A24D', 
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                Date départ
              </label>
              <input
                type="date"
                value={form.departureDate}
                onChange={(e) => updateForm('departureDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#0B0B0B',
                  border: '1px solid rgba(201, 162, 77, 0.3)',
                  borderRadius: '8px',
                  color: '#F5F5F5',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Return Date */}
            <div>
              <label style={{ 
                display: 'block',
                color: '#C9A24D', 
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                Date retour
              </label>
              <input
                type="date"
                value={form.returnDate}
                onChange={(e) => updateForm('returnDate', e.target.value)}
                min={form.departureDate || new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#0B0B0B',
                  border: '1px solid rgba(201, 162, 77, 0.3)',
                  borderRadius: '8px',
                  color: '#F5F5F5',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>

          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            
            {/* Adults */}
            <div>
              <label style={{ 
                display: 'block',
                color: '#C9A24D', 
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                Adultes
              </label>
              <select
                value={form.adult}
                onChange={(e) => updateForm('adult', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#0B0B0B',
                  border: '1px solid rgba(201, 162, 77, 0.3)',
                  borderRadius: '8px',
                  color: '#F5F5F5',
                  fontSize: '16px',
                  outline: 'none'
                }}
              >
                {[1,2,3,4,5,6,7,8,9].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Children */}
            <div>
              <label style={{ 
                display: 'block',
                color: '#C9A24D', 
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                Enfants
              </label>
              <select
                value={form.child}
                onChange={(e) => updateForm('child', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#0B0B0B',
                  border: '1px solid rgba(201, 162, 77, 0.3)',
                  borderRadius: '8px',
                  color: '#F5F5F5',
                  fontSize: '16px',
                  outline: 'none'
                }}
              >
                {[0,1,2,3,4,5,6].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Infants */}
            <div>
              <label style={{ 
                display: 'block',
                color: '#C9A24D', 
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                Bébés
              </label>
              <select
                value={form.infant}
                onChange={(e) => updateForm('infant', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#0B0B0B',
                  border: '1px solid rgba(201, 162, 77, 0.3)',
                  borderRadius: '8px',
                  color: '#F5F5F5',
                  fontSize: '16px',
                  outline: 'none'
                }}
              >
                {[0,1,2,3,4].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Cabin */}
            <div>
              <label style={{ 
                display: 'block',
                color: '#C9A24D', 
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                Classe
              </label>
              <select
                value={form.cabin}
                onChange={(e) => updateForm('cabin', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#0B0B0B',
                  border: '1px solid rgba(201, 162, 77, 0.3)',
                  borderRadius: '8px',
                  color: '#F5F5F5',
                  fontSize: '16px',
                  outline: 'none'
                }}
              >
                <option value="1">Economy</option>
                <option value="2">Business</option>
                <option value="3">First</option>
              </select>
            </div>

          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? '#666' : 'linear-gradient(135deg, #C9A24D 0%, #B89043 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#0B0B0B',
              fontSize: '18px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Recherche en cours...' : 'Rechercher ✦'}
          </button>

        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '16px',
            background: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            borderRadius: '8px',
            color: '#FCA5A5',
            marginBottom: '20px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Search ID */}
        {searchId && (
          <div style={{
            padding: '12px',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '8px',
            color: '#86EFAC',
            fontSize: '14px',
            marginBottom: '20px'
          }}>
            <strong>Search ID:</strong> {searchId}
          </div>
        )}

        {/* Results */}
        {offers.length > 0 && (
          <div>
            <h2 style={{
              color: '#C9A24D',
              fontSize: '24px',
              fontWeight: '300',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              {offers.length} vol{offers.length > 1 ? 's' : ''} trouvé{offers.length > 1 ? 's' : ''}
            </h2>

            <div style={{ display: 'grid', gap: '16px' }}>
              {offers.map((offer, index) => (
                <div
                  key={offer.offerId || index}
                  style={{
                    background: 'rgba(31, 31, 31, 0.6)',
                    border: '1px solid rgba(201, 162, 77, 0.2)',
                    borderRadius: '12px',
                    padding: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(201, 162, 77, 0.5)';
                    e.currentTarget.style.background = 'rgba(31, 31, 31, 0.8)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(201, 162, 77, 0.2)';
                    e.currentTarget.style.background = 'rgba(31, 31, 31, 0.6)';
                  }}
                >
                  <div>
                    <p style={{ color: '#F5F5F5', fontSize: '20px', fontWeight: '500', marginBottom: '8px' }}>
                      {offer.airline}
                    </p>
                    <p style={{ color: '#999', fontSize: '14px', fontFamily: 'monospace' }}>
                      {offer.stops === 0 ? 'Direct' : `${offer.stops} escale${offer.stops > 1 ? 's' : ''}`}
                      {offer.duration ? ` • ${offer.duration}` : ''}
                    </p>
                    <p style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                      {offer.cabinClass}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#C9A24D', fontSize: '32px', fontWeight: '300' }}>
                      {offer.price.toFixed(2)} {offer.currency}
                    </p>
                    <p style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>
                      par personne
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && searchId && offers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: '#999', fontSize: '18px' }}>
              Aucun vol trouvé pour cette recherche
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
