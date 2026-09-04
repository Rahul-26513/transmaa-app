const Vehicle = require("../models/Vehicle");
const asyncHandler = require("../utils/asyncHandler");

exports.submitVehicle = asyncHandler(async (req, res) => {
  const {
    makeModel,
    vehicleType,
    year,
    rcNumber,
    price,
    kmDriven,
    fuelType,
    location,
    description,
    photos
  } = req.body;

  if (!makeModel || !rcNumber) {
    return res.status(400).json({ message: "Vehicle model and RC number are required" });
  }

  const vehicle = await Vehicle.create({
    sellerName: req.user.name,
    sellerPhone: req.user.phone,
    makeModel,
    vehicleType,
    year,
    rcNumber,
    price,
    kmDriven,
    fuelType,
    location,
    description,
    photos: photos || [],
    status: "pending"
  });

  res.status(201).json({ message: "Vehicle submitted for verification", vehicle });
});

exports.getMyVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({ sellerPhone: req.user.phone }).sort({ createdAt: -1 });

  res.status(200).json({ count: vehicles.length, vehicles });
});

// ==========================================
// PUBLIC MARKETPLACE (no auth required to browse)
// ==========================================

exports.getLiveVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({ status: "live" }).sort({ publishedAt: -1 });

  res.status(200).json({ count: vehicles.length, vehicles });
});

exports.expressInterest = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: "Name and phone are required" });
  }

  const vehicle = await Vehicle.findOne({ _id: req.params.id, status: "live" });

  if (!vehicle) {
    return res.status(404).json({ message: "Listing not found" });
  }

  vehicle.interestedBuyers.push({ name, phone });
  await vehicle.save();

  res.status(200).json({ message: "Interest submitted successfully", vehicle });
});
