import React from 'react';
import { Home, Truck, ShoppingBag, PlusCircle, User, ShieldCheck } from 'lucide-react';

export default function BottomNav({ currentTab, setCurrentTab }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'book-truck', label: 'Book Truck', icon: Truck },
    { id: 'bookings', label: 'Bookings', icon: ShieldCheck },
    { id: 'buy-vehicles', label: 'Buy', icon: ShoppingBag },
    { id: 'sell-vehicle', label: 'Sell', icon: PlusCircle },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div 
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#0F172A',
        borderTop: '1px solid #1E293B',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 4px 12px 4px',
        zIndex: 1000,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.2)'
      }}
    >
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: isActive ? '#F97316' : '#94A3B8',
              cursor: 'pointer',
              flex: 1,
              padding: '4px 0',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              padding: '4px 12px',
              borderRadius: '12px',
              backgroundColor: isActive ? 'rgba(249, 115, 22, 0.15)' : 'transparent'
            }}>
              <IconComponent size={20} color={isActive ? '#F97316' : '#94A3B8'} />
            </div>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: isActive ? '700' : '500'
            }}>
              {item.label}
            </span>
          </button>
        );
      })}

      <style>{`
        @media (min-width: 1024px) {
          .mobile-bottom-nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
