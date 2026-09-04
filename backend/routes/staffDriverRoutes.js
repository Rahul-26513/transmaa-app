const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const staff = require("../middleware/staffMiddleware");
const controller = require("../controllers/staffDriverController");

router.use(auth, staff);

router.get("/", controller.getDrivers);
router.get("/:id", controller.getDriverById);
router.put("/:id/approve", controller.approveDriver);
router.put("/:id/reject", controller.rejectDriver);
router.put("/:id/toggle-status", controller.toggleDriverStatus);

module.exports = router;
