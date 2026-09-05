import React, { useState } from 'react';
import {
  Package,
  Trees,
  Zap,
  Building2,
  UtensilsCrossed,
  Cog,
  Shirt,
  Armchair,
  Home,
  Bath,
  FileText,
  ArrowLeft,
  Weight,
  FileEdit,
  AlertTriangle,
  IndianRupee
} from 'lucide-react';

import { GOODS_CATEGORIES } from '../../mockData/mockData';

const ICON_MAP = {
  Trees: Trees,
  Zap: Zap,
  Package: Package,
  Building2: Building2,
  UtensilsCrossed: UtensilsCrossed,
  Cog: Cog,
  Shirt: Shirt,
  Armchair: Armchair,
  Home: Home,
  Bath: Bath,
  FileText: FileText
};

export default function Step3Goods({
  bookingData,
  updateBookingData,
  onNext,
  onBack
}) {
  const [selectedCategoryId, setSelectedCategoryId] =
    useState(
      bookingData.goodsCategory?.id || 7
    );

  const [weight, setWeight] = useState(
    bookingData.loadWeight || ''
  );

  const [expectedCost, setExpectedCost] = useState(
    bookingData.expectedTransportationCost || ''
  );

  const [description, setDescription] = useState(
    bookingData.description || ''
  );

  const [specialInstructions, setSpecialInstructions] =
    useState(
      bookingData.specialInstructions || ''
    );

  const [error, setError] = useState('');

  const selectedCategoryObj =
    GOODS_CATEGORIES.find(
      (c) => c.id === selectedCategoryId
    );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCategoryObj) {
      setError('Please select a goods category.');
      return;
    }

    if (!weight.trim()) {
      setError(
        'Please enter the load weight or quantity.'
      );
      return;
    }

    if (
      !expectedCost ||
      Number(expectedCost) <= 0
    ) {
      setError(
        'Please enter your expected transportation cost.'
      );
      return;
    }

    setError('');

    updateBookingData({
      goodsCategory: selectedCategoryObj,

      loadWeight: weight.trim(),

      expectedTransportationCost:
        Number(expectedCost),

      description: description.trim(),

      specialInstructions:
        specialInstructions.trim()
    });

    onNext();
  };

  return (
    <div
      className="card"
      style={{
        maxWidth: '840px',
        margin: '0 auto'
      }}
    >
      {/* Back */}

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
        Back to Schedule
      </button>

      {/* Header */}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#FFF7ED',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Package
            size={22}
            color="#F97316"
          />
        </div>

        <div>
          <h3
            className="title-md"
            style={{ margin: 0 }}
          >
            Select Goods Category
          </h3>

          <p className="subtitle">
            Step 3 of 5: Pick cargo type & enter
            load details
          </p>
        </div>
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
            fontSize: '0.88rem',
            marginBottom: '16px'
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* =========================
            GOODS CATEGORIES
        ========================= */}

        <div
          className="category-grid"
          style={{
            marginBottom: '28px'
          }}
        >
          {GOODS_CATEGORIES.map((cat) => {
            const IconComp =
              ICON_MAP[cat.iconName] ||
              Package;

            const isSelected =
              selectedCategoryId === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() =>
                  setSelectedCategoryId(cat.id)
                }
                className={`category-card ${
                  isSelected ? 'selected' : ''
                }`}
              >
                <div className="category-icon">
                  <IconComp size={24} />
                </div>

                <h4
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    margin: 0,
                    color: isSelected
                      ? '#F97316'
                      : '#0F172A',
                    lineHeight: '1.2'
                  }}
                >
                  {cat.title}
                </h4>
              </div>
            );
          })}
        </div>

        {/* =========================
            SELECTED CATEGORY
        ========================= */}

        {selectedCategoryObj && (
          <div
            style={{
              backgroundColor: '#FFF7ED',
              border: '1px solid #FFEDD5',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <Package
              size={20}
              color="#F97316"
            />

            <div>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: '#C2410C'
                }}
              >
                Selected: {selectedCategoryObj.title}
              </span>

              <p
                style={{
                  fontSize: '0.78rem',
                  color: '#9A3412',
                  margin: 0
                }}
              >
                {selectedCategoryObj.desc}
                {' • '}
                Recommended vehicle:{' '}
                <strong>
                  {selectedCategoryObj.recommendedVehicle}
                </strong>
              </p>
            </div>
          </div>
        )}

        {/* =========================
            LOAD + EXPECTED COST
        ========================= */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            marginBottom: '20px'
          }}
        >

          {/* LOAD WEIGHT */}

          <div
            className="form-group"
            style={{ margin: 0 }}
          >
            <label
              className="form-label"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Weight
                size={15}
                color="#64748B"
              />

              <span>
                Load Weight / Quantity
              </span>
            </label>

            <input
              type="text"
              className="form-input"
              placeholder="e.g. 2.5 Tons or 15 Bales"
              value={weight}
              onChange={(e) =>
                setWeight(e.target.value)
              }
            />

            <p
              style={{
                fontSize: '0.75rem',
                color: '#64748B',
                marginTop: '6px',
                marginBottom: 0
              }}
            >
              Enter the approximate weight or
              quantity of your goods.
            </p>

            <div
              style={{
                marginTop: '8px',
                padding: '8px 10px',
                borderRadius: '8px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                fontSize: '0.75rem',
                color: '#475569'
              }}
            >
              <strong>
                Capacity:
              </strong>{' '}
              The selected truck's maximum
              capacity will be checked in the
              next step.
            </div>
          </div>


          {/* EXPECTED COST */}

          <div
            className="form-group"
            style={{ margin: 0 }}
          >
            <label
              className="form-label"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <IndianRupee
                size={15}
                color="#64748B"
              />

              <span>
                Expected Transportation Cost
              </span>
            </label>

            <div
              style={{
                position: 'relative'
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform:
                    'translateY(-50%)',
                  fontWeight: '700',
                  color: '#334155'
                }}
              >
                ₹
              </span>

              <input
                type="number"
                className="form-input"
                placeholder="e.g. 5000"
                min="0"
                step="100"
                value={expectedCost}
                onChange={(e) =>
                  setExpectedCost(
                    e.target.value
                  )
                }
                style={{
                  paddingLeft: '32px'
                }}
              />
            </div>

            <p
              style={{
                fontSize: '0.75rem',
                color: '#64748B',
                marginTop: '6px',
                marginBottom: 0
              }}
            >
              Enter the transportation amount
              you expect to pay.
            </p>
          </div>

        </div>

        {/* =========================
            DESCRIPTION
        ========================= */}

        <div
          style={{
            marginBottom: '16px'
          }}
        >
          <div
            className="form-group"
            style={{ margin: 0 }}
          >
            <label
              className="form-label"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <FileEdit
                size={15}
                color="#64748B"
              />

              <span>
                Goods Description (Optional)
              </span>
            </label>

            <input
              type="text"
              className="form-input"
              placeholder="e.g. Cotton sarees in moisture-proof rolls"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />
          </div>
        </div>

        {/* =========================
            SPECIAL INSTRUCTIONS
        ========================= */}

        <div
          className="form-group"
          style={{
            marginBottom: '24px'
          }}
        >
          <label
            className="form-label"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <AlertTriangle
              size={15}
              color="#F59E0B"
            />

            <span>
              Special Handling Instructions
              (Optional)
            </span>
          </label>

          <textarea
            className="form-textarea"
            rows={2}
            placeholder="e.g. Needs tarpaulin cover against rain, delicate glass items, or crane assistance required"
            value={specialInstructions}
            onChange={(e) =>
              setSpecialInstructions(
                e.target.value
              )
            }
          />
        </div>

        {/* =========================
            CONTINUE
        ========================= */}

        <button
          type="submit"
          className="btn btn-primary btn-full btn-lg"
        >
          Continue to Select Truck
        </button>

      </form>
    </div>
  );
}
