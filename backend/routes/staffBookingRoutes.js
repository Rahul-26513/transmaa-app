const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const staff = require("../middleware/staffMiddleware");
const controller = require("../controllers/staffBookingController");

router.use(auth, staff);

router.get("/dashboard/stats", controller.getDashboardStats);
router.get("/", controller.getBookings);
router.get("/:id", controller.getBookingById);
router.put("/:id/accept", controller.acceptBooking);
router.put("/:id/reject", controller.rejectBooking);
router.put("/:id/driver-accept", controller.markDriverAccepted);
router.put("/:id/send-confirmation", controller.sendConfirmation);
router.put("/:id/deliver", controller.markDelivered);

module.exports = router;
