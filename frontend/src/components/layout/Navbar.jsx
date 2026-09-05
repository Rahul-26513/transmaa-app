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
      background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
      color: '#FFFFFF',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid #1E293B',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
    }}>
      <div className="content-wrapper" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>

        {/* Brand Logo & Tag */}
        <div
          onClick={() => setCurrentTab('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0, minWidth: 0 }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.4)',
            flexShrink: 0
          }}>
            <Truck size={20} color="#FFFFFF" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
              <span className="brand-wordmark" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.15rem', fontWeight: '800', letterSpacing: '-0.03em', color: '#FFFFFF' }}>
                Tran<span style={{ color: '#F97316' }}>Smaa</span>
              </span>
              <span className="brand-badge" style={{
                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
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
            <p className="brand-tagline" style={{ fontSize: '0.72rem', color: '#94A3B8', margin: 0, fontWeight: 500, whiteSpace: 'nowrap' }}>
              Smart Truck Booking & Vehicle Trading
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" style={{ display: 'none', gap: '4px', flex: '1 1 0%', minWidth: 0, justifyContent: 'center', overflowX: 'auto', scrollbarWidth: 'none' }}>
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
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isActive ? '#F97316' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  fontWeight: isActive ? '700' : '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Support Hotline */}
          <a
            href="tel:1800-TRANSMAA"
            aria-label="24x7 Support Hotline: 1800-TRANSMAA"
            title="24x7 Support Hotline: 1800-TRANSMAA"
            className="hotline-btn"
            style={{
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              color: '#FFFFFF',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              textDecoration: 'none'
            }}
          >
            <PhoneCall size={16} color="#F97316" />
          </a>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            style={{
              position: 'relative',
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              color: '#FFFFFF',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            title="Notifications"
          >
            <Bell size={19} />
            {unreadNotificationsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
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
                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.85rem'
              }}>
                {user.name ? user.name[0] : 'C'}
              </div>
              <span className="auth-text" style={{ fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap' }}>
                {user.name || user.phone}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn btn-primary btn-sm"
              style={{ padding: '8px 16px', borderRadius: '10px', whiteSpace: 'nowrap' }}
            >
              <LogIn size={16} />
              <span className="auth-text">Login / Register</span>
            </button>
          )}

        </div>

      </div>

      <style>{`
        .brand-tagline, .brand-badge {
          display: none;
        }
        .hotline-btn {
          display: none;
        }
        .auth-text {
          display: none;
        }
        @media (min-width: 480px) {
          .brand-badge {
            display: inline-block;
          }
          .auth-text {
            display: inline;
          }
        }
        @media (min-width: 640px) {
          .hotline-btn {
            display: flex;
          }
        }
        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex !important;
          }
        }
        @media (min-width: 1280px) {
          .brand-tagline {
            display: block;
          }
        }
      `}</style>
    </header>
  );
}
