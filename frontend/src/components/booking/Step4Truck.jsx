import React, { useState } from 'react';
import { Truck, ArrowLeft, Check, Shield, Info, Gauge } from 'lucide-react';
import { TRUCK_TYPES } from '../../mockData/mockData';

export default function Step4Truck({ bookingData, updateBookingData, onNext, onBack }) {
  const [selectedTruckId, setSelectedTruckId] = useState(bookingData.truckType?.id || 'pickup-truck');
  const [error, setError] = useState('');

  const selectedTruckObj = TRUCK_TYPES.find(t => t.id === selectedTruckId);

  // Calculate estimated fare based on distance or base price
  const calculateFare = (truck) => {
    const dist = bookingData.distanceKm || 90;
    return Math.round(truck.basePrice + (dist * truck.perKmPrice));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTruckObj) {
      setError('Please select a truck type.');
      return;
    }
    const estimatedFare = calculateFare(selectedTruckObj);
    updateBookingData({
      truckType: selectedTruckObj,
      estimatedFare
    });
    onNext();
  };

  return (
    <div className="card" style={{ maxWidth: '880px', margin: '0 auto' }}>
      <button 
        type="button" 
        onClick={onBack}
        className="btn-ghost"
        style={{ padding: '4px 8px', marginBottom: '12px', fontSize: '0.85rem' }}
      >
        <ArrowLeft size={16} /> Back to Goods Selection
      </button>

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
          <Truck size={22} color="#F97316" />
        </div>
        <div>
          <h3 className="title-md" style={{ margin: 0 }}>Select Vehicle / Truck Type</h3>
          <p className="subtitle">Step 4 of 5: Choose optimal payload capacity</p>
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
        <div className="truck-grid" style={{ marginBottom: '28px' }}>
          {TRUCK_TYPES.map((truck) => {
            const isSelected = selectedTruckId === truck.id;
            const fare = calculateFare(truck);
            return (
              <div
                key={truck.id}
                onClick={() => setSelectedTruckId(truck.id)}
                className={`truck-card ${isSelected ? 'selected' : ''}`}
              >
                {/* Truck Thumbnail */}
                <div style={{
                  width: '100px',
                  height: '80px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  backgroundColor: '#F1F5F9',
                  flexShrink: 0,
                  position: 'relative'
                }}>
                  <img
                    src={truck.image}
                    alt={truck.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{
                    display: 'none', width: '100%', height: '100%',
                    alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Truck size={28} color="#94A3B8" />
                  </div>
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                      color: '#FFFFFF',
                      borderRadius: '50%',
                      padding: '2px'
                    }}>
                      <Check size={12} />
                    </div>
                  )}
                </div>

                {/* Truck Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                        {truck.name}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
                        {truck.subName}
                      </p>
                    </div>
                    {truck.badge && (
                      <span className="badge badge-verification" style={{ fontSize: '0.65rem' }}>
                        {truck.badge}
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#334155', marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <span><strong>Payload:</strong> {truck.capacity}</span>
                    <span><strong>Size:</strong> {truck.dimensions}</span>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', fontStyle: 'italic' }}>
                    Suitable: {truck.suitableFor}
                  </p>

                  <div style={{
                    marginTop: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px dashed #E2E8F0',
                    paddingTop: '8px'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '600' }}>
                      ● {truck.availability}
                    </span>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>Est. Total Fare</span>
                      <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#F97316' }}>
                        ₹{fare.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          padding: '14px',
          borderRadius: '12px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Info size={20} color="#3B82F6" />
          <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>
            *Fares include base booking fee, driver allowance, and route toll estimates. Final invoice confirmed upon Transmaa staff verification.
          </p>
        </div>

        <button type="submit" className="btn btn-primary btn-full btn-lg">
          Book Pickup & Review Summary
        </button>
      </form>
    </div>
  );
}
