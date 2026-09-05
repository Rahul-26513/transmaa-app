import React, { useState } from 'react';
import {
  Truck,
  Smartphone,
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
  const [step, setStep] = useState('phone');
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // =========================
  // SEND OTP
  // =========================

  const handleSendOtp = (e) => {
    e.preventDefault();

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

    setError('');
    setStep('otp');
  };

  // =========================
  // RESET
  // =========================

  const handleReset = () => {
    setStep('phone');
    setMobileNumber('');
    setError('');
    onClose();
  };

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
                  Enter Mobile Number
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


              {/* Phone */}

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
              mobileNumber={mobileNumber}

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