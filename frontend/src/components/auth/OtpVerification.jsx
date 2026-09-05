import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  KeyRound,
  UserPlus
} from 'lucide-react';
import * as customerApi from '../../services/customerApi';

export default function OtpVerification({
  identifier,
  onBack,
  onSuccess,
  onOpenRegister
}) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [warning, setWarning] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showRegisterButton, setShowRegisterButton] = useState(false);

  const inputRefs = useRef([]);
  const destination = identifier.phone ? `+91 ${identifier.phone}` : identifier.email;

  useEffect(() => {
    let interval = null;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

  // Fires a real OTP to the customer's registered email as an addon to the
  // static prototype code below (123456 keeps working on its own either way).
  useEffect(() => {
    customerApi.requestOtp(identifier)
      .then((data) => setWarning(data.warning || ''))
      .catch((err) => console.error('Send OTP email error:', err));
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);

    setOtp(newOtp);
    setError('');
    setShowRegisterButton(false);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === 'Backspace' &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Prototype only
  const handleAutofillMock = () => {
    setOtp(['1', '2', '3', '4', '5', '6']);
    setError('');
    setShowRegisterButton(false);
  };

  const handleVerify = async (e) => {
    e?.preventDefault();

    const fullOtp = otp.join('');

    if (fullOtp.length !== 6) {
      setError('Please enter complete 6-digit OTP.');
      setShowRegisterButton(false);
      return;
    }

    setIsVerifying(true);
    setError('');
    setSuccess('');
    setShowRegisterButton(false);

    try {
      const data = await customerApi.verifyOtp(identifier, fullOtp);

      customerApi.persistSession(data.token, data.customer);

      setSuccess('OTP Verified Successfully! Logging in...');

      setTimeout(() => {
        onSuccess({
          id: data.customer.id,
          name: data.customer.name,
          phone: data.customer.phone,
          email: data.customer.email,
          registeredDate:
            data.customer.createdAt ||
            new Date().toISOString().split('T')[0]
        });
      }, 800);

    } catch (error) {
      console.error('Login error:', error);

      if (error.status === 404) {
        setError('No account found with this mobile number. Please register first.');
        setShowRegisterButton(true);
      } else {
        setError(error.message || 'Unable to login. Please try again.');
      }

      setSuccess('');

    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    if (!canResend) return;

    customerApi.requestOtp(identifier)
      .then((data) => setWarning(data.warning || ''))
      .catch((err) => console.error('Resend OTP email error:', err));

    setTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    setError('');
    setSuccess('');
    setShowRegisterButton(false);
  };

  const handleRegisterClick = () => {
    if (onOpenRegister) {
      onOpenRegister();
    }
  };

  return (
    <div>

      {/* Back Button */}

      <button
        type="button"
        onClick={onBack}
        className="btn-ghost"
        style={{
          padding: '4px 8px',
          marginBottom: '12px',
          fontSize: '0.85rem'
        }}
      >
        <ArrowLeft size={16} />
        Back to Mobile
      </button>


      {/* Header */}

      <div
        style={{
          textAlign: 'center',
          marginBottom: '20px'
        }}
      >

        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: '#FFF7ED',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}
        >
          <KeyRound
            size={28}
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
          Verify OTP
        </h4>

        <p
          style={{
            fontSize: '0.85rem',
            color: '#64748B',
            marginTop: '4px'
          }}
        >
          Sent to{' '}
          <strong
            style={{
              color: '#0F172A'
            }}
          >
            {destination}
          </strong>
        </p>


        {/* Prototype OTP Helper */}

        <div
          onClick={handleAutofillMock}
          style={{
            marginTop: '10px',
            backgroundColor: '#EFF6FF',
            border: '1px dashed #3B82F6',
            color: '#1D4ED8',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          💡 A real OTP was also emailed to your registered address. For
          testing, click here to autofill the prototype OTP:{' '}
          <strong>123456</strong>
        </div>

      </div>


      {/* Rate-limit Warning */}

      {warning && (
        <div
          style={{
            backgroundColor: '#FEF3C7',
            border: '1px solid #FCD34D',
            color: '#92400E',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            marginBottom: '12px',
            textAlign: 'center',
            fontWeight: 600
          }}
        >
          {warning}
        </div>
      )}


      {/* Error Message */}

      {error && (
        <div
          style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '12px',
            textAlign: 'center'
          }}
        >
          {error}
        </div>
      )}


      {/* Register Button */}

      {showRegisterButton && (
        <button
          type="button"
          onClick={handleRegisterClick}
          className="btn btn-outline btn-full"
          style={{
            marginBottom: '16px'
          }}
        >
          <UserPlus size={17} />
          Register New Account
        </button>
      )}


      {/* Success Message */}

      {success && (
        <div
          style={{
            backgroundColor: '#D1FAE5',
            border: '1px solid #6EE7B7',
            color: '#065F46',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '16px',
            textAlign: 'center',
            fontWeight: '600'
          }}
        >
          <ShieldCheck
            size={16}
            style={{
              verticalAlign: 'middle',
              marginRight: '4px'
            }}
          />
          {success}
        </div>
      )}


      {/* OTP Form */}

      <form onSubmit={handleVerify}>

        <div
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            marginBottom: '20px'
          }}
        >
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) =>
                (inputRefs.current[idx] = el)
              }
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) =>
                handleChange(
                  idx,
                  e.target.value
                )
              }
              onKeyDown={(e) =>
                handleKeyDown(idx, e)
              }
              style={{
                width: '46px',
                height: '52px',
                borderRadius: '10px',
                border: digit
                  ? '2px solid #F97316'
                  : '1.5px solid #CBD5E1',
                backgroundColor: digit
                  ? '#FFF7ED'
                  : '#FFFFFF',
                textAlign: 'center',
                fontSize: '1.25rem',
                fontWeight: '800',
                color: '#0F172A',
                outline: 'none',
                transition:
                  'all 0.15s ease'
              }}
            />
          ))}
        </div>


        <button
          type="submit"
          className="btn btn-primary btn-full btn-lg"
          disabled={isVerifying}
        >
          {isVerifying
            ? 'Verifying...'
            : 'Verify OTP & Login'}
        </button>


        {/* Resend */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px',
            fontSize: '0.82rem'
          }}
        >
          <span
            style={{
              color: '#64748B'
            }}
          >
            {canResend
              ? "Didn't receive code?"
              : `Resend OTP in ${timer}s`}
          </span>

          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend}
            className="btn-ghost"
            style={{
              fontSize: '0.82rem',
              color: canResend
                ? '#F97316'
                : '#94A3B8',
              fontWeight: '700',
              padding: '4px 8px',
              cursor: canResend
                ? 'pointer'
                : 'not-allowed'
            }}
          >
            <RefreshCw
              size={12}
              style={{
                marginRight: '4px'
              }}
            />
            Resend OTP
          </button>
        </div>

      </form>

    </div>
  );
}
