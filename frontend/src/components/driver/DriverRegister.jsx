import React, { useState } from 'react';
import {
  Truck, Smartphone, Mail, ArrowRight, ArrowLeft, KeyRound, User, Camera,
  CheckCircle2, ShieldCheck
} from 'lucide-react';
import * as driverApi from '../../services/driverApi';

const STATIC_TEST_OTP = '123456';

const VEHICLE_TYPES = [
  'LCV', 'Open', 'Dumper', 'Tipper', 'Container', 'Trailer'
];

const SAMPLE_PHOTO_URL =
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=300&q=80';

export default function DriverRegister({ onBackToLogin }) {
  const [step, setStep] = useState(1); // 1 phone/otp, 2 personal, 3 experience, 4 check details, 5 verification in progress
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const [personal, setPersonal] = useState({ name: '', email: '', dob: '', gender: 'Male', bio: '' });

  const [experience, setExperience] = useState({
    photo: '',
    experienceYears: '',
    vehicleType: VEHICLE_TYPES[0],
    vehicleModel: '',
    vehicleNumber: '',
    dlNumber: '',
    panNumber: ''
  });

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setStep(1.5);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.join('') !== STATIC_TEST_OTP) {
      setError('Invalid OTP.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    if (!personal.name.trim() || !personal.dob) {
      setError('Please fill in your name and date of birth.');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleExperienceSubmit = (e) => {
    e.preventDefault();
    if (!experience.vehicleModel.trim() || !experience.vehicleNumber.trim() || !experience.dlNumber.trim() || !experience.panNumber.trim()) {
      setError('Please fill in all vehicle and document details.');
      return;
    }
    setError('');
    setStep(4);
  };

  const handleStartJourney = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      await driverApi.register({
        name: personal.name,
        phone,
        email: personal.email,
        dob: personal.dob,
        gender: personal.gender,
        bio: personal.bio,
        photo: experience.photo,
        experienceYears: Number(experience.experienceYears) || 0,
        vehicleType: experience.vehicleType,
        vehicleModel: experience.vehicleModel,
        vehicleNumber: experience.vehicleNumber,
        dlNumber: experience.dlNumber,
        panNumber: experience.panNumber
      });

      setStep(5);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 5) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div style={{ textAlign: 'center', maxWidth: '380px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#D1FAE5',
            color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px auto'
          }}>
            <CheckCircle2 size={44} />
          </div>
          <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
            <div style={{ height: '100%', width: '35%', backgroundColor: '#EF4444' }} />
          </div>
          <h2 className="title-md">Background Verification In Progress.....</h2>
          <p className="subtitle" style={{ marginTop: '10px' }}>
            Transmaa staff will review your details and approve your profile shortly.
          </p>
          <button onClick={onBackToLogin} className="btn btn-outline" style={{ marginTop: '20px' }}>
            <ArrowLeft size={16} /> Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-10 flex items-start justify-center"
      style={{ background: 'radial-gradient(circle at 15% 20%, rgba(249, 115, 22, 0.16) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(37, 99, 235, 0.14) 0%, transparent 45%), linear-gradient(160deg, #020617 0%, #0F172A 55%, #020617 100%)' }}
    >
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#F7931E] flex items-center justify-center shadow-lg shadow-orange-500/30 mx-auto mb-3">
            <Truck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Register as a Transmaa Driver
          </h1>
        </div>

        <div className="card">
          {error && (
            <div style={{
              backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B',
              padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOtp}>
              <h3 className="title-md" style={{ marginBottom: '4px' }}>Registration</h3>
              <p className="subtitle" style={{ marginBottom: '20px' }}>Step 1: Verify your mobile number</p>

              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <div className="input-wrapper">
                  <Smartphone size={17} color="#94A3B8" style={{ position: 'absolute', left: '14px' }} />
                  <span style={{ position: 'absolute', left: '38px', fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>+91</span>
                  <input
                    type="tel"
                    className="form-input"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setError(''); }}
                    style={{ paddingLeft: '74px', fontWeight: 600 }}
                    autoFocus
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg">
                Get OTP <ArrowRight size={18} />
              </button>

              <button type="button" onClick={onBackToLogin} className="btn-ghost btn-full" style={{ marginTop: '10px', justifyContent: 'center' }}>
                Already registered? Login
              </button>
            </form>
          )}

          {step === 1.5 && (
            <form onSubmit={handleVerifyOtp}>
              <button type="button" onClick={() => setStep(1)} className="btn-ghost" style={{ padding: '4px 8px', marginBottom: '12px', fontSize: '0.85rem' }}>
                <ArrowLeft size={16} /> Back
              </button>

              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                  <KeyRound size={28} color="#F97316" />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Verify your Phone Number</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>Sent to +91 {phone}</p>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      if (!/^\d*$/.test(e.target.value)) return;
                      const next = [...otp];
                      next[idx] = e.target.value.slice(-1);
                      setOtp(next);
                      setError('');
                    }}
                    style={{
                      width: '42px', height: '48px', borderRadius: '10px',
                      border: digit ? '2px solid #F97316' : '1.5px solid #CBD5E1',
                      backgroundColor: digit ? '#FFF7ED' : '#FFFFFF',
                      textAlign: 'center', fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', outline: 'none'
                    }}
                  />
                ))}
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg">Verify & Continue</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePersonalSubmit}>
              <h3 className="title-md" style={{ marginBottom: '4px' }}>Personal Information</h3>
              <p className="subtitle" style={{ marginBottom: '20px' }}>Step 2 of 4</p>

              <div className="form-group">
                <label className="form-label">Name</label>
                <input type="text" className="form-input" value={personal.name}
                  onChange={(e) => setPersonal({ ...personal, name: e.target.value })} required />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={17} color="#94A3B8" style={{ position: 'absolute', left: '14px' }} />
                  <input type="email" className="form-input" placeholder="you@example.com" value={personal.email}
                    onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                    style={{ paddingLeft: '38px' }} />
                </div>
                <p style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px' }}>
                  Optional. Lets you log in with email OTP as well as your mobile number.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Date Of Birth</label>
                <input type="date" className="form-input" value={personal.dob}
                  onChange={(e) => setPersonal({ ...personal, dob: e.target.value })} required />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-select" value={personal.gender}
                  onChange={(e) => setPersonal({ ...personal, gender: e.target.value })}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Bio</label>
                <textarea className="form-textarea" rows={2} value={personal.bio}
                  onChange={(e) => setPersonal({ ...personal, bio: e.target.value })} />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setStep(1.5)} className="btn btn-outline" style={{ flex: 1 }}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleExperienceSubmit}>
              <h3 className="title-md" style={{ marginBottom: '4px' }}>Experience and Data</h3>
              <p className="subtitle" style={{ marginBottom: '20px' }}>Step 3 of 4</p>

              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div
                  onClick={() => setExperience({ ...experience, photo: SAMPLE_PHOTO_URL })}
                  style={{
                    width: '96px', height: '96px', borderRadius: '50%', margin: '0 auto',
                    backgroundColor: '#F1F5F9', border: '2px dashed #CBD5E1', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                  }}
                >
                  {experience.photo ? (
                    <img src={experience.photo} alt="driver" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Camera size={26} color="#94A3B8" />
                  )}
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '8px' }}>Upload pic</p>
              </div>

              <div className="form-group">
                <label className="form-label">Year's Of Experience</label>
                <input type="number" min="0" className="form-input" value={experience.experienceYears}
                  onChange={(e) => setExperience({ ...experience, experienceYears: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Type</label>
                <select className="form-select" value={experience.vehicleType}
                  onChange={(e) => setExperience({ ...experience, vehicleType: e.target.value })}>
                  {VEHICLE_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Model</label>
                <input type="text" className="form-input" placeholder="e.g. TATA ACE" value={experience.vehicleModel}
                  onChange={(e) => setExperience({ ...experience, vehicleModel: e.target.value })} required />
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Number</label>
                <input type="text" className="form-input" placeholder="e.g. TS23AB5029" value={experience.vehicleNumber}
                  onChange={(e) => setExperience({ ...experience, vehicleNumber: e.target.value.toUpperCase() })} required />
              </div>

              <div className="form-group">
                <label className="form-label">DL Number</label>
                <input type="text" className="form-input" value={experience.dlNumber}
                  onChange={(e) => setExperience({ ...experience, dlNumber: e.target.value.toUpperCase() })} required />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">PAN Card Number</label>
                <input type="text" className="form-input" value={experience.panNumber}
                  onChange={(e) => setExperience({ ...experience, panNumber: e.target.value.toUpperCase() })} required />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setStep(2)} className="btn btn-outline" style={{ flex: 1 }}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div>
              <h3 className="title-md" style={{ marginBottom: '4px' }}>Check Details</h3>
              <p className="subtitle" style={{ marginBottom: '20px' }}>Step 4 of 4: Review before submitting</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {experience.photo ? (
                    <img src={experience.photo} alt="driver" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : <User size={26} color="#94A3B8" />}
                </div>
                <div>
                  <strong style={{ fontSize: '1rem', color: '#0F172A' }}>{personal.name}</strong>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>+91 {phone}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.85rem', marginBottom: '24px' }}>
                {personal.email && (
                  <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>Email</span><strong>{personal.email}</strong></div>
                )}
                <div><span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>Date of Birth</span><strong>{personal.dob}</strong></div>
                <div><span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>Gender</span><strong>{personal.gender}</strong></div>
                <div><span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>Experience</span><strong>{experience.experienceYears} Years</strong></div>
                <div><span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>Vehicle Type</span><strong>{experience.vehicleType}</strong></div>
                <div><span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>Vehicle Model</span><strong>{experience.vehicleModel}</strong></div>
                <div><span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>Vehicle Number</span><strong>{experience.vehicleNumber}</strong></div>
                <div><span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>DL Number</span><strong>{experience.dlNumber}</strong></div>
                <div><span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>PAN Number</span><strong>{experience.panNumber}</strong></div>
                {personal.bio && (
                  <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>Bio</span><strong>{personal.bio}</strong></div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setStep(3)} className="btn btn-outline" style={{ flex: 1 }} disabled={isSubmitting}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="button" onClick={handleStartJourney} className="btn btn-primary btn-lg" style={{ flex: 2 }} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Start Your Journey'}
                </button>
              </div>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.78rem', color: '#64748B' }}>
            <ShieldCheck size={14} color="#10B981" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            Your information is safe & encrypted.
          </div>
        </div>
      </div>
    </div>
  );
}
