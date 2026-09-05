import React, { useState } from 'react';
import {
  User, Phone, Mail, MapPin, ShieldCheck, LogOut, ChevronRight,
  Truck, ShoppingBag, DollarSign, HelpCircle, Edit2, Check
} from 'lucide-react';
import * as customerApi from '../../services/customerApi';

export default function UserProfile({ 
  user, 
  onLogout, 
  onNavigate, 
  bookingsCount, 
  listingsCount, 
  showToast 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      showToast('Customer ID not found. Please login again.', 'error');
      return;
    }

    try {
      const data = await customerApi.updateProfile(name, email);

      setIsEditing(false);

      showToast(
        'Profile information updated successfully!',
        'success'
      );

      console.log('Updated customer:', data.customer);

    } catch (error) {
      console.error('Profile update error:', error);

      showToast(
        'Failed to update profile. Please try again.',
        'error'
      );
    }
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();

    if (!supportMessage) return;

    setSupportSubmitted(true);

    showToast(
      'Support ticket submitted. Transmaa desk will respond in 2 hours.',
      'success'
    );
  };

  return (
    <div className="content-wrapper" style={{ maxWidth: '800px' }}>
      
      {/* Profile Header Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          gap: '16px' 
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '1.8rem',
              boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)'
            }}>
              {name ? name[0].toUpperCase() : 'U'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 
                  className="title-lg" 
                  style={{ fontSize: '1.3rem', margin: 0 }}
                >
                  {name}
                </h2>

                <span 
                  className="badge badge-confirmed" 
                  style={{ fontSize: '0.68rem' }}
                >
                  <ShieldCheck size={12} /> Verified Customer
                </span>
              </div>

              <p style={{ 
                fontSize: '0.85rem', 
                color: '#64748B', 
                margin: '2px 0 0 0' 
              }}>
                {user?.phone || 'Phone not available'} • Transmaa Customer ID: {user?._id || 'N/A'}
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="btn btn-outline btn-sm"
          >
            <Edit2 size={14} /> 
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>

        </div>

        {/* Edit Form */}
        {isEditing && (
          <form 
            onSubmit={handleSaveProfile} 
            style={{ 
              marginTop: '20px', 
              paddingTop: '16px', 
              borderTop: '1px solid #E2E8F0' 
            }}
          >
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
              gap: '12px', 
              marginBottom: '14px' 
            }}>
              
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">
                  Full Name
                </label>

                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">
                  Email Address
                </label>

                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-sm"
            >
              <Check size={14} /> 
              Save Changes
            </button>
          </form>
        )}
      </div>

      {/* Account Navigation Shortcuts */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        
        <div 
          onClick={() => onNavigate('bookings')}
          className="card card-clickable"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              backgroundColor: '#FFF7ED', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Truck size={20} color="#F97316" />
            </div>

            <div>
              <strong style={{ 
                fontSize: '0.95rem', 
                color: '#0F172A', 
                display: 'block' 
              }}>
                My Bookings
              </strong>

              <span style={{ 
                fontSize: '0.78rem', 
                color: '#64748B' 
              }}>
                {bookingsCount} Active/Past Loads
              </span>
            </div>
          </div>

          <ChevronRight size={18} color="#94A3B8" />
        </div>

        <div 
          onClick={() => onNavigate('buy-vehicles')}
          className="card card-clickable"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              backgroundColor: '#EFF6FF', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <ShoppingBag size={20} color="#2563EB" />
            </div>

            <div>
              <strong style={{ 
                fontSize: '0.95rem', 
                color: '#0F172A', 
                display: 'block' 
              }}>
                My Vehicle Listings
              </strong>

              <span style={{ 
                fontSize: '0.78rem', 
                color: '#64748B' 
              }}>
                {listingsCount} Vehicle Listings
              </span>
            </div>
          </div>

          <ChevronRight size={18} color="#94A3B8" />
        </div>

        <div 
          onClick={() => onNavigate('finance')}
          className="card card-clickable"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              backgroundColor: '#ECFDF5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <DollarSign size={20} color="#10B981" />
            </div>

            <div>
              <strong style={{ 
                fontSize: '0.95rem', 
                color: '#0F172A', 
                display: 'block' 
              }}>
                Finance & Insurance
              </strong>

              <span style={{ 
                fontSize: '0.78rem', 
                color: '#64748B' 
              }}>
                Active Enquiries
              </span>
            </div>
          </div>

          <ChevronRight size={18} color="#94A3B8" />
        </div>

      </div>

      {/* Help & Support Form */}
      <div className="card" style={{ marginBottom: '24px' }}>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          marginBottom: '16px' 
        }}>
          <HelpCircle size={22} color="#F97316" />

          <div>
            <h3 className="title-md" style={{ margin: 0 }}>
              Help & Customer Support
            </h3>

            <p 
              className="subtitle" 
              style={{ fontSize: '0.8rem' }}
            >
              Have questions about load pricing or booking status?
            </p>
          </div>
        </div>

        {supportSubmitted ? (
          <div style={{ 
            backgroundColor: '#D1FAE5', 
            color: '#065F46', 
            padding: '14px', 
            borderRadius: '10px', 
            fontSize: '0.88rem' 
          }}>
            ✓ Support request submitted! Transmaa helpdesk ticket #TK-9402 generated.
          </div>
        ) : (
          <form onSubmit={handleSupportSubmit}>
            
            <div 
              className="form-group" 
              style={{ marginBottom: '14px' }}
            >
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Type your message or query..."
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-outline btn-sm"
            >
              Send Message to Transmaa Helpdesk
            </button>

          </form>
        )}

      </div>

      {/* Logout Action */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={onLogout}
          className="btn btn-outline"
          style={{ 
            color: '#EF4444', 
            borderColor: '#FCA5A5', 
            width: '100%' 
          }}
        >
          <LogOut size={16} /> 
          Logout from Transmaa
        </button>
      </div>

    </div>
  );
}