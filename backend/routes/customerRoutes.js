const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { otpRequestLimiter, otpVerifyLimiter } = require("../middleware/rateLimiter");

const authController = require("../controllers/customerAuthController");
const bookingController = require("../controllers/customerBookingController");
const vehicleController = require("../controllers/customerVehicleController");
const enquiryController = require("../controllers/customerEnquiryController");

// ==========================================
// AUTH
// ==========================================

router.post("/auth/register", authController.register);
router.post("/auth/request-otp", otpRequestLimiter, authController.requestOtp);
router.post("/auth/verify-otp", otpVerifyLimiter, authController.verifyLoginOtp);
router.get("/auth/me", auth, authController.getMe);
router.put("/auth/profile", auth, authController.updateProfile);

// ==========================================
// BOOKINGS
// ==========================================

router.post("/bookings", auth, bookingController.createBooking);
router.get("/bookings", auth, bookingController.getMyBookings);
router.get("/bookings/:id", auth, bookingController.getMyBookingById);

// ==========================================
// VEHICLES (BUY & SELL)
// ==========================================

router.get("/vehicles/live", vehicleController.getLiveVehicles);
router.post("/vehicles/:id/interest", vehicleController.expressInterest);
router.post("/vehicles", auth, vehicleController.submitVehicle);
router.get("/vehicles/mine", auth, vehicleController.getMyVehicles);

// ==========================================
// FINANCE & INSURANCE ENQUIRIES
// ==========================================

router.post("/enquiries", auth, enquiryController.submitEnquiry);
router.get("/enquiries", auth, enquiryController.getMyEnquiries);

module.exports = router;
