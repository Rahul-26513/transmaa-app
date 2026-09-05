import React from 'react';
import {
  X,
  Truck,
  MapPin,
  Calendar,
  Package,
  UserCheck,
  CheckCircle2,
  PhoneCall,
  Eye
} from 'lucide-react';

const STAGES = [
  { id: 1, label: 'Submitted' },
  { id: 2, label: 'Verified' },
  { id: 3, label: 'Driver Assigned' },
  { id: 4, label: 'Pickup' },
  { id: 5, label: 'On the Way' },
  { id: 6, label: 'Delivered' }
];

export default function BookingDetailModal({
  booking,
  onClose,
  showToast
}) {
  if (!booking) return null;

  const stage = booking.currentStage || 1;

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{ maxWidth: '680px' }}
      >

        {/* =========================
            HEADER
        ========================= */}

        <div className="modal-header">

          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >

              <span
                className="badge badge-verification"
                style={{ fontSize: '0.7rem' }}
              >
                ID: {booking.id || booking._id}
              </span>

              <span className="badge badge-confirmed">
                {stage === 6
                  ? 'Delivered'
                  : stage >= 3
                  ? 'Active En-Route'
                  : 'Under Verification'}
              </span>

            </div>

            <h3
              className="title-md"
              style={{
                marginTop: '4px',
                marginBottom: 0
              }}
            >
              Booking Tracking & Details
            </h3>
          </div>

          <button
            className="btn-ghost"
            onClick={onClose}
            style={{ padding: '6px' }}
          >
            <X size={20} />
          </button>

        </div>


        <div className="modal-body">

          {/* =========================
              TRACKING STEPPER
          ========================= */}

          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px'
            }}
          >

            <h4
              style={{
                fontSize: '0.85rem',
                fontWeight: '800',
                color: '#64748B',
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}
            >
              Live Tracking Timeline
            </h4>


            <div
              className="stepper-container"
              style={{
                margin: '16px 0 8px 0'
              }}
            >

              <div className="stepper-line">

                <div
                  className="stepper-line-progress"
                  style={{
                    width:
                      `${((stage - 1) / 5) * 100}%`
                  }}
                />

              </div>


              {STAGES.map((stg) => {

                const isCompleted =
                  stg.id < stage;

                const isActive =
                  stg.id === stage;

                return (
                  <div
                    key={stg.id}
                    className={`step-item ${
                      isActive
                        ? 'active'
                        : ''
                    } ${
                      isCompleted
                        ? 'completed'
                        : ''
                    }`}
                  >

                    <div className="step-bubble">

                      {isCompleted ? (
                        <CheckCircle2
                          size={16}
                        />
                      ) : (
                        stg.id
                      )}

                    </div>

                    <span
                      className="step-label"
                      style={{
                        fontSize: '0.7rem'
                      }}
                    >
                      {stg.label}
                    </span>

                  </div>
                );

              })}

            </div>

            {/* Customer notice */}
            <div
              style={{
                marginTop: '16px',
                padding: '10px 12px',
                backgroundColor: '#F1F5F9',
                borderRadius: '8px',
                fontSize: '0.78rem',
                color: '#64748B',
                textAlign: 'center'
              }}
            >
              Booking status is updated by
              Transmaa staff and drivers.
            </div>

          </div>


          {/* =========================
              ASSIGNED DRIVER
          ========================= */}

          {stage >= 3 &&
            booking.driverDetails && (

            <div
              style={{
                backgroundColor: '#FFF7ED',
                border:
                  '1.5px solid #FFEDD5',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'space-between',
                gap: '12px',
                flexWrap: 'wrap'
              }}
            >

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >

                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800'
                  }}
                >
                  <UserCheck size={22} />
                </div>

                <div>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#9A3412',
                      fontWeight: '700'
                    }}
                  >
                    Transmaa Verified Driver
                  </span>

                  <strong
                    style={{
                      fontSize: '0.95rem',
                      color: '#0F172A',
                      display: 'block'
                    }}
                  >
                    {booking.driverDetails.name}
                  </strong>

                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: '#64748B'
                    }}
                  >
                    Vehicle:{' '}
                    {booking.driverDetails.vehicleNumber}
                    {' • '}
                    Rating{' '}
                    {booking.driverDetails.rating}
                  </span>

                </div>

              </div>


              <button
                onClick={() =>
                  showToast(
                    'Connecting call to Transmaa driver...',
                    'info'
                  )
                }
                className="btn btn-primary btn-sm"
              >
                <PhoneCall size={14} />
                Call Driver
              </button>

            </div>

          )}


          {/* =========================
              ROUTE + SCHEDULE
          ========================= */}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}
          >

            {/* Route */}

            <div
              style={{
                backgroundColor: '#F8FAFC',
                border:
                  '1px solid #E2E8F0',
                padding: '14px',
                borderRadius: '12px'
              }}
            >

              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#64748B',
                  display: 'block',
                  marginBottom: '4px'
                }}
              >
                Route Details
              </span>

              <div
                style={{
                  fontSize: '0.88rem',
                  color: '#0F172A'
                }}
              >

                <div
                  style={{
                    marginBottom: '6px'
                  }}
                >
                  <MapPin
                    size={14}
                    color="#10B981"
                    style={{
                      verticalAlign:
                        'middle',
                      marginRight: '4px'
                    }}
                  />

                  <strong>From:</strong>{' '}
                  {booking.fromLocation}
                </div>

                <div>

                  <MapPin
                    size={14}
                    color="#EF4444"
                    style={{
                      verticalAlign:
                        'middle',
                      marginRight: '4px'
                    }}
                  />

                  <strong>To:</strong>{' '}
                  {booking.toLocation}

                </div>

              </div>

            </div>


            {/* Schedule */}

            <div
              style={{
                backgroundColor: '#F8FAFC',
                border:
                  '1px solid #E2E8F0',
                padding: '14px',
                borderRadius: '12px'
              }}
            >

              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#64748B',
                  display: 'block',
                  marginBottom: '4px'
                }}
              >
                Schedule & Truck
              </span>

              <div
                style={{
                  fontSize: '0.88rem',
                  color: '#0F172A'
                }}
              >

                <div
                  style={{
                    marginBottom: '6px'
                  }}
                >
                  <Calendar
                    size={14}
                    color="#F97316"
                    style={{
                      verticalAlign:
                        'middle',
                      marginRight: '4px'
                    }}
                  />

                  {booking.pickupDate}{' '}
                  ({booking.pickupTime})
                </div>

                <div>

                  <Truck
                    size={14}
                    color="#3B82F6"
                    style={{
                      verticalAlign:
                        'middle',
                      marginRight: '4px'
                    }}
                  />

                  {booking.truckType}
                </div>

              </div>

            </div>

          </div>


          {/* =========================
              CARGO + COST
          ========================= */}

          <div
            style={{
              borderTop:
                '1px solid #E2E8F0',
              paddingTop: '16px',
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}
          >

            {/* Goods */}

            <div>

              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#64748B',
                  display: 'block'
                }}
              >
                Goods Category
              </span>

              <strong
                style={{
                  fontSize: '0.9rem',
                  color: '#0F172A'
                }}
              >
                {booking.goodsCategory}
              </strong>

              {booking.loadWeight && (
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: '#64748B',
                    display: 'block',
                    marginTop: '4px'
                  }}
                >
                  Weight / Quantity:{' '}
                  {booking.loadWeight}
                </span>
              )}

            </div>


            {/* Expected Cost */}

            <div>

              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#64748B',
                  display: 'block'
                }}
              >
                Customer Expected Cost
              </span>

              <strong
                style={{
                  fontSize: '1rem',
                  color: '#059669'
                }}
              >
                ₹
                {booking.expectedTransportationCost
                  ? Number(
                      booking.expectedTransportationCost
                    ).toLocaleString()
                  : 'Not specified'}
              </strong>

            </div>


            {/* Estimated Fare */}

            <div
              style={{
                textAlign: 'right'
              }}
            >

              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#64748B',
                  display: 'block'
                }}
              >
                Estimated Fare
              </span>

              <strong
                style={{
                  fontSize: '1.2rem',
                  color: '#F97316'
                }}
              >
                ₹
                {booking.estimatedFare
                  ? Number(
                      booking.estimatedFare
                    ).toLocaleString()
                  : 'Price to be confirmed'}
              </strong>

            </div>

          </div>


          {/* =========================
              CLOSE
          ========================= */}

          <div
            style={{
              display: 'flex',
              gap: '12px'
            }}
          >

            <button
              type="button"
              onClick={onClose}
              className="btn btn-primary btn-full btn-lg"
            >
              <Eye size={18} />
              Done
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
