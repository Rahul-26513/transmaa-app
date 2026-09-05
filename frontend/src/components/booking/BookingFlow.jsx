import React, { useState } from 'react';
import Step1Route from './Step1Route';
import Step2Schedule from './Step2Schedule';
import Step3Goods from './Step3Goods';
import Step4Truck from './Step4Truck';
import Step5Review from './Step5Review';
import Step6Status from './Step6Status';
import * as customerApi from '../../services/customerApi';
import { mapBookingForDisplay } from '../../utils/customerMappers';

export default function BookingFlow({
  user,
  onOpenAuth,
  onCreateBooking,
  onNavigateToBookings
}) {
  const [currentStep, setCurrentStep] = useState(1);

  const [bookingData, setBookingData] = useState({
    fromLocation: 'Sircilla Textile Park',
    toLocation: 'Hitech City, Hyderabad',

    pickupDate: new Date(Date.now() + 86400000)
      .toISOString()
      .split('T')[0],

    pickupTime:
      'Morning Slot (08:00 AM - 12:00 PM)',

    goodsCategory: null,

    loadWeight: '',

    expectedTransportationCost: '',

    description: '',

    specialInstructions: '',

    truckType: null,

    estimatedFare: 4250,

    distanceKm: 140
  });

  const [submittedBooking, setSubmittedBooking] =
    useState(null);

  const [isSaving, setIsSaving] =
    useState(false);

  const [saveError, setSaveError] =
    useState('');


  // =========================
  // UPDATE BOOKING DATA
  // =========================

  const updateBookingData = (partialData) => {
    setBookingData((prev) => ({
      ...prev,
      ...partialData
    }));
  };


  // =========================
  // CONFIRM PICKUP
  // =========================

  const handleConfirmPickup = async () => {

    if (!user) {
      onOpenAuth();
      return;
    }

    if (!user.id) {
      setSaveError(
        'Customer ID is missing. Please log in again.'
      );
      return;
    }

    setIsSaving(true);
    setSaveError('');

    try {

      const bookingToSave = {
        fromLocation: bookingData.fromLocation,
        toLocation: bookingData.toLocation,

        shiftingDate: bookingData.pickupDate,
        shiftingTime: bookingData.pickupTime,

        goodsType: bookingData.goodsCategory?.title || 'General Goods',
        truckType: bookingData.truckType?.name || 'Pickup Truck',
        truckCapacity: bookingData.truckType?.capacity,

        loadWeight: bookingData.loadWeight,
        description: bookingData.description || '',
        specialInstructions: bookingData.specialInstructions || '',
        distanceKm: bookingData.distanceKm,

        customerExpectedCost:
          Number(bookingData.expectedTransportationCost) || 0
      };


      // =========================
      // SEND TO BACKEND
      // =========================

      const data = await customerApi.createBooking(bookingToSave);


      // =========================
      // FORMAT SAVED BOOKING FOR DISPLAY
      // =========================

      const savedBooking = mapBookingForDisplay(data.booking);


      setSubmittedBooking(
        savedBooking
      );


      onCreateBooking(
        savedBooking
      );


      setCurrentStep(6);

    } catch (error) {

      console.error(
        'Booking save error:',
        error
      );

      setSaveError(
        error.message ||
        'Unable to save booking. Please try again.'
      );

    } finally {

      setIsSaving(false);

    }
  };


  return (
    <div className="content-wrapper">

      {/* =========================
          PROGRESS BAR
      ========================= */}

      {currentStep < 6 && (

        <div
          style={{
            maxWidth: '640px',
            margin: '0 auto 24px auto'
          }}
        >

          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems:
                'center',
              marginBottom:
                '8px'
            }}
          >

            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: '700',
                color: '#64748B'
              }}
            >
              STEP {currentStep} OF 5
            </span>


            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: '700',
                color: '#F97316'
              }}
            >

              {currentStep === 1 &&
                'Route Selection'}

              {currentStep === 2 &&
                'Schedule Pickup'}

              {currentStep === 3 &&
                'Goods Category'}

              {currentStep === 4 &&
                'Truck Selection'}

              {currentStep === 5 &&
                'Review Summary'}

            </span>

          </div>


          <div
            style={{
              height: '6px',
              backgroundColor: '#E2E8F0',
              borderRadius: '4px',
              overflow: 'hidden'
            }}
          >

            <div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #F97316 0%, #FB923C 100%)',
                width:
                  `${(currentStep / 5) * 100}%`,
                transition:
                  'width 0.3s ease'
              }}
            />

          </div>

        </div>

      )}


      {/* =========================
          ERROR
      ========================= */}

      {saveError && (

        <div
          style={{
            maxWidth: '640px',
            margin:
              '0 auto 16px auto',
            padding:
              '12px 16px',
            backgroundColor:
              '#FEE2E2',
            border:
              '1px solid #FCA5A5',
            color:
              '#991B1B',
            borderRadius:
              '8px',
            fontSize:
              '0.9rem',
            textAlign:
              'center'
          }}
        >
          {saveError}
        </div>

      )}


      {/* =========================
          STEP 1
      ========================= */}

      {currentStep === 1 && (

        <Step1Route
          bookingData={
            bookingData
          }

          updateBookingData={
            updateBookingData
          }

          onNext={() =>
            setCurrentStep(2)
          }
        />

      )}


      {/* =========================
          STEP 2
      ========================= */}

      {currentStep === 2 && (

        <Step2Schedule
          bookingData={
            bookingData
          }

          updateBookingData={
            updateBookingData
          }

          onNext={() =>
            setCurrentStep(3)
          }

          onBack={() =>
            setCurrentStep(1)
          }
        />

      )}


      {/* =========================
          STEP 3
      ========================= */}

      {currentStep === 3 && (

        <Step3Goods
          bookingData={
            bookingData
          }

          updateBookingData={
            updateBookingData
          }

          onNext={() =>
            setCurrentStep(4)
          }

          onBack={() =>
            setCurrentStep(2)
          }
        />

      )}


      {/* =========================
          STEP 4
      ========================= */}

      {currentStep === 4 && (

        <Step4Truck
          bookingData={
            bookingData
          }

          updateBookingData={
            updateBookingData
          }

          onNext={() =>
            setCurrentStep(5)
          }

          onBack={() =>
            setCurrentStep(3)
          }
        />

      )}


      {/* =========================
          STEP 5
      ========================= */}

      {currentStep === 5 && (

        <Step5Review
          bookingData={
            bookingData
          }

          onEditStep={(stepNum) =>
            setCurrentStep(stepNum)
          }

          onConfirm={
            handleConfirmPickup
          }

          isSaving={
            isSaving
          }
        />

      )}


      {/* =========================
          STEP 6
      ========================= */}

      {currentStep === 6 &&
        submittedBooking && (

        <Step6Status
          booking={
            submittedBooking
          }

          onNavigateToBookings={
            onNavigateToBookings
          }
        />

      )}

    </div>
  );
}