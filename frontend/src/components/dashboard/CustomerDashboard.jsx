import React from 'react';
import { 
  Truck, ShoppingBag, PlusCircle, DollarSign, ShieldCheck, 
  MapPin, Calendar, Clock, ArrowRight, Shield, RefreshCw 
} from 'lucide-react';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function CustomerDashboard({
  user,
  onNavigate,
  activeBooking,
  recentBookings,
  onOpenBookingDetail
}) {
  return (
    <div className="content-wrapper">
      
      {/* Hero Greeting & Quick Action Hero Banner */}
      <div style={{
        background: 'radial-gradient(circle at 12% 15%, rgba(249, 115, 22, 0.22) 0%, transparent 45%), radial-gradient(circle at 88% 85%, rgba(37, 99, 235, 0.16) 0%, transparent 45%), linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #0F172A 100%)',
        color: '#FFFFFF',
        borderRadius: '24px',
        padding: '32px 28px',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.2)'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(249, 115, 22, 0.2)', color: '#F97316', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '12px' }}>
            <Truck size={13} />
            <span>Transmaa Logistics Platform</span>
          </div>

          <h1 className="title-lg" style={{ color: '#FFFFFF', fontSize: '1.8rem', marginBottom: '6px' }}>
            {getGreeting()}, {user?.name || 'Customer'}!
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: '560px', marginBottom: '24px' }}>
            Book reliable trucks for goods & house shifting, browse verified pre-owned commercial vehicles, or apply for instant vehicle financing.
          </p>

          <button 
            onClick={() => onNavigate('book-truck')}
            className="btn btn-primary btn-lg"
          >
            <Truck size={20} /> Book a Truck Now
          </button>
        </div>
      </div>

      {/* Quick Action Feature Cards Grid */}
      <div style={{ marginBottom: '32px' }}>
        <h3 className="title-md" style={{ marginBottom: '16px' }}>Quick Services & Actions</h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          
          {/* Action 1: Book a Truck */}
          <div 
            onClick={() => onNavigate('book-truck')}
            className="card card-clickable"
            style={{ borderLeft: '4px solid #F97316' }}
          >
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#FFF7ED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}>
              <Truck size={24} color="#F97316" />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
              Book a Truck
            </h4>
            <p className="subtitle" style={{ fontSize: '0.8rem' }}>
              Fast pickup for raw material, textiles, machinery & shifting
            </p>
          </div>

          {/* Action 2: My Bookings */}
          <div 
            onClick={() => onNavigate('bookings')}
            className="card card-clickable"
            style={{ borderLeft: '4px solid #3B82F6' }}
          >
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}>
              <ShieldCheck size={24} color="#3B82F6" />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
              My Bookings
            </h4>
            <p className="subtitle" style={{ fontSize: '0.8rem' }}>
              Track live loads, driver location & historical trip invoices
            </p>
          </div>

          {/* Action 3: Buy Vehicles */}
          <div 
            onClick={() => onNavigate('buy-vehicles')}
            className="card card-clickable"
            style={{ borderLeft: '4px solid #10B981' }}
          >
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#ECFDF5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}>
              <ShoppingBag size={24} color="#10B981" />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
              Buy Vehicles
            </h4>
            <p className="subtitle" style={{ fontSize: '0.8rem' }}>
              Browse pre-owned RC verified mini trucks, pickups & heavy trucks
            </p>
          </div>

          {/* Action 4: Sell Vehicle */}
          <div 
            onClick={() => onNavigate('sell-vehicle')}
            className="card card-clickable"
            style={{ borderLeft: '4px solid #8B5CF6' }}
          >
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#F5F3FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}>
              <PlusCircle size={24} color="#8B5CF6" />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
              Sell Vehicle
            </h4>
            <p className="subtitle" style={{ fontSize: '0.8rem' }}>
              List your commercial truck for sale after Transmaa verification
            </p>
          </div>

          {/* Action 5: Finance & Insurance */}
          <div 
            onClick={() => onNavigate('finance')}
            className="card card-clickable"
            style={{ borderLeft: '4px solid #F59E0B' }}
          >
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}>
              <DollarSign size={24} color="#F59E0B" />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
              Finance & Insurance
            </h4>
            <p className="subtitle" style={{ fontSize: '0.8rem' }}>
              Vehicle loan EMI calculator & instant commercial insurance quote
            </p>
          </div>

        </div>
      </div>

      {/* Active Booking Live Card (If present) */}
      {activeBooking && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 className="title-md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={18} color="#F97316" className="spin-slow" /> Active Live Booking Tracking
            </h3>
            <button 
              onClick={() => onOpenBookingDetail(activeBooking)} 
              className="btn-ghost" 
              style={{ color: '#F97316', fontWeight: '700', fontSize: '0.85rem' }}
            >
              Full Details <ArrowRight size={14} />
            </button>
          </div>

          <div 
            onClick={() => onOpenBookingDetail(activeBooking)}
            className="card card-clickable" 
            style={{ backgroundColor: '#FFF7ED', border: '1.5px solid #FFEDD5', padding: '20px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span className="badge badge-verification" style={{ fontSize: '0.7rem', marginRight: '8px' }}>
                  REF: {activeBooking.id}
                </span>
                <span className="badge badge-assigned">
                  {activeBooking.status}
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Pickup: {activeBooking.pickupDate} ({activeBooking.pickupTime})
              </span>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '14px 18px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>From Pickup</span>
                <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>{activeBooking.fromLocation}</strong>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Destination</span>
                <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>{activeBooking.toLocation}</strong>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Vehicle & Goods</span>
                <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>{activeBooking.truckType} • {activeBooking.goodsCategory}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Bookings Card List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 className="title-md">Recent Booking History</h3>
          <button
            onClick={() => onNavigate('bookings')}
            className="btn-ghost"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#F97316', fontWeight: '700', fontSize: '0.85rem', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            View All History <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentBookings.slice(0, 3).map((item) => (
            <div 
              key={item.id}
              onClick={() => onOpenBookingDetail(item)}
              className="card card-clickable"
              style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0F172A'
                }}>
                  <Truck size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: '0.92rem', color: '#0F172A', display: 'block' }}>
                    {item.fromLocation} → {item.toLocation}
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    {item.truckType} • {item.goodsCategory} • {item.createdDate}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className={`badge ${item.currentStage === 6 ? 'badge-delivered' : 'badge-verification'}`}>
                  {item.status}
                </span>
                <strong style={{ fontSize: '0.95rem', color: '#F97316' }}>
                  ₹{item.estimatedFare?.toLocaleString()}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
