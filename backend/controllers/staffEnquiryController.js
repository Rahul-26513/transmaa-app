const Enquiry = require("../models/Enquiry");
const asyncHandler = require("../utils/asyncHandler");

exports.getEnquiries = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });

  res.status(200).json({ count: enquiries.length, enquiries });
});

exports.getEnquiryById = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);

  if (!enquiry) {
    return res.status(404).json({ message: "Enquiry not found" });
  }

  res.status(200).json({ enquiry });
});

exports.toggleContactedStatus = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);

  if (!enquiry) {
    return res.status(404).json({ message: "Enquiry not found" });
  }

  enquiry.status = enquiry.status === "contacted" ? "pending" : "contacted";
  await enquiry.save();

  res.status(200).json({ message: "Lead status updated", enquiry });
});
