import React, { useState } from 'react';
import {
  PlusCircle, Camera, CheckCircle2, ShieldCheck, ArrowLeft, UploadCloud, Image as ImageIcon
} from 'lucide-react';
import * as customerApi from '../../services/customerApi';

export default function SellVehicleForm({ user, onOpenAuth, onVehicleSubmitted, showToast }) {
  const [formData, setFormData] = useState({
    type: 'Pickup Truck',
    model: '',
    year: '2022',
    rcNumber: '',
    location: 'Hyderabad, Telangana',
    expectedPrice: '',
    description: ''
  });

  const [photos, setPhotos] = useState({
    front: null,
    back: null,
    left: null,
    right: null
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const samplePhotoUrls = {
    front: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80',
    back: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
    left: 'https://images.unsplash.com/photo-1586191582056-a05e26b1df30?auto=format&fit=crop&w=600&q=80',
    right: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=600&q=80'
  };

  const handleSimulatePhotoUpload = (angle) => {
    setPhotos(prev => ({
      ...prev,
      [angle]: samplePhotoUrls[angle]
    }));
    showToast(`Uploaded ${angle.toUpperCase()} photo sample successfully`, 'success');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      onOpenAuth();
      return;
    }

    if (!formData.model || !formData.rcNumber || !formData.expectedPrice) {
      setError('Please fill in Model Name, RC Number, and Expected Price.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const { vehicle } = await customerApi.submitVehicle({
        makeModel: formData.model,
        vehicleType: formData.type,
        year: parseInt(formData.year),
        rcNumber: formData.rcNumber,
        price: formData.expectedPrice,
        location: formData.location,
        description: formData.description,
        photos: [photos.front, photos.back, photos.left, photos.right].filter(Boolean)
      });

      onVehicleSubmitted(vehicle);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Unable to submit vehicle. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content-wrapper">
      
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#D1FAE5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h2 className="title-lg" style={{ color: '#0F172A', marginBottom: '8px' }}>
              Vehicle Submitted Successfully!
            </h2>
            <div className="badge badge-pending" style={{ fontSize: '0.85rem', marginBottom: '16px' }}>
              Status: Waiting for Transmaa Verification
            </div>

            <p style={{ fontSize: '0.9rem', color: '#475569', maxWidth: '540px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
              Transmaa commercial vehicle inspectors will verify your RC details, insurance, and physical photo condition. Once approved within 24 hours, your vehicle will be live on the Transmaa marketplace for interested buyers.
            </p>

            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  type: 'Pickup Truck',
                  model: '',
                  year: '2022',
                  rcNumber: '',
                  location: 'Hyderabad, Telangana',
                  expectedPrice: '',
                  description: ''
                });
                setPhotos({ front: null, back: null, left: null, right: null });
              }}
              className="btn btn-outline"
            >
              List Another Vehicle
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#FFF7ED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <PlusCircle size={24} color="#F97316" />
              </div>
              <div>
                <h2 className="title-lg" style={{ fontSize: '1.4rem', margin: 0 }}>
                  Sell Your Commercial Vehicle
                </h2>
                <p className="subtitle">Submit vehicle details for Transmaa verification and listing</p>
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
              
              {/* Basic Vehicle Info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Vehicle Type</label>
                  <select
                    className="form-select"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Mini Truck">Mini Truck (Tata Ace / Jeeto)</option>
                    <option value="Pickup Truck">Pickup Truck (Bolero / Isuzu)</option>
                    <option value="Light Commercial Truck">Light Commercial Truck (14ft Container)</option>
                    <option value="Medium Truck">Medium Truck (6-Wheeler)</option>
                    <option value="Heavy Commercial Truck">Heavy Commercial Truck (10-12 Wheeler)</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Vehicle Make & Model</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Mahindra Bolero Maxi Truck Plus"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    required
                  />
                </div>

              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Manufacturing Year</label>
                  <select
                    className="form-select"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  >
                    {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">RC Registration Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. TS 08 EA 1234"
                    value={formData.rcNumber}
                    onChange={(e) => setFormData({ ...formData, rcNumber: e.target.value.toUpperCase() })}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Expected Sale Price (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 450000"
                    value={formData.expectedPrice}
                    onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                    required
                  />
                </div>

              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Vehicle Location (City & State)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Sircilla / Hyderabad, Telangana"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Contact Phone</label>
                  <div className="form-input" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#F8FAFC', color: '#64748B' }}>
                    {user ? `+91 ${user.phone}` : 'Login to auto-fill your number'}
                  </div>
                </div>

              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Vehicle Description & Service History</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Describe tire condition, fitness validity, recent servicing, or body modifications..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* 4 Photo Upload Dropzones with Preview */}
              <div style={{ marginBottom: '28px' }}>
                <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>
                  Upload 4 Vehicle Angle Photos (Click box to simulate photo upload):
                </label>
                
                <div className="photo-upload-grid">
                  {['front', 'back', 'left', 'right'].map((angle) => {
                    const photoUrl = photos[angle];
                    return (
                      <div
                        key={angle}
                        onClick={() => handleSimulatePhotoUpload(angle)}
                        className="photo-upload-box"
                      >
                        {photoUrl ? (
                          <img src={photoUrl} alt={angle} className="photo-preview-img" />
                        ) : (
                          <>
                            <Camera size={24} color="#94A3B8" />
                            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748B', textTransform: 'capitalize' }}>
                              + {angle} View
                            </span>
                            <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Click to Upload</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Vehicle for Verification'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
