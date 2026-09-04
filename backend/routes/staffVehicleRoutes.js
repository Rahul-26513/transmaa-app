const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const staff = require("../middleware/staffMiddleware");
const controller = require("../controllers/staffVehicleController");

router.use(auth, staff);

router.get("/", controller.getVehicles);
router.get("/:id", controller.getVehicleById);
router.put("/:id/approve", controller.approveVehicle);
router.put("/:id/reject", controller.rejectVehicle);

module.exports = router;
