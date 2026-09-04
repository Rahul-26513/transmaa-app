import React, { useState } from 'react';
import { Truck, Smartphone, Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { login, persistSession } from '../../services/staffApi';

export default function StaffLogin({ onLoginSuccess }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const data = await login(phone, password);
      persistSession(data.token, data.staff);
      onLoginSuccess(data.staff);
    } catch (err) {
      setError(err.message || 'Unable to login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#F7931E] flex items-center justify-center shadow-lg shadow-orange-500/30 mx-auto mb-4">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Tran<span className="text-[#FF6B35]">Smaa</span>
          </h1>
          <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider mt-1">
            Staff Ops Console
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-7 shadow-2xl border border-slate-200"
        >
          <h2 className="text-lg font-extrabold text-slate-900 mb-1">Staff Login</h2>
          <p className="text-xs text-slate-500 mb-6">
            Sign in with your registered mobile number and password.
          </p>

          {error && (
            <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <div className="input-wrapper">
              <Smartphone size={17} color="#94A3B8" style={{ position: 'absolute', left: '14px' }} />
              <span
                style={{
                  position: 'absolute',
                  left: '38px',
                  fontWeight: 700,
                  color: '#334155',
                  fontSize: '0.9rem'
                }}
              >
                +91
              </span>
              <input
                type="tel"
                className="form-input"
                placeholder="98765 43210"
                maxLength={10}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, ''));
                  setError('');
                }}
                style={{ paddingLeft: '74px', fontWeight: 600, letterSpacing: '0.04em' }}
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock size={17} color="#94A3B8" style={{ position: 'absolute', left: '14px' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                style={{ paddingLeft: '42px', paddingRight: '42px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94A3B8',
                  display: 'flex'
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={isSubmitting}
            style={{ marginTop: '8px' }}
          >
            <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
            {!isSubmitting && <ArrowRight size={18} />}
          </button>

          <div
            style={{
              textAlign: 'center',
              marginTop: '18px',
              fontSize: '0.78rem',
              color: '#64748B'
            }}
          >
            <ShieldCheck
              size={14}
              color="#10B981"
              style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}
            />
            Restricted access. Staff accounts only.
          </div>
        </form>
      </div>
    </div>
  );
}
