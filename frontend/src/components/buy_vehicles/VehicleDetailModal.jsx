import React, { useState } from 'react';
import {
  X, ShieldCheck, MapPin, Send, CheckCircle2, FileText
} from 'lucide-react';
import * as customerApi from '../../services/customerApi';

export default function VehicleDetailModal({ vehicle, onClose, showToast }) {
  if (!vehicle) return null;

  const photos = vehicle.photos || [];

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone) return;

    setIsSubmitting(true);
    setError('');

    try {
      await customerApi.expressInterest(vehicle._id, buyerName, buyerPhone);
      setEnquirySuccess(true);
      showToast(`Interest submitted for ${vehicle.makeModel}! Transmaa sales team will contact you.`, 'success');
    } catch (err) {
      setError(err.message || 'Unable to submit interest. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '780px' }}>

        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-confirmed">
                <ShieldCheck size={12} /> Transmaa Verified
              </span>
              {vehicle.vehicleType && <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{vehicle.vehicleType}</span>}
            </div>
            <h3 className="title-md" style={{ margin: 0 }}>{vehicle.makeModel} {vehicle.year ? `(${vehicle.year})` : ''}</h3>
          </div>
          <button className="btn-ghost" onClick={onClose} style={{ padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">

          {/* Main Photo Gallery */}
          {photos.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                height: '320px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                marginBottom: '10px'
              }}>
                <img
                  src={photos[activeImgIndex] || photos[0]}
                  alt={vehicle.makeModel}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {photos.length > 1 && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  {photos.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      style={{
                        width: '70px',
                        height: '50px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: activeImgIndex === idx ? '2px solid #F97316' : '1px solid #CBD5E1',
                        padding: 0,
                        cursor: 'pointer'
                      }}
                    >
                      <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pricing & Location Banner */}
          <div style={{
            backgroundColor: '#FFF7ED',
            border: '1.5px solid #FFEDD5',
            padding: '16px 20px',
            borderRadius: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#9A3412', display: 'block' }}>Expected Price</span>
              <strong style={{ fontSize: '1.6rem', color: '#EA580C', fontWeight: '800' }}>
                {vehicle.price ? `₹${vehicle.price}` : 'Contact for price'}
              </strong>
            </div>

            {vehicle.location && (
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block' }}>Vehicle Location</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={16} color="#F97316" /> {vehicle.location}
                </span>
              </div>
            )}
          </div>

          {/* Key Specifications Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Mfg. Year</span>
              <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>{vehicle.year || 'N/A'}</strong>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>KMs Driven</span>
              <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>{vehicle.kmDriven || 'N/A'}</strong>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Fuel Type</span>
              <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>{vehicle.fuelType || 'N/A'}</strong>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>RC Number</span>
              <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>{vehicle.rcNumber}</strong>
            </div>
          </div>

          {/* Description */}
          {vehicle.description && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>
                <FileText size={15} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                Vehicle Description
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.6', marginBottom: 0 }}>
                {vehicle.description}
              </p>
            </div>
          )}

          {/* "I'm Interested" Lead Form Section */}
          {!showEnquiryForm ? (
            <button
              onClick={() => setShowEnquiryForm(true)}
              className="btn btn-primary btn-full btn-lg"
            >
              <Send size={18} /> Request a Callback
            </button>
          ) : enquirySuccess ? (
            <div style={{
              backgroundColor: '#D1FAE5',
              border: '1px solid #6EE7B7',
              color: '#065F46',
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <CheckCircle2 size={32} style={{ margin: '0 auto 8px auto' }} />
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800' }}>Enquiry Submitted Successfully!</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                Transmaa will contact you shortly to arrange next steps.
              </p>
            </div>
          ) : (
            <form onSubmit={handleEnquirySubmit} style={{
              backgroundColor: '#FFF7ED',
              border: '1.5px solid #FFEDD5',
              padding: '20px',
              borderRadius: '14px'
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A', marginBottom: '14px' }}>
                Submit Interest to Transmaa Team
              </h4>

              {error && (
                <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '12px' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter full name"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="10-digit mobile"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowEnquiryForm(false)} className="btn btn-outline" style={{ flex: 1 }} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Enquiry Now'}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
