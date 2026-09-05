import React from 'react';
import {
  Truck, ShoppingBag, DollarSign, ShieldCheck, ArrowRight,
  ClipboardCheck, PackageCheck, LogIn
} from 'lucide-react';

const FEATURES = [
  {
    icon: Truck,
    title: 'Book a Truck',
    description: 'Fast pickup for raw material, textiles, machinery, and house shifting, across 11 goods categories and every truck type.',
    tab: 'book-truck',
    color: '#F97316',
    tint: '#FFF7ED'
  },
  {
    icon: ShoppingBag,
    title: 'Buy & Sell Vehicles',
    description: 'Browse Transmaa-verified pre-owned commercial vehicles, or list your own for sale.',
    tab: 'buy-vehicles',
    color: '#2563EB',
    tint: '#EFF6FF',
    public: true
  },
  {
    icon: DollarSign,
    title: 'Finance & Insurance',
    description: 'Vehicle loan EMI calculator and instant commercial insurance quotes.',
    tab: 'finance',
    color: '#10B981',
    tint: '#ECFDF5'
  }
];

const STEPS = [
  { icon: ClipboardCheck, title: 'Book Your Load', description: 'Pick your route, schedule, goods type, and truck.' },
  { icon: ShieldCheck, title: 'Transmaa Verifies', description: 'Our team confirms your load and assigns a verified driver.' },
  { icon: PackageCheck, title: 'Track & Receive', description: 'Follow your shipment until it\'s delivered.' }
];

export default function CustomerWelcome({ onNavigate, onOpenAuth }) {
  return (
    <div className="content-wrapper">

      {/* Hero */}
      <div style={{
        background: 'radial-gradient(circle at 12% 15%, rgba(249, 115, 22, 0.22) 0%, transparent 45%), radial-gradient(circle at 88% 85%, rgba(37, 99, 235, 0.16) 0%, transparent 45%), linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #0F172A 100%)',
        color: '#FFFFFF',
        borderRadius: '24px',
        padding: '48px 32px',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.2)',
        textAlign: 'center'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(249, 115, 22, 0.2)', color: '#F97316', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '18px' }}>
          <Truck size={13} />
          <span>Transmaa Logistics Platform</span>
        </div>

        <h1 className="title-lg" style={{ color: '#FFFFFF', fontSize: '2.1rem', marginBottom: '12px', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>
          Move Your Goods, Buy or Sell Any Vehicle, All in One Place
        </h1>

        <p style={{ color: '#94A3B8', fontSize: '1rem', maxWidth: '560px', margin: '0 auto 28px auto', lineHeight: '1.6' }}>
          Book reliable trucks for any shipment, browse verified pre-owned commercial vehicles, and get instant vehicle financing, trusted by shippers across Telangana.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onOpenAuth} className="btn btn-primary btn-lg">
            <LogIn size={18} /> Get Started
          </button>
          <button onClick={() => onNavigate('buy-vehicles')} className="btn btn-outline btn-lg" style={{ color: '#FFFFFF', borderColor: '#334155' }}>
            Browse Vehicles <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '18px',
        marginBottom: '40px'
      }}>
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.tab}
              onClick={() => (feature.public ? onNavigate(feature.tab) : onOpenAuth())}
              className="card card-clickable"
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                backgroundColor: feature.tint, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon size={22} color={feature.color} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>{feature.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '6px', lineHeight: '1.5' }}>{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* How it works */}
      <div style={{ marginBottom: '16px' }}>
        <h2 className="title-md" style={{ marginBottom: '20px', textAlign: 'center' }}>How Transmaa Works</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.title} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#FFF7ED',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto',
                  border: '2px solid #FFEDD5'
                }}>
                  <Icon size={24} color="#F97316" />
                </div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  {idx + 1}. {step.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
