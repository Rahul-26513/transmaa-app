const Enquiry = require("../models/Enquiry");
const asyncHandler = require("../utils/asyncHandler");

function normalizeEnquiryType(type) {
  const lower = String(type || "").toLowerCase();
  if (lower === "finance") return "Finance";
  if (lower === "insurance") return "Insurance";
  return null;
}

exports.submitEnquiry = asyncHandler(async (req, res) => {
  const { name, phone, type, vehicleType, rcNumber } = req.body;

  const enquiryType = normalizeEnquiryType(type);

  if (!name || !phone || !enquiryType) {
    return res.status(400).json({ message: "Name, phone and a valid enquiry type are required" });
  }

  const enquiry = await Enquiry.create({
    customerId: req.user._id,
    name,
    phone,
    enquiryType,
    vehicleType,
    rcNumber
  });

  res.status(201).json({ message: "Enquiry submitted successfully", enquiry });
});

exports.getMyEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await Enquiry.find({ customerId: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({ count: enquiries.length, enquiries });
});
