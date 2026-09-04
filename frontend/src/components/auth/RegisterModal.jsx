import React, { useState } from 'react';
import { Truck, User, Smartphone, Mail, X, ArrowRight, ShieldCheck } from 'lucide-react';
import * as customerApi from '../../services/customerApi';

export default function RegisterModal({
  isOpen,
  onClose,
  onRegisterSuccess,
  onOpenLogin
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async (e) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, '');
    const cleanEmail = email.trim();

    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }

    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    setError('');
    setIsRegistering(true);

    try {
      const data = await customerApi.register(cleanName, cleanPhone, cleanEmail);

      customerApi.persistSession(data.token, data.customer);

      const customer = data.customer;

      const userData = {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        registeredDate:
          customer.createdAt ||
          new Date().toISOString().split('T')[0]
      };

      onRegisterSuccess(userData);

      setName('');
      setPhone('');
      setEmail('');
      setError('');

    } catch (error) {
      console.error('Registration error:', error);

      setError(
        error.message ||
        'Unable to create account. Please try again.'
      );

    } finally {
      setIsRegistering(false);
    }
  };

  const handleClose = () => {
    setName('');
    setPhone('');
    setEmail('');
    setError('');
    setIsRegistering(false);
    onClose();
  };

  return (
    <div className="modal-overlay">

      <div
        className="modal-content"
        style={{ maxWidth: '440px' }}
      >

        {/* Header */}

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
                  fontSize: '1.1rem',
                  margin: 0
                }}
              >
                Create Transmaa Account
              </h3>

              <p
                className="subtitle"
                style={{
                  fontSize: '0.78rem'
                }}
              >
                Customer Registration
              </p>
            </div>

          </div>

          <button
            type="button"
            className="btn-ghost"
            onClick={handleClose}
            style={{ padding: '4px' }}
          >
            <X size={20} />
          </button>

        </div>


        {/* Body */}

        <div className="modal-body">

          <div
            style={{
              textAlign: 'center',
              marginBottom: '22px'
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
              <User
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
              Register as a Customer
            </h4>

            <p
              style={{
                fontSize: '0.85rem',
                color: '#64748B',
                marginTop: '4px'
              }}
            >
              Create your Transmaa account to book
              trucks and access customer services.
            </p>

          </div>


          {/* Error */}

          {error && (
            <div
              style={{
                backgroundColor: '#FEE2E2',
                border: '1px solid #FCA5A5',
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


          <form onSubmit={handleRegister}>

            {/* Full Name */}

            <div className="form-group">

              <label className="form-label">
                Full Name
              </label>

              <div className="input-wrapper">

                <User
                  size={17}
                  color="#94A3B8"
                  style={{
                    position: 'absolute',
                    left: '14px'
                  }}
                />

                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  style={{
                    paddingLeft: '42px'
                  }}
                  required
                />

              </div>

            </div>


            {/* Phone */}

            <div className="form-group">

              <label className="form-label">
                Mobile Number
              </label>

              <div className="input-wrapper">

                <Smartphone
                  size={17}
                  color="#94A3B8"
                  style={{
                    position: 'absolute',
                    left: '14px'
                  }}
                />

                <span
                  style={{
                    position: 'absolute',
                    left: '40px',
                    fontWeight: '700',
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
                    setPhone(
                      e.target.value.replace(/\D/g, '')
                    );
                    setError('');
                  }}
                  style={{
                    paddingLeft: '76px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    letterSpacing: '0.04em'
                  }}
                  required
                />

              </div>

            </div>


            {/* Email */}

            <div className="form-group">

              <label className="form-label">
                Email Address
              </label>

              <div className="input-wrapper">

                <Mail
                  size={17}
                  color="#94A3B8"
                  style={{
                    position: 'absolute',
                    left: '14px'
                  }}
                />

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
                    paddingLeft: '42px'
                  }}
                  required
                />

              </div>

            </div>


            {/* Submit */}

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={isRegistering}
              style={{
                marginTop: '12px'
              }}
            >

              <span>
                {isRegistering
                  ? 'Creating Account...'
                  : 'Create Account'}
              </span>

              {!isRegistering && (
                <ArrowRight size={18} />
              )}

            </button>


            {/* Login */}

            <div
              style={{
                textAlign: 'center',
                marginTop: '18px',
                fontSize: '0.84rem',
                color: '#64748B'
              }}
            >

              Already have an account?{' '}

              <button
                type="button"
                onClick={onOpenLogin}
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
                Login
              </button>

            </div>


            {/* Security */}

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
                style={{
                  display: 'inline',
                  verticalAlign: 'middle',
                  marginRight: '4px'
                }}
              />

              Your information is safe & encrypted.

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}