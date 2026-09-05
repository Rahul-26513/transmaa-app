import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import Footer from '../components/common/Footer';

const ACCENT = '#F97316';
const DARK = '#0F172A';

const PORTALS = [
  {
    id: 'customer',
    title: 'Customer',
    description: 'Book a truck, track your loads, buy or sell a commercial vehicle, and apply for finance & insurance.',
    icon: Package,
    path: '/customer'
  },
  {
    id: 'staff',
    title: 'Staff',
    description: 'Verify incoming orders, manage drivers, approve vehicle listings, and follow up on leads.',
    icon: ShieldCheck,
    path: '/staff'
  },
  {
    id: 'driver',
    title: 'Driver',
    description: 'Register or log in, browse available loads on your route, and manage your accepted trips.',
    icon: Truck,
    path: '/driver'
  }
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '60px 20px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #F97316 0%, #F7931E 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(249, 115, 22, 0.25)',
          margin: '0 auto 20px auto'
        }}>
          <Truck size={38} color="#FFFFFF" />
        </div>

        <h1 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: '2.2rem',
          fontWeight: 800,
          color: DARK,
          letterSpacing: '-0.02em',
          margin: 0
        }}>
          Tran<span style={{ color: ACCENT }}>Smaa</span>
        </h1>

        <p style={{
          color: '#64748B',
          fontSize: '0.95rem',
          marginTop: '8px'
        }}>
          Select your portal to proceed
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
        width: '100%',
        maxWidth: '920px'
      }}>
        {PORTALS.map((portal) => {
          const Icon = portal.icon;
          return (
            <button
              key={portal.id}
              onClick={() => navigate(portal.path)}
              style={{
                textAlign: 'left',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '20px',
                padding: '28px 24px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 6px 20px rgba(15, 23, 42, 0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = ACCENT;
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 32px rgba(249, 115, 22, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(15, 23, 42, 0.08)';
              }}
            >
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={26} color="#FFFFFF" />
              </div>

              <div>
                <h2 style={{ color: DARK, fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  {portal.title}
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '6px', lineHeight: '1.5' }}>
                  {portal.description}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: ACCENT,
                fontSize: '0.85rem',
                fontWeight: 700,
                marginTop: 'auto'
              }}>
                Enter Portal <ArrowRight size={16} />
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 'auto', width: '100%' }}>
        <p style={{ color: '#94A3B8', fontSize: '0.78rem', marginTop: '48px', textAlign: 'center' }}>
          Smart Truck Booking & Vehicle Trading
        </p>
        <Footer />
      </div>
    </div>
  );
}
