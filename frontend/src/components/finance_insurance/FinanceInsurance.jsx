import React, { useState } from 'react';
import {
  DollarSign,
  Shield,
  CheckCircle2,
  Calculator,
  Send
} from 'lucide-react';
import * as customerApi from '../../services/customerApi';

export default function FinanceInsurance({
  user,
  showToast
}) {
  const [activeTab, setActiveTab] = useState('finance');

  // =========================
  // EMI CALCULATOR
  // =========================

  const [loanAmount, setLoanAmount] =
    useState(500000);

  const [interestRate, setInterestRate] =
    useState(10.5);

  const [tenureYears, setTenureYears] =
    useState(3);

  // =========================
  // FORM
  // =========================

  const [formName, setFormName] =
    useState(user?.name || '');

  const [formPhone, setFormPhone] =
    useState(user?.phone || '');

  const [formVehicleType, setFormVehicleType] =
    useState('Pickup Truck');

  const [formRcNumber, setFormRcNumber] =
    useState('');

  const [submitted, setSubmitted] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState('');

  // =========================
  // EMI CALCULATION
  // =========================

  const calculateEMI = () => {
    const monthlyRate =
      interestRate / 12 / 100;

    const months =
      tenureYears * 12;

    if (monthlyRate === 0) {
      return Math.round(
        loanAmount / months
      );
    }

    const emi =
      (loanAmount *
        monthlyRate *
        Math.pow(
          1 + monthlyRate,
          months
        )) /
      (
        Math.pow(
          1 + monthlyRate,
          months
        ) - 1
      );

    return Math.round(emi);
  };

  const emiVal =
    calculateEMI();

  const totalPayment =
    emiVal *
    tenureYears *
    12;

  const totalInterest =
    totalPayment -
    loanAmount;

  // =========================
  // SUBMIT ENQUIRY
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (!user?.id) {
      setError(
        'Customer account not found. Please login again.'
      );

      if (showToast) {
        showToast(
          'Please login before submitting an enquiry.',
          'error'
        );
      }

      return;
    }

    if (!formName.trim()) {
      setError(
        'Please enter your full name.'
      );
      return;
    }

    if (!formPhone.trim()) {
      setError(
        'Please enter your phone number.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await customerApi.submitEnquiry({
        name: formName.trim(),
        phone: formPhone.trim(),
        type: activeTab,
        vehicleType: formVehicleType,
        rcNumber: formRcNumber.trim()
      });

      setSubmitted(true);

      if (showToast) {
        showToast(
          `Your ${
            activeTab === 'finance'
              ? 'Finance'
              : 'Insurance'
          } enquiry submitted successfully!`,
          'success'
        );
      }

      console.log(
        'Enquiry saved to MongoDB:',
        data.enquiry
      );

    } catch (err) {

      console.error(
        'Finance/Insurance enquiry error:',
        err
      );

      setError(
        err.message ||
        'Unable to submit enquiry. Please try again.'
      );

      if (showToast) {
        showToast(
          err.message ||
          'Unable to submit enquiry.',
          'error'
        );
      }

    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // RESET
  // =========================

  const handleAnotherEnquiry = () => {
    setSubmitted(false);
    setError('');
    setFormRcNumber('');
  };

  return (
    <div className="content-wrapper">

      {/* =========================
          TOP BANNER
      ========================= */}

      <div
        style={{
          background:
            'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFFFFF',
          borderRadius: '20px',
          padding: '32px 24px',
          marginBottom: '28px',
          boxShadow:
            '0 10px 25px rgba(15, 23, 42, 0.15)'
        }}
      >
        <h2
          className="title-lg"
          style={{
            color: '#FFFFFF',
            marginBottom: '8px'
          }}
        >
          Transmaa Commercial Finance & Insurance Solutions
        </h2>

        <p
          style={{
            color: '#94A3B8',
            fontSize: '0.92rem',
            maxWidth: '600px'
          }}
        >
          Low interest commercial vehicle loans,
          quick disbursal, and comprehensive fleet
          insurance packages tailored for transport
          operators.
        </p>
      </div>


      {/* =========================
          TABS
      ========================= */}

      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}
      >

        <button
          onClick={() => {
            setActiveTab('finance');
            setSubmitted(false);
            setError('');
          }}
          className={`btn ${
            activeTab === 'finance'
              ? 'btn-primary'
              : 'btn-outline'
          }`}
          style={{
            flex: 1,
            minWidth: '250px',
            padding: '14px'
          }}
        >
          <DollarSign size={20} />
          Vehicle Finance & Loan EMI
        </button>


        <button
          onClick={() => {
            setActiveTab('insurance');
            setSubmitted(false);
            setError('');
          }}
          className={`btn ${
            activeTab === 'insurance'
              ? 'btn-primary'
              : 'btn-outline'
          }`}
          style={{
            flex: 1,
            minWidth: '250px',
            padding: '14px'
          }}
        >
          <Shield size={20} />
          Commercial Fleet Insurance
        </button>

      </div>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}
      >

        {/* =========================
            LEFT SIDE
        ========================= */}

        {activeTab === 'finance' ? (

          <div className="card">

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}
            >
              <Calculator
                size={22}
                color="#F97316"
              />

              <h3
                className="title-md"
                style={{ margin: 0 }}
              >
                Interactive Commercial EMI Calculator
              </h3>
            </div>


            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >

              {/* Loan Amount */}

              <div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    marginBottom: '6px'
                  }}
                >
                  <span className="form-label">
                    Loan Amount:
                  </span>

                  <strong
                    style={{
                      color: '#F97316',
                      fontSize: '1rem'
                    }}
                  >
                    ₹{loanAmount.toLocaleString()}
                  </strong>
                </div>

                <input
                  type="range"
                  min="100000"
                  max="2500000"
                  step="50000"
                  value={loanAmount}
                  onChange={(e) =>
                    setLoanAmount(
                      Number(e.target.value)
                    )
                  }
                  style={{
                    width: '100%',
                    accentColor: '#F97316'
                  }}
                />

              </div>


              {/* Interest Rate */}

              <div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    marginBottom: '6px'
                  }}
                >
                  <span className="form-label">
                    Interest Rate (% p.a.):
                  </span>

                  <strong>
                    {interestRate}%
                  </strong>
                </div>

                <input
                  type="range"
                  min="8"
                  max="16"
                  step="0.25"
                  value={interestRate}
                  onChange={(e) =>
                    setInterestRate(
                      Number(e.target.value)
                    )
                  }
                  style={{
                    width: '100%',
                    accentColor: '#F97316'
                  }}
                />

              </div>


              {/* Tenure */}

              <div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    marginBottom: '6px'
                  }}
                >
                  <span className="form-label">
                    Tenure (Years):
                  </span>

                  <strong>
                    {tenureYears} Years
                  </strong>
                </div>

                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={tenureYears}
                  onChange={(e) =>
                    setTenureYears(
                      Number(e.target.value)
                    )
                  }
                  style={{
                    width: '100%',
                    accentColor: '#F97316'
                  }}
                />

              </div>


              {/* EMI SUMMARY */}

              <div
                style={{
                  backgroundColor: '#FFF7ED',
                  border:
                    '1.5px solid #FFEDD5',
                  borderRadius: '14px',
                  padding: '20px',
                  textAlign: 'center'
                }}
              >

                <span
                  style={{
                    fontSize: '0.8rem',
                    color: '#9A3412',
                    display: 'block'
                  }}
                >
                  Estimated Monthly EMI
                </span>

                <strong
                  style={{
                    fontSize: '2rem',
                    color: '#EA580C',
                    fontWeight: '800'
                  }}
                >
                  ₹{emiVal.toLocaleString()}/mo
                </strong>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '12px',
                    fontSize: '0.78rem',
                    color: '#64748B',
                    borderTop:
                      '1px dashed #FFD8A8',
                    paddingTop: '8px',
                    gap: '12px'
                  }}
                >

                  <span>
                    Total Interest:{' '}
                    <strong>
                      ₹{totalInterest.toLocaleString()}
                    </strong>
                  </span>

                  <span>
                    Total Payable:{' '}
                    <strong>
                      ₹{totalPayment.toLocaleString()}
                    </strong>
                  </span>

                </div>

              </div>

            </div>

          </div>

        ) : (

          /* =========================
             INSURANCE
          ========================= */

          <div className="card">

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}
            >
              <Shield
                size={22}
                color="#10B981"
              />

              <h3
                className="title-md"
                style={{ margin: 0 }}
              >
                Transmaa Vehicle Insurance Benefits
              </h3>
            </div>


            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >

              {[
                {
                  title:
                    'Cashless Fleet Claims',
                  desc:
                    'Pre-approved network garages across major highways in Telangana & AP.'
                },
                {
                  title:
                    'Third-Party & Comprehensive Cover',
                  desc:
                    'Protects cargo damages, vehicle collision, fire, and natural disasters.'
                },
                {
                  title:
                    'Instant Online Renewal',
                  desc:
                    'Zero inspection paperwork for vehicles with clean claims history.'
                },
                {
                  title:
                    'Roadside Breakdown Towing',
                  desc:
                    '24/7 emergency vehicle towing assistance included.'
                }
              ].map((item, index) => (

                <div
                  key={index}
                  style={{
                    backgroundColor: '#F8FAFC',
                    padding: '14px',
                    borderRadius: '10px',
                    border:
                      '1px solid #E2E8F0'
                  }}
                >

                  <strong
                    style={{
                      fontSize: '0.9rem',
                      color: '#0F172A',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <CheckCircle2
                      size={16}
                      color="#10B981"
                    />

                    {item.title}
                  </strong>

                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: '#64748B',
                      marginTop: '4px',
                      marginBottom: 0
                    }}
                  >
                    {item.desc}
                  </p>

                </div>

              ))}

            </div>

          </div>
        )}


        {/* =========================
            RIGHT SIDE FORM
        ========================= */}

        <div className="card">

          {submitted ? (

            <div
              style={{
                textAlign: 'center',
                padding: '30px 10px'
              }}
            >

              <CheckCircle2
                size={48}
                color="#10B981"
                style={{
                  margin:
                    '0 auto 12px auto'
                }}
              />

              <h3
                className="title-md"
                style={{
                  color: '#0F172A'
                }}
              >
                Your Enquiry Has Been Submitted!
              </h3>

              <p
                className="subtitle"
                style={{
                  marginTop: '6px',
                  marginBottom: '20px'
                }}
              >
                Transmaa staff will contact you
                shortly to process your{' '}
                {activeTab === 'finance'
                  ? 'finance'
                  : 'insurance'}{' '}
                application.
              </p>

              <button
                onClick={
                  handleAnotherEnquiry
                }
                className="btn btn-outline"
              >
                Submit Another Enquiry
              </button>

            </div>

          ) : (

            <form onSubmit={handleSubmit}>

              <h3
                className="title-md"
                style={{
                  marginBottom: '6px'
                }}
              >
                Enquire for{' '}
                {activeTab === 'finance'
                  ? 'Vehicle Loan'
                  : 'Insurance Policy'}
              </h3>

              <p
                className="subtitle"
                style={{
                  marginBottom: '20px'
                }}
              >
                Fill in details for immediate
                call-back from Transmaa advisor
              </p>


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


              {/* Name */}

              <div className="form-group">

                <label className="form-label">
                  Full Name
                </label>

                <input
                  type="text"
                  className="form-input"
                  value={formName}
                  onChange={(e) => {
                    setFormName(
                      e.target.value
                    );
                    setError('');
                  }}
                  required
                />

              </div>


              {/* Phone */}

              <div className="form-group">

                <label className="form-label">
                  Phone Number
                </label>

                <input
                  type="tel"
                  className="form-input"
                  value={formPhone}
                  onChange={(e) => {
                    setFormPhone(
                      e.target.value
                    );
                    setError('');
                  }}
                  required
                />

              </div>


              {/* Vehicle Type */}

              <div className="form-group">

                <label className="form-label">
                  Commercial Vehicle Type
                </label>

                <select
                  className="form-select"
                  value={formVehicleType}
                  onChange={(e) =>
                    setFormVehicleType(
                      e.target.value
                    )
                  }
                >

                  <option value="Mini Truck">
                    Mini Truck (Tata Ace)
                  </option>

                  <option value="Pickup Truck">
                    Pickup Truck (Bolero)
                  </option>

                  <option value="Light Commercial Truck">
                    Light Commercial Truck (14ft)
                  </option>

                  <option value="Medium Truck">
                    Medium Truck (6-Wheeler)
                  </option>

                  <option value="Heavy Truck">
                    Heavy Truck (10-12 Wheeler)
                  </option>

                </select>

              </div>


              {/* RC Number */}

              <div
                className="form-group"
                style={{
                  marginBottom: '24px'
                }}
              >

                <label className="form-label">
                  RC Number (Optional)
                </label>

                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. TS 09 AB 1234"
                  value={formRcNumber}
                  onChange={(e) =>
                    setFormRcNumber(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* SUBMIT */}

              <button
                type="submit"
                className="btn btn-primary btn-full btn-lg"
                disabled={isSubmitting}
              >
                <Send size={18} />

                {isSubmitting
                  ? 'Submitting...'
                  : 'Submit Enquiry'}
              </button>

            </form>

          )}

        </div>

      </div>

    </div>
  );
}