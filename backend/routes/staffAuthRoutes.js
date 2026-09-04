const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const staff = require("../middleware/staffMiddleware");
const admin = require("../middleware/adminMiddleware");
const { loginLimiter } = require("../middleware/rateLimiter");
const {
  loginRules,
  bootstrapAdminRules,
  registerStaffRules,
  changePasswordRules
} = require("../validators/authValidators");

const controller = require("../controllers/staffAuthController");

router.post("/bootstrap-admin", bootstrapAdminRules, controller.bootstrapAdmin);

router.post("/login", loginLimiter, loginRules, controller.login);

router.get("/me", auth, staff, controller.getMe);

router.put("/change-password", auth, staff, changePasswordRules, controller.changePassword);

router.post("/register", auth, staff, registerStaffRules, controller.registerStaff);

router.get("/staff", auth, admin, controller.listStaff);

router.put("/staff/:id/status", auth, admin, controller.setStaffStatus);

module.exports = router;
