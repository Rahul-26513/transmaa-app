import React, { useState } from 'react';
import {
  Truck,
  Smartphone,
  Mail,
  ArrowRight,
  X,
  ShieldCheck
} from 'lucide-react';

import OtpVerification from './OtpVerification';

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenRegister
}) {
  const [loginMode, setLoginMode] = useState('phone'); // phone | email
  const [step, setStep] = useState('phone');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // =========================
  // SEND OTP
  // =========================

  const handleSendOtp = (e) => {
    e.preventDefault();

    if (loginMode === 'phone') {
      if (
        !mobileNumber ||
        mobileNumber.length !== 10 ||
        !/^\d+$/.test(mobileNumber)
      ) {
        setError(
          'Please enter a valid 10-digit mobile number.'
        );
        return;
      }
    } else if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setStep('otp');
  };

  // =========================
  // RESET
  // =========================

  const handleReset = () => {
    setStep('phone');
    setMobileNumber('');
    setEmail('');
    setError('');
    onClose();
  };

  const identifier = loginMode === 'phone' ? { phone: mobileNumber } : { email };

  return (
    <div className="modal-overlay">

      <div
        className="modal-content"
        style={{ maxWidth: '440px' }}
      >

        {/* =========================
            MODAL HEADER
        ========================= */}

        <div className="modal-header">

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >

            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#FFF7ED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Truck
                size={20}
                color="#F97316"
              />
            </div>

            <div>

              <h3
                className="title-md"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1.1rem',
                  margin: 0
                }}
              >
                Tran<span style={{ color: '#F97316' }}>Smaa</span> Login
              </h3>

              <p
                className="subtitle"
                style={{
                  fontSize: '0.78rem'
                }}
              >
                Customer Portal Access
              </p>

            </div>

          </div>

          <button
            type="button"
            className="btn-ghost"
            onClick={handleReset}
            style={{ padding: '4px' }}
          >
            <X size={20} />
          </button>

        </div>


        {/* =========================
            MODAL BODY
        ========================= */}

        <div className="modal-body">

          {step === 'phone' ? (

            <form onSubmit={handleSendOtp}>

              {/* Header */}

              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '24px'
                }}
              >

                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto'
                  }}
                >
                  <Smartphone
                    size={32}
                    color="#F97316"
                  />
                </div>

                <h4
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: '#0F172A'
                  }}
                >
                  {loginMode === 'phone' ? 'Enter Mobile Number' : 'Enter Email Address'}
                </h4>

                <p
                  style={{
                    fontSize: '0.85rem',
                    color: '#64748B',
                    marginTop: '4px'
                  }}
                >
                  We will send a 6-digit OTP to
                  verify your account
                </p>

              </div>

              {/* Mode toggle */}

              <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '10px' }}>
                <button
                  type="button"
                  onClick={() => { setLoginMode('phone'); setError(''); }}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    fontSize: '0.82rem', fontWeight: 700,
                    backgroundColor: loginMode === 'phone' ? '#FFFFFF' : 'transparent',
                    color: loginMode === 'phone' ? '#F97316' : '#64748B',
                    boxShadow: loginMode === 'phone' ? '0 1px 3px rgba(15,23,42,0.12)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                  }}
                >
                  <Smartphone size={14} /> Mobile
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMode('email'); setError(''); }}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    fontSize: '0.82rem', fontWeight: 700,
                    backgroundColor: loginMode === 'email' ? '#FFFFFF' : 'transparent',
                    color: loginMode === 'email' ? '#F97316' : '#64748B',
                    boxShadow: loginMode === 'email' ? '0 1px 3px rgba(15,23,42,0.12)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                  }}
                >
                  <Mail size={14} /> Email
                </button>
              </div>


              {/* Error */}

              {error && (
                <div
                  style={{
                    backgroundColor: '#FEE2E2',
                    border:
                      '1px solid #FCA5A5',
                    color: '#991B1B',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    marginBottom: '16px'
                  }}
                >
                  {error}
                </div>
              )}


              {/* Phone or Email */}

              {loginMode === 'phone' ? (
                <div className="form-group">

                  <label className="form-label">
                    Mobile Number
                  </label>

                  <div className="input-wrapper">

                    <span
                      style={{
                        position: 'absolute',
                        left: '14px',
                        fontWeight: '700',
                        fontSize: '0.95rem',
                        color: '#334155'
                      }}
                    >
                      +91
                    </span>

                    <input
                      type="tel"
                      className="form-input"
                      placeholder="98765 43210"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => {
                        setMobileNumber(
                          e.target.value.replace(
                            /\D/g,
                            ''
                          )
                        );
                        setError('');
                      }}
                      style={{
                        paddingLeft: '56px',
                        fontSize: '1.05rem',
                        fontWeight: '600',
                        letterSpacing: '0.05em'
                      }}
                      autoFocus
                    />

                  </div>

                </div>
              ) : (
                <div className="form-group">

                  <label className="form-label">
                    Email Address
                  </label>

                  <div className="input-wrapper">

                    <Mail size={17} color="#94A3B8" style={{ position: 'absolute', left: '14px' }} />

                    <input
                      type="email"
                      className="form-input"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      style={{
                        paddingLeft: '38px',
                        fontSize: '1.05rem',
                        fontWeight: '600'
                      }}
                      autoFocus
                    />

                  </div>

                </div>
              )}


              {/* Send OTP */}

              <button
                type="submit"
                className="btn btn-primary btn-full btn-lg"
                style={{
                  marginTop: '12px'
                }}
              >
                <span>Continue</span>
                <ArrowRight size={18} />
              </button>


              {/* Register */}

              <div
                style={{
                  textAlign: 'center',
                  marginTop: '18px',
                  fontSize: '0.84rem',
                  color: '#64748B'
                }}
              >
                Don't have an account?{' '}

                <button
                  type="button"
                  onClick={() => {
                    onOpenRegister?.();
                    setStep('phone');
                    setMobileNumber('');
                    setEmail('');
                    setError('');
                  }}
                  style={{
                    border: 'none',
                    background: 'none',
                    padding: 0,
                    color: '#F97316',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '0.84rem'
                  }}
                >
                  Register
                </button>
              </div>


              {/* Security */}

              <div
                style={{
                  textAlign: 'center',
                  marginTop: '20px',
                  fontSize: '0.82rem',
                  color: '#64748B'
                }}
              >

                <ShieldCheck
                  size={14}
                  color="#10B981"
                  style={{
                    display: 'inline',
                    verticalAlign: 'middle',
                    marginRight: '4px'
                  }}
                />

                Transmaa Guarantee: Your information
                is safe & encrypted.

              </div>

            </form>

          ) : (

            <OtpVerification
              identifier={identifier}

              onBack={() =>
                setStep('phone')
              }

              onOpenRegister={
                onOpenRegister
              }

              onSuccess={(userData) => {
                onLoginSuccess(userData);
                handleReset();
              }}
            />

          )}

        </div>

      </div>

    </div>
  );
}