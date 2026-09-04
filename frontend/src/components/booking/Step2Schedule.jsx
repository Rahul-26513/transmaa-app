import React, { useState } from 'react';
import { Calendar, Clock, ArrowLeft, Zap, Sun, Sunset, Moon } from 'lucide-react';

const TIME_SLOTS = [
  { id: 'express', title: 'Express Immediate', time: 'Within 45 Mins', icon: Zap, highlight: true },
  { id: 'morning', title: 'Morning Slot', time: '08:00 AM - 12:00 PM', icon: Sun },
  { id: 'afternoon', title: 'Afternoon Slot', time: '12:00 PM - 04:00 PM', icon: Sunset },
  { id: 'evening', title: 'Evening Slot', time: '04:00 PM - 08:00 PM', icon: Moon },
];

export default function Step2Schedule({ bookingData, updateBookingData, onNext, onBack }) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(bookingData.pickupDate || tomorrowStr);
  const [timeSlot, setTimeSlot] = useState(bookingData.pickupTime || 'morning');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) {
      setError('Please select a pickup date.');
      return;
    }
    const selectedSlotObj = TIME_SLOTS.find(s => s.id === timeSlot);
    updateBookingData({
      pickupDate: date,
      pickupTime: selectedSlotObj ? `${selectedSlotObj.title} (${selectedSlotObj.time})` : timeSlot
    });
    onNext();
  };

  return (
    <div className="card" style={{ maxWidth: '680px', margin: '0 auto' }}>
      <button 
        type="button" 
        onClick={onBack}
        className="btn-ghost"
        style={{ padding: '4px 8px', marginBottom: '12px', fontSize: '0.85rem' }}
      >
        <ArrowLeft size={16} /> Back to Route
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
          <Calendar size={22} color="#F97316" />
        </div>
        <div>
          <h3 className="title-md" style={{ margin: 0 }}>Schedule Pickup Time</h3>
          <p className="subtitle">Step 2 of 5 — Select date & convenient slot</p>
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
        
        {/* Date Selection */}
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label">Pickup Date</label>
          <div className="input-wrapper">
            <input
              type="date"
              className="form-input"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              style={{ fontWeight: '600', fontSize: '1rem' }}
            />
          </div>
        </div>

        {/* Time Slots Grid */}
        <div className="form-group">
          <label className="form-label" style={{ marginBottom: '12px' }}>Preferred Time Slot</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            {TIME_SLOTS.map((slot) => {
              const IconComp = slot.icon;
              const isSelected = timeSlot === slot.id;
              return (
                <div
                  key={slot.id}
                  onClick={() => setTimeSlot(slot.id)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: `1.5px solid ${isSelected ? '#F97316' : '#E2E8F0'}`,
                    backgroundColor: isSelected ? '#FFF7ED' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: isSelected ? '0 4px 12px rgba(249, 115, 22, 0.15)' : 'none'
                  }}
                >
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: isSelected ? '#F97316' : '#F1F5F9',
                    color: isSelected ? '#FFFFFF' : '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <IconComp size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>
                      {slot.title}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>
                      {slot.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: '28px' }}>
          Continue to Select Goods
        </button>
      </form>
    </div>
  );
}
