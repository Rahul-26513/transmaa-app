import React, { useState } from 'react';
import { MapPin, ArrowRightLeft, Navigation, Clock, CheckCircle2 } from 'lucide-react';

const POPULAR_LOCATIONS = [
  'Sircilla Textile Park',
  'Hitech City, Hyderabad',
  'Kukatpally Housing Board, Hyderabad',
  'Sanathnagar Industrial Estate',
  'Auto Nagar, Vijayawada',
  'Warangal Industrial Zone',
  'Banjara Hills, Hyderabad',
  'Secunderabad Railway Station Area'
];

export default function Step1Route({ bookingData, updateBookingData, onNext }) {
  const [fromLoc, setFromLoc] = useState(bookingData.fromLocation || 'Sircilla Textile Park');
  const [toLoc, setToLoc] = useState(bookingData.toLocation || 'Hitech City, Hyderabad');
  const [error, setError] = useState('');

  const handleSwap = () => {
    const temp = fromLoc;
    setFromLoc(toLoc);
    setToLoc(temp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fromLoc.trim()) {
      setError('Please specify a pickup location.');
      return;
    }
    if (!toLoc.trim()) {
      setError('Please specify a delivery location.');
      return;
    }
    if (fromLoc === toLoc) {
      setError('Pickup and delivery locations cannot be identical.');
      return;
    }
    setError('');
    updateBookingData({
      fromLocation: fromLoc,
      toLocation: toLoc,
      distanceKm: Math.floor(80 + Math.random() * 60) // Simulated route distance
    });
    onNext();
  };

  return (
    <div className="card" style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          backgroundColor: '#FFF7ED',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Navigation size={22} color="#F97316" />
        </div>
        <div>
          <h3 className="title-md" style={{ margin: 0 }}>Select Pickup & Delivery Route</h3>
          <p className="subtitle">Step 1 of 5 — Enter location details</p>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#FEE2E2',
          border: '1px solid #FCA5A5',
          color: '#991B1B',
          padding: '10px 14px',
          borderRadius: '8px',
          fontSize: '0.88rem',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* From Location */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} color="#10B981" />
              <span>Pickup Location (From)</span>
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                className="form-input"
                placeholder="Type city, industrial park or landmark..."
                value={fromLoc}
                onChange={(e) => setFromLoc(e.target.value)}
                style={{ fontWeight: '600', paddingRight: '40px' }}
              />
            </div>
          </div>

          {/* Swap Button */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '-6px 0' }}>
            <button
              type="button"
              onClick={handleSwap}
              className="btn btn-outline"
              style={{
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                padding: 0,
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                backgroundColor: '#FFFFFF'
              }}
              title="Swap From & To Locations"
            >
              <ArrowRightLeft size={18} color="#F97316" />
            </button>
          </div>

          {/* To Location */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} color="#EF4444" />
              <span>Delivery Location (To)</span>
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                className="form-input"
                placeholder="Type destination city or address..."
                value={toLoc}
                onChange={(e) => setToLoc(e.target.value)}
                style={{ fontWeight: '600' }}
              />
            </div>
          </div>

        </div>

        {/* Quick Location Chips */}
        <div style={{ marginTop: '20px' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748B', marginBottom: '8px' }}>
            Popular Routes & Destinations:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {POPULAR_LOCATIONS.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  if (!fromLoc) setFromLoc(loc);
                  else setToLoc(loc);
                }}
                className="btn-ghost"
                style={{
                  fontSize: '0.75rem',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  backgroundColor: '#F1F5F9',
                  border: '1px solid #E2E8F0'
                }}
              >
                + {loc}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: '28px' }}>
          Confirm Locations & Continue
        </button>
      </form>
    </div>
  );
}
