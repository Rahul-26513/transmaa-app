import React, { useState, useRef, useEffect } from 'react';
import { Truck, Smartphone, Mail, ArrowRight, ShieldCheck, KeyRound, ArrowLeft, RefreshCw } from 'lucide-react';
import * as driverApi from '../../services/driverApi';
import Footer from '../common/Footer';

export default function DriverLogin({ onLoginSuccess, onOpenRegister }) {
  const [loginMode, setLoginMode] = useState('phone'); // phone | email
  const [step, setStep] = useState('identifier');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [popup, setPopup] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const otpRefs = useRef([]);

  useEffect(() => {
    if (step === 'otp') {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  useEffect(() => {
    if (step !== 'otp') return undefined;

    if (resendTimer <= 0) {
      setCanResend(true);
      return undefined;
    }

    const interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (loginMode === 'phone' && phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (loginMode === 'email' && !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const data = await driverApi.requestOtp(loginMode === 'phone' ? { phone } : { email });
      setWarning(data.warning || '');
      setOtp(['', '', '', '', '', '']);
      setResendTimer(30);
      setCanResend(false);
      setStep('otp');
    } catch (err) {
      if (err.status === 404) {
        setPopup('This account is not registered. Please register.');
      } else {
        setError(err.message || 'Unable to send OTP.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      const data = await driverApi.requestOtp(loginMode === 'phone' ? { phone } : { email });
      setWarning(data.warning || '');
      setOtp(['', '', '', '', '', '']);
      setError('');
      setResendTimer(30);
      setCanResend(false);
      otpRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || 'Unable to resend OTP.');
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setError('');

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const data = await driverApi.verifyOtp(loginMode === 'phone' ? { phone } : { email }, fullOtp);
      driverApi.persistSession(data.token, data.driver);
      onLoginSuccess(data.driver);
    } catch (err) {
      if (err.status === 202) {
        setPopup('Your verification is in progress');
      } else if (err.status === 403) {
        setPopup('This number got rejected');
      } else if (err.status === 404) {
        setPopup('This account is not registered. Please register.');
      } else {
        setError(err.message || 'Invalid OTP.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (mode) => {
    setLoginMode(mode);
    setError('');
    setWarning('');
    setPopup(null);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(circle at 15% 20%, rgba(249, 115, 22, 0.16) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(37, 99, 235, 0.14) 0%, transparent 45%), linear-gradient(160deg, #020617 0%, #0F172A 55%, #020617 100%)' }}
    >
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#F7931E] flex items-center justify-center shadow-lg shadow-orange-500/30 mx-auto mb-4">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-brand text-2xl font-extrabold text-white tracking-tight">
            Tran<span className="text-[#FF6B35]">Smaa</span>
          </h1>
          <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider mt-1">
            Driver App
          </p>
        </div>

        <div className="card">
          {popup && (
            <div style={{
              backgroundColor: '#FEF3C7',
              border: '1px solid #FCD34D',
              color: '#92400E',
              padding: '12px 14px',
              borderRadius: '10px',
              fontSize: '0.88rem',
              marginBottom: '16px',
              textAlign: 'center',
              fontWeight: 600
            }}>
              {popup}
              {popup.startsWith('This account is not registered') && (
                <div style={{ marginTop: '10px' }}>
                  <button type="button" onClick={onOpenRegister} className="btn btn-primary btn-sm">
                    Register Now
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 'identifier' ? (
            <form onSubmit={handleSendOtp}>
              <h2 className="title-md" style={{ marginBottom: '4px' }}>Driver Login</h2>
              <p className="subtitle" style={{ marginBottom: '16px' }}>
                Login using your registered mobile number or email and OTP.
              </p>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '10px' }}>
                <button
                  type="button"
                  onClick={() => switchMode('phone')}
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
                  onClick={() => switchMode('email')}
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

              {error && (
                <div style={{
                  backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B',
                  padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px'
                }}>
                  {error}
                </div>
              )}

              {loginMode === 'phone' ? (
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <div className="input-wrapper">
                    <Smartphone size={17} color="#94A3B8" style={{ position: 'absolute', left: '14px' }} />
                    <span style={{ position: 'absolute', left: '38px', fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>+91</span>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="98765 43210"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setError(''); setPopup(null); }}
                      style={{ paddingLeft: '74px', fontWeight: 600 }}
                      autoFocus
                    />
                  </div>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-wrapper">
                    <Mail size={17} color="#94A3B8" style={{ position: 'absolute', left: '14px' }} />
                    <input
                      type="email"
                      className="form-input"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); setPopup(null); }}
                      style={{ paddingLeft: '38px', fontWeight: 600 }}
                      autoFocus
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={isSubmitting}>
                <span>{isSubmitting ? 'Sending OTP...' : 'Send OTP'}</span>
                {!isSubmitting && <ArrowRight size={18} />}
              </button>

              <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.84rem', color: '#64748B' }}>
                Don't have an account?{' '}
                <button type="button" onClick={onOpenRegister} style={{ border: 'none', background: 'none', padding: 0, color: '#F97316', fontWeight: 700, cursor: 'pointer' }}>
                  Register A New Account
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerify}>
              <button type="button" onClick={() => setStep('identifier')} className="btn-ghost" style={{ padding: '4px 8px', marginBottom: '12px', fontSize: '0.85rem' }}>
                <ArrowLeft size={16} /> Back
              </button>

              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                  <KeyRound size={28} color="#F97316" />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Verify OTP</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>
                  Sent to <strong style={{ color: '#0F172A' }}>{loginMode === 'phone' ? `+91 ${phone}` : email}</strong>
                </p>
              </div>

              {warning && (
                <div style={{
                  backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', color: '#92400E',
                  padding: '10px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '16px', textAlign: 'center', fontWeight: 600
                }}>
                  {warning}
                </div>
              )}

              {error && (
                <div style={{
                  backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B',
                  padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center'
                }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    style={{
                      width: '46px', height: '52px', borderRadius: '10px',
                      border: digit ? '2px solid #F97316' : '1.5px solid #CBD5E1',
                      backgroundColor: digit ? '#FFF7ED' : '#FFFFFF',
                      textAlign: 'center', fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', outline: 'none'
                    }}
                  />
                ))}
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={isSubmitting}>
                {isSubmitting ? 'Verifying...' : 'Verify OTP & Login'}
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '0.82rem' }}>
                <span style={{ color: '#64748B' }}>
                  {canResend ? "Didn't receive code?" : `Resend OTP in ${resendTimer}s`}
                </span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend}
                  className="btn-ghost"
                  style={{
                    fontSize: '0.82rem', fontWeight: 700, padding: '4px 8px',
                    color: canResend ? '#F97316' : '#94A3B8',
                    cursor: canResend ? 'pointer' : 'not-allowed'
                  }}
                >
                  <RefreshCw size={12} style={{ marginRight: '4px' }} />
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.78rem', color: '#64748B' }}>
            <ShieldCheck size={14} color="#10B981" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            Transmaa Driver Verification
          </div>
        </div>

        <Footer dark />
      </div>
    </div>
  );
}
