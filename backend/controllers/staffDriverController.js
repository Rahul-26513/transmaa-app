const Driver = require("../models/Driver");
const asyncHandler = require("../utils/asyncHandler");

exports.getDrivers = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.verificationStatus) {
    filter.verificationStatus = req.query.verificationStatus;
  }

  const drivers = await Driver.find(filter).sort({ createdAt: -1 });

  res.status(200).json({ count: drivers.length, drivers });
});

exports.getDriverById = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);

  if (!driver) {
    return res.status(404).json({ message: "Driver not found" });
  }

  res.status(200).json({ driver });
});

exports.approveDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: "approved", status: "Active" },
    { new: true }
  );

  if (!driver) {
    return res.status(404).json({ message: "Driver not found" });
  }

  res.status(200).json({ message: "Driver approved and verified", driver });
});

exports.rejectDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: "rejected" },
    { new: true }
  );

  if (!driver) {
    return res.status(404).json({ message: "Driver not found" });
  }

  res.status(200).json({ message: "Driver registration rejected", driver });
});

exports.toggleDriverStatus = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);

  if (!driver) {
    return res.status(404).json({ message: "Driver not found" });
  }

  driver.status = driver.status === "Active" ? "Inactive" : "Active";
  await driver.save();

  res.status(200).json({ message: "Driver status updated", driver });
});
