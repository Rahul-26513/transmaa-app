import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Eye
} from 'lucide-react';

const STAGES = [
  {
    id: 1,
    label: 'Submitted',
    badgeClass: 'badge-pending'
  },
  {
    id: 2,
    label: 'Verification',
    badgeClass: 'badge-verification'
  },
  {
    id: 3,
    label: 'Driver Assigned',
    badgeClass: 'badge-assigned'
  },
  {
    id: 4,
    label: 'Pickup',
    badgeClass: 'badge-confirmed'
  },
  {
    id: 5,
    label: 'On the Way',
    badgeClass: 'badge-ontheway'
  },
  {
    id: 6,
    label: 'Delivered',
    badgeClass: 'badge-delivered'
  }
];

export default function Step6Status({
  booking,
  onNavigateToBookings
}) {
  const [currentStage, setCurrentStage] = useState(
    booking.currentStage || 1
  );

  // Keep the displayed stage synchronized
  // with booking updates coming from backend.
  useEffect(() => {
    setCurrentStage(
      booking.currentStage || 1
    );
  }, [booking.currentStage]);

  const getStageInfo = (stage) => {
    switch (stage) {
      case 1:
        return {
          statusText:
            'Waiting for Transmaa Confirmation',
          description:
            'Your booking request has been submitted to Transmaa operations. Our dispatch team is verifying optimal route pricing & truck availability.',
          color: '#F97316'
        };

      case 2:
        return {
          statusText:
            'Transmaa Operations Verifying',
          description:
            'Route toll rates and load weights are verified. Assigning nearest verified driver.',
          color: '#3B82F6'
        };

      case 3:
        return {
          statusText:
            'Driver Assigned',
          description:
            'A verified Transmaa driver has been assigned to your booking and will proceed to the pickup location.',
          color: '#6366F1'
        };

      case 4:
        return {
          statusText:
            'Truck Arrived at Pickup Location',
          description:
            'Driver is inspecting cargo and loading goods onto the vehicle.',
          color: '#10B981'
        };

      case 5:
        return {
          statusText:
            'Cargo On the Way to Destination',
          description:
            'Your vehicle is currently en route to the destination. Live tracking may be available through Transmaa operations.',
          color: '#2563EB'
        };

      case 6:
        return {
          statusText:
            'Goods Delivered Successfully',
          description:
            'Cargo has reached the destination and the delivery has been confirmed.',
          color: '#059669'
        };

      default:
        return {
          statusText: 'Submitted',
          description: '',
          color: '#F97316'
        };
    }
  };

  const activeStageInfo =
    getStageInfo(currentStage);

  return (
    <div
      className="card"
      style={{
        maxWidth: '780px',
        margin: '0 auto'
      }}
    >

      {/* =========================
          HEADER BANNER
      ========================= */}

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
            borderRadius: '50%',
            backgroundColor: '#D1FAE5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}
        >
          <CheckCircle2 size={36} />
        </div>

        <h2
          className="title-lg"
          style={{
            fontSize: '1.5rem',
            color: '#0F172A'
          }}
        >
          Your Booking Has Been Submitted!
        </h2>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '8px'
          }}
        >
          <span
            style={{
              fontSize: '0.85rem',
              color: '#64748B'
            }}
          >
            Booking Reference ID:
          </span>

          <strong
            style={{
              fontSize: '0.95rem',
              backgroundColor: '#F1F5F9',
              padding: '2px 8px',
              borderRadius: '6px',
              color: '#0F172A',
              letterSpacing: '0.05em'
            }}
          >
            {booking.id || booking._id}
          </strong>
        </div>
      </div>


      {/* =========================
          VISUAL STEP STATUS
      ========================= */}

      <div
        className="stepper-container"
        style={{
          margin: '32px 0'
        }}
      >
        <div className="stepper-line">
          <div
            className="stepper-line-progress"
            style={{
              width:
                `${((currentStage - 1) / 5) * 100}%`
            }}
          />
        </div>

        {STAGES.map((stage) => {

          const isCompleted =
            stage.id < currentStage;

          const isActive =
            stage.id === currentStage;

          return (
            <div
              key={stage.id}
              className={`step-item ${
                isActive ? 'active' : ''
              } ${
                isCompleted ? 'completed' : ''
              }`}
            >
              <div className="step-bubble">

                {isCompleted ? (
                  <CheckCircle2
                    size={20}
                  />
                ) : (
                  stage.id
                )}

              </div>

              <span className="step-label">
                {stage.label}
              </span>
            </div>
          );

        })}
      </div>


      {/* =========================
          CURRENT STATUS
      ========================= */}

      <div
        style={{
          backgroundColor: '#FFF7ED',
          border: '1.5px solid #FFEDD5',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px'
        }}
      >

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '6px'
          }}
        >
          <ShieldCheck
            size={20}
            color={activeStageInfo.color}
          />

          <h4
            style={{
              fontSize: '1rem',
              fontWeight: '800',
              color: '#0F172A',
              margin: 0
            }}
          >
            Current Status:{' '}
            {activeStageInfo.statusText}
          </h4>
        </div>

        <p
          style={{
            fontSize: '0.85rem',
            color: '#475569',
            margin: 0,
            lineHeight: '1.5'
          }}
        >
          {activeStageInfo.description}
        </p>


        {/* DRIVER DETAILS */}

        {currentStage >= 3 &&
          booking.driverDetails && (

          <div
            style={{
              marginTop: '14px',
              paddingTop: '12px',
              borderTop:
                '1px dashed #CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.85rem'
            }}
          >

            <div>

              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#64748B',
                  display: 'block'
                }}
              >
                Assigned Driver
              </span>

              <strong
                style={{
                  color: '#0F172A'
                }}
              >
                {booking.driverDetails.name}
              </strong>{' '}

              (
              {booking.driverDetails.vehicleNumber}
              )

            </div>

            <span
              style={{
                backgroundColor: '#DCFCE7',
                color: '#166534',
                padding: '4px 10px',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '0.75rem'
              }}
            >
              {booking.driverDetails.rating}
            </span>

          </div>

        )}

      </div>


      {/* =========================
          BOOKING SUMMARY
      ========================= */}

      <div
        style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '18px',
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >

        <div>
          <span
            style={{
              fontSize: '0.75rem',
              color: '#64748B',
              display: 'block'
            }}
          >
            Pickup Location
          </span>

          <strong
            style={{
              fontSize: '0.88rem',
              color: '#0F172A'
            }}
          >
            {booking.fromLocation}
          </strong>
        </div>


        <div>
          <span
            style={{
              fontSize: '0.75rem',
              color: '#64748B',
              display: 'block'
            }}
          >
            Destination
          </span>

          <strong
            style={{
              fontSize: '0.88rem',
              color: '#0F172A'
            }}
          >
            {booking.toLocation}
          </strong>
        </div>


        <div>
          <span
            style={{
              fontSize: '0.75rem',
              color: '#64748B',
              display: 'block'
            }}
          >
            Schedule
          </span>

          <strong
            style={{
              fontSize: '0.88rem',
              color: '#0F172A'
            }}
          >
            {booking.pickupDate}{' '}
            ({booking.pickupTime})
          </strong>
        </div>


        <div>
          <span
            style={{
              fontSize: '0.75rem',
              color: '#64748B',
              display: 'block'
            }}
          >
            Truck Type
          </span>

          <strong
            style={{
              fontSize: '0.88rem',
              color: '#0F172A'
            }}
          >
            {booking.truckType?.name ||
              booking.truckType}
          </strong>
        </div>

      </div>


      {/* =========================
          ACTION
      ========================= */}

      <div
        style={{
          display: 'flex',
          gap: '12px'
        }}
      >

        <button
          type="button"
          onClick={
            onNavigateToBookings
          }
          className="btn btn-primary btn-full btn-lg"
        >
          <Eye size={18} />
          View My Bookings History
        </button>

      </div>

    </div>
  );
}
