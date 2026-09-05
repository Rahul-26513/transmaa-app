import React from 'react';
import {
  CheckCircle2,
  MapPin,
  Calendar,
  Clock,
  Package,
  Truck,
  Edit2,
  Weight,
  FileEdit,
  AlertTriangle,
  IndianRupee
} from 'lucide-react';

export default function Step5Review({
  bookingData,
  onConfirm,
  onEditStep,
  isSaving
}) {
  const {
    fromLocation,
    toLocation,
    pickupDate,
    pickupTime,
    goodsCategory,
    loadWeight,
    expectedTransportationCost,
    description,
    specialInstructions,
    truckType,
    estimatedFare
  } = bookingData;

  return (
    <div
      className="card"
      style={{
        maxWidth: '720px',
        margin: '0 auto'
      }}
    >

      {/* =========================
          HEADER
      ========================= */}

      <div
        style={{
          textAlign: 'center',
          marginBottom: '24px'
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
          <CheckCircle2
            size={32}
            color="#F97316"
          />
        </div>

        <h3
          className="title-md"
          style={{
            fontSize: '1.25rem'
          }}
        >
          Review Booking Details
        </h3>

        <p className="subtitle">
          Verify your load details before final dispatch submission
        </p>
      </div>


      {/* =========================
          DETAILS
      ========================= */}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '24px'
        }}
      >

        {/* =========================
            ROUTE
        ========================= */}

        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '16px'
          }}
        >

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}
          >
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: '800',
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              1. Route Locations
            </span>

            <button
              onClick={() => onEditStep(1)}
              className="btn-ghost"
              style={{
                fontSize: '0.78rem',
                color: '#F97316',
                padding: '2px 8px',
                fontWeight: '600'
              }}
            >
              <Edit2 size={13} />
              Edit Route
            </button>
          </div>


          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              position: 'relative'
            }}
          >

            {/* Pickup */}

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}
            >
              <MapPin
                size={18}
                color="#10B981"
                style={{
                  flexShrink: 0,
                  marginTop: '2px'
                }}
              />

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
                    fontSize: '0.95rem',
                    color: '#0F172A'
                  }}
                >
                  {fromLocation}
                </strong>
              </div>
            </div>


            <div
              style={{
                borderLeft: '2px dashed #CBD5E1',
                marginLeft: '8px',
                height: '14px'
              }}
            />


            {/* Destination */}

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}
            >
              <MapPin
                size={18}
                color="#EF4444"
                style={{
                  flexShrink: 0,
                  marginTop: '2px'
                }}
              />

              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#64748B',
                    display: 'block'
                  }}
                >
                  Delivery Destination
                </span>

                <strong
                  style={{
                    fontSize: '0.95rem',
                    color: '#0F172A'
                  }}
                >
                  {toLocation}
                </strong>
              </div>
            </div>

          </div>
        </div>


        {/* =========================
            SCHEDULE + CARGO
        ========================= */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px'
          }}
        >

          {/* Schedule */}

          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '16px'
            }}
          >

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  color: '#64748B',
                  textTransform: 'uppercase'
                }}
              >
                2. Schedule Pickup
              </span>

              <button
                onClick={() => onEditStep(2)}
                className="btn-ghost"
                style={{
                  fontSize: '0.75rem',
                  color: '#F97316',
                  padding: '2px 6px'
                }}
              >
                <Edit2 size={12} />
                Edit
              </button>
            </div>

            <div
              style={{
                fontSize: '0.9rem',
                color: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Calendar
                size={16}
                color="#F97316"
              />

              <strong>
                {pickupDate}
              </strong>
            </div>

            <div
              style={{
                fontSize: '0.85rem',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '6px'
              }}
            >
              <Clock
                size={16}
                color="#64748B"
              />

              <span>
                {pickupTime}
              </span>
            </div>

          </div>


          {/* Cargo */}

          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '16px'
            }}
          >

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  color: '#64748B',
                  textTransform: 'uppercase'
                }}
              >
                3. Cargo Details
              </span>

              <button
                onClick={() => onEditStep(3)}
                className="btn-ghost"
                style={{
                  fontSize: '0.75rem',
                  color: '#F97316',
                  padding: '2px 6px'
                }}
              >
                <Edit2 size={12} />
                Edit
              </button>
            </div>


            {/* Category */}

            <div
              style={{
                fontSize: '0.9rem',
                color: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Package
                size={16}
                color="#F97316"
              />

              <strong>
                {goodsCategory?.title}
              </strong>
            </div>


            {/* Weight */}

            <div
              style={{
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.82rem',
                color: '#64748B'
              }}
            >
              <Weight size={15} />

              <span>
                Load Weight / Quantity:
              </span>

              <strong
                style={{
                  color: '#0F172A'
                }}
              >
                {loadWeight}
              </strong>
            </div>


            {/* Expected Cost */}

            <div
              style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <IndianRupee
                size={16}
                color="#059669"
              />

              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#047857',
                    display: 'block'
                  }}
                >
                  Your Expected Transportation Cost
                </span>

                <strong
                  style={{
                    fontSize: '1rem',
                    color: '#065F46'
                  }}
                >
                  ₹
                  {expectedTransportationCost
                    ? Number(
                        expectedTransportationCost
                      ).toLocaleString()
                    : 'Not specified'}
                </strong>
              </div>
            </div>


            {/* Description */}

            {description && (
              <div
                style={{
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  fontSize: '0.8rem',
                  color: '#64748B'
                }}
              >
                <FileEdit
                  size={14}
                  style={{
                    marginTop: '2px',
                    flexShrink: 0
                  }}
                />

                <span>
                  {description}
                </span>
              </div>
            )}


            {/* Special Instructions */}

            {specialInstructions && (
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#D97706',
                  marginTop: '8px',
                  fontStyle: 'italic',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '5px'
                }}
              >
                <AlertTriangle
                  size={14}
                  style={{
                    flexShrink: 0
                  }}
                />

                Note: {specialInstructions}
              </p>
            )}

          </div>

        </div>


        {/* =========================
            VEHICLE + FARE
        ========================= */}

        <div
          style={{
            backgroundColor: '#FFF7ED',
            border: '1.5px solid #FFEDD5',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '800',
                color: '#C2410C',
                textTransform: 'uppercase'
              }}
            >
              4. Selected Vehicle & Estimate
            </span>

            <button
              onClick={() => onEditStep(4)}
              className="btn-ghost"
              style={{
                fontSize: '0.75rem',
                color: '#F97316',
                padding: '2px 6px'
              }}
            >
              <Edit2 size={12} />
              Change Truck
            </button>
          </div>


          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap'
            }}
          >

            {/* Truck */}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >

              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Truck size={22} />
              </div>

              <div>

                <strong
                  style={{
                    fontSize: '1rem',
                    color: '#0F172A',
                    display: 'block'
                  }}
                >
                  {truckType?.name}
                </strong>

                <span
                  style={{
                    fontSize: '0.78rem',
                    color: '#64748B'
                  }}
                >
                  {truckType?.subName} (
                  {truckType?.capacity})
                </span>

              </div>

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
                  color: '#9A3412',
                  display: 'block'
                }}
              >
                Estimated Total Fare
              </span>

              <span
                style={{
                  fontSize: '1.3rem',
                  fontWeight: '800',
                  color: '#EA580C'
                }}
              >
                ₹
                {estimatedFare
                  ? estimatedFare.toLocaleString()
                  : 'Price to be confirmed'}
              </span>
            </div>

          </div>

        </div>

      </div>


      {/* =========================
          BUTTONS
      ========================= */}

      <div
        style={{
          display: 'flex',
          gap: '12px'
        }}
      >

        <button
          type="button"
          onClick={() => onEditStep(1)}
          className="btn btn-outline"
          style={{
            flex: 1
          }}
          disabled={isSaving}
        >
          <Edit2 size={16} />
          Edit Details
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className="btn btn-primary btn-lg"
          style={{
            flex: 2
          }}
          disabled={isSaving}
        >
          {isSaving
            ? 'Submitting Booking...'
            : 'Confirm Pickup & Submit'}
        </button>

      </div>

    </div>
  );
}
