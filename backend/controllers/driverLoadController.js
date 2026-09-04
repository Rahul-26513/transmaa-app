const Booking = require("../models/Booking");
const Driver = require("../models/Driver");
const asyncHandler = require("../utils/asyncHandler");

async function getDriverProfile(req, res) {
  const driver = await Driver.findOne({ userId: req.user._id });

  if (!driver) {
    res.status(404).json({ message: "Driver profile not found" });
    return null;
  }

  if (driver.verificationStatus !== "approved") {
    res.status(403).json({ message: "Your account is not yet verified" });
    return null;
  }

  return driver;
}

exports.getAvailableLoads = asyncHandler(async (req, res) => {
  const driver = await getDriverProfile(req, res);
  if (!driver) return;

  const loads = await Booking.find({
    status: "accepted",
    driverId: null
  }).sort({ createdAt: -1 });

  res.status(200).json({ count: loads.length, loads });
});

exports.acceptLoad = asyncHandler(async (req, res) => {
  const driver = await getDriverProfile(req, res);
  if (!driver) return;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Load not found" });
  }

  if (booking.status !== "accepted" || booking.driverId) {
    return res.status(409).json({ message: "This load is no longer available" });
  }

  booking.status = "driver_accepted";
  booking.driverId = driver._id;
  booking.driverName = driver.name;
  booking.driverPhone = driver.phone;
  booking.driverVehicle = `${driver.vehicleNumber || ""} (${driver.vehicleType || ""})`.trim();

  await booking.save();

  res.status(200).json({ message: "Load accepted successfully", booking });
});

exports.getMyLoads = asyncHandler(async (req, res) => {
  const driver = await getDriverProfile(req, res);
  if (!driver) return;

  const loads = await Booking.find({ driverId: driver._id }).sort({ createdAt: -1 });

  res.status(200).json({ count: loads.length, loads });
});

exports.markDelivered = asyncHandler(async (req, res) => {
  const driver = await getDriverProfile(req, res);
  if (!driver) return;

  const booking = await Booking.findOne({ _id: req.params.id, driverId: driver._id });

  if (!booking) {
    return res.status(404).json({ message: "Load not found" });
  }

  if (booking.status !== "on_the_way") {
    return res.status(409).json({ message: "Load must be on the way before it can be delivered" });
  }

  booking.status = "delivered";
  booking.completedAt = new Date();
  await booking.save();

  driver.tripsCompleted = (driver.tripsCompleted || 0) + 1;
  await driver.save();

  res.status(200).json({ message: "Load marked as delivered", booking });
});
