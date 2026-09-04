const Vehicle = require("../models/Vehicle");
const asyncHandler = require("../utils/asyncHandler");

exports.getVehicles = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });

  res.status(200).json({ count: vehicles.length, vehicles });
});

exports.getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return res.status(404).json({ message: "Listing not found" });
  }

  res.status(200).json({ vehicle });
});

exports.approveVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    { status: "live", publishedAt: new Date() },
    { new: true }
  );

  if (!vehicle) {
    return res.status(404).json({ message: "Listing not found" });
  }

  res.status(200).json({ message: "Listing approved and published live", vehicle });
});

exports.rejectVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true }
  );

  if (!vehicle) {
    return res.status(404).json({ message: "Listing not found" });
  }

  res.status(200).json({ message: "Listing rejected", vehicle });
});
