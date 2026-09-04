import React from 'react';
import { Truck, Bell, User, LogIn, PhoneCall, ShieldCheck, MapPin } from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  user, 
  onOpenAuth, 
  onOpenNotifications, 
  unreadNotificationsCount 
}) {
  return (
    <header style={{
      backgroundColor: '#0F172A',
      color: '#FFFFFF',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid #1E293B',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
    }}>
      <div className="content-wrapper" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo & Tag */}
        <div 
          onClick={() => setCurrentTab('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.4)'
          }}>
            <Truck size={24} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.03em', color: '#FFFFFF' }}>
                TRANSMAA
              </span>
              <span style={{
                backgroundColor: '#F97316',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: '800',
                padding: '2px 6px',
                borderRadius: '4px',
                letterSpacing: '0.05em'
              }}>
                LOGISTICS
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#94A3B8', margin: 0, fontWeight: 500 }}>
              Smart Truck Booking & Vehicle Trading
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" style={{ display: 'none', gap: '8px' }}>
          {[
            { id: 'home', label: 'Home' },
            { id: 'book-truck', label: 'Book Truck' },
            { id: 'bookings', label: 'My Bookings' },
            { id: 'buy-vehicles', label: 'Buy Vehicles' },
            { id: 'sell-vehicle', label: 'Sell Vehicle' },
            { id: 'finance', label: 'Finance & Insurance' },
          ].map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isActive ? '#F97316' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  fontWeight: isActive ? '700' : '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Support HotLine badge */}
          <div style={{ display: 'none', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '0.85rem' }} className="hotline-badge">
            <PhoneCall size={15} color="#F97316" />
            <span>24/7 Support: <strong>1800-TRANSMAA</strong></span>
          </div>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            style={{
              position: 'relative',
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              color: '#FFFFFF',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Notifications"
          >
            <Bell size={19} />
            {unreadNotificationsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: '#F97316',
                color: '#FFFFFF',
                fontSize: '0.68rem',
                fontWeight: '800',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #0F172A'
              }}>
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Authentication State Button */}
          {user ? (
            <button
              onClick={() => setCurrentTab('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                color: '#FFFFFF',
                padding: '6px 14px 6px 8px',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#F97316',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.85rem'
              }}>
                {user.name ? user.name[0] : 'C'}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                {user.name || user.phone}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn btn-primary btn-sm"
              style={{ padding: '8px 16px', borderRadius: '10px' }}
            >
              <LogIn size={16} />
              <span>Login / Register</span>
            </button>
          )}

        </div>

      </div>

      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex !important;
          }
          .hotline-badge {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
