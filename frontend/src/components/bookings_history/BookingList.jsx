import React, { useState } from 'react';
import { 
  ShieldCheck, Truck, MapPin, Calendar, Clock, ArrowRight, Eye, Plus, Package 
} from 'lucide-react';
import BookingDetailModal from './BookingDetailModal';

export default function BookingList({ 
  bookings, 
  onStartBooking, 
  onUpdateStatus, 
  showToast 
}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return b.currentStage > 1 && b.currentStage < 6;
    if (activeFilter === 'pending') return b.currentStage === 1;
    if (activeFilter === 'completed') return b.currentStage === 6;
    return true;
  });

  const getStatusBadge = (b) => {
    const stage = b.currentStage || 1;
    switch (stage) {
      case 1:
        return <span className="badge badge-pending">Under Verification</span>;
      case 2:
        return <span className="badge badge-verification">Transmaa Verifying</span>;
      case 3:
        return <span className="badge badge-assigned">Driver Assigned</span>;
      case 4:
        return <span className="badge badge-confirmed">At Pickup</span>;
      case 5:
        return <span className="badge badge-ontheway">On the Way</span>;
      case 6:
        return <span className="badge badge-delivered">Delivered</span>;
      default:
        return <span className="badge badge-pending">Pending</span>;
    }
  };

  return (
    <div className="content-wrapper">
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="title-lg">My Bookings & History</h2>
          <p className="subtitle">Track live loads and past dispatch records</p>
        </div>
        <button onClick={onStartBooking} className="btn btn-primary btn-lg">
          <Plus size={18} /> Book New Truck
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '24px' }}>
        {[
          { id: 'all', label: 'All Bookings', count: bookings.length },
          { id: 'active', label: 'Active Loads', count: bookings.filter(b => b.currentStage > 1 && b.currentStage < 6).length },
          { id: 'pending', label: 'Pending Verification', count: bookings.filter(b => b.currentStage === 1).length },
          { id: 'completed', label: 'Delivered', count: bookings.filter(b => b.currentStage === 6).length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: `1.5px solid ${activeFilter === tab.id ? '#F97316' : '#E2E8F0'}`,
              backgroundColor: activeFilter === tab.id ? '#FFF7ED' : '#FFFFFF',
              color: activeFilter === tab.id ? '#F97316' : '#64748B',
              fontWeight: activeFilter === tab.id ? '700' : '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{tab.label}</span>
            <span style={{
              backgroundColor: activeFilter === tab.id ? '#F97316' : '#F1F5F9',
              color: activeFilter === tab.id ? '#FFFFFF' : '#64748B',
              borderRadius: '10px',
              padding: '2px 6px',
              fontSize: '0.72rem'
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List Cards */}
      {filteredBookings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
          <Truck size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <h3 className="title-md" style={{ color: '#0F172A' }}>No Bookings Found</h3>
          <p className="subtitle" style={{ marginTop: '4px', marginBottom: '20px' }}>
            You don't have any bookings under this filter category.
          </p>
          <button onClick={onStartBooking} className="btn btn-primary">
            Book a Truck Now
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => setSelectedBooking(booking)}
              className="card card-clickable"
              style={{ padding: '20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '1rem', color: '#0F172A' }}>{booking.id}</strong>
                    {getStatusBadge(booking)}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', marginTop: '2px' }}>
                    Booked on {booking.createdDate}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Total Amount</span>
                  <strong style={{ fontSize: '1.15rem', color: '#F97316' }}>
                    ₹{booking.estimatedFare?.toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* Route Summary */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '10px',
                padding: '12px 16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                marginBottom: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="#10B981" />
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>From</span>
                    <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>{booking.fromLocation}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="#EF4444" />
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>To</span>
                    <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>{booking.toLocation}</strong>
                  </div>
                </div>
              </div>

              {/* Truck & Goods */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Truck size={15} color="#F97316" /> {booking.truckType}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Package size={15} color="#3B82F6" /> {booking.goodsCategory}
                  </span>
                </div>

                <button 
                  className="btn-ghost"
                  style={{ color: '#F97316', fontWeight: '700', fontSize: '0.82rem', padding: 0 }}
                >
                  View Details & Tracking <ArrowRight size={14} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdateStatus={onUpdateStatus}
          showToast={showToast}
        />
      )}

    </div>
  );
}
