const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const driverOnly = require("../middleware/driverMiddleware");
const { otpRequestLimiter, otpVerifyLimiter } = require("../middleware/rateLimiter");

const authController = require("../controllers/driverAuthController");
const loadController = require("../controllers/driverLoadController");

// ==========================================
// AUTH
// ==========================================

router.post("/auth/register", authController.register);
router.post("/auth/request-otp", otpRequestLimiter, authController.requestOtp);
router.post("/auth/verify-otp", otpVerifyLimiter, authController.verifyLoginOtp);
router.get("/auth/me", auth, driverOnly, authController.getMe);

// ==========================================
// LOADS
// ==========================================

router.get("/loads/available", auth, driverOnly, loadController.getAvailableLoads);
router.get("/loads/mine", auth, driverOnly, loadController.getMyLoads);
router.put("/loads/:id/accept", auth, driverOnly, loadController.acceptLoad);
router.put("/loads/:id/deliver", auth, driverOnly, loadController.markDelivered);

module.exports = router;
