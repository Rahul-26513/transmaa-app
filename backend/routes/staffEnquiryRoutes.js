const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const staff = require("../middleware/staffMiddleware");
const controller = require("../controllers/staffEnquiryController");

router.use(auth, staff);

router.get("/", controller.getEnquiries);
router.get("/:id", controller.getEnquiryById);
router.put("/:id/toggle-contacted", controller.toggleContactedStatus);

module.exports = router;
