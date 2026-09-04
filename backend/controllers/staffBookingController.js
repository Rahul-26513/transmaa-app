const Booking = require("../models/Booking");
const Driver = require("../models/Driver");
const asyncHandler = require("../utils/asyncHandler");

const VALID_STATUSES = [
  "waiting",
  "accepted",
  "rejected",
  "driver_accepted",
  "on_the_way",
  "delivered"
];

exports.getBookings = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.status) {
    if (!VALID_STATUSES.includes(req.query.status)) {
      return res.status(400).json({ message: "Invalid status filter" });
    }
    filter.status = req.query.status;
  }

  const bookings = await Booking.find(filter).sort({ createdAt: -1 });

  res.status(200).json({ count: bookings.length, bookings });
});

exports.getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  res.status(200).json({ booking });
});

exports.acceptBooking = asyncHandler(async (req, res) => {
  const { price, deliveryName, deliveryPhone, deliveryAddress } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  if (booking.status !== "waiting") {
    return res.status(409).json({ message: `Booking is already ${booking.status}` });
  }

  booking.status = "accepted";
  if (price !== undefined) booking.price = price;
  if (deliveryName) booking.deliveryName = deliveryName;
  if (deliveryPhone) booking.deliveryPhone = deliveryPhone;
  if (deliveryAddress) booking.deliveryAddress = deliveryAddress;

  await booking.save();

  res.status(200).json({ message: "Booking accepted", booking });
});

exports.rejectBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  if (booking.status !== "waiting") {
    return res.status(409).json({ message: `Booking is already ${booking.status}` });
  }

  booking.status = "rejected";
  booking.rejectionReason = req.body.reason;

  await booking.save();

  res.status(200).json({ message: "Booking rejected", booking });
});

exports.markDriverAccepted = asyncHandler(async (req, res) => {
  const { driverId } = req.body;

  if (!driverId) {
    return res.status(400).json({ message: "driverId is required" });
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  if (booking.status !== "accepted") {
    return res.status(409).json({ message: `Booking must be accepted before a driver can take it` });
  }

  const driver = await Driver.findById(driverId);

  if (!driver) {
    return res.status(404).json({ message: "Driver not found" });
  }

  if (driver.verificationStatus !== "approved" || driver.status !== "Active") {
    return res.status(409).json({ message: "Driver is not active/verified" });
  }

  booking.status = "driver_accepted";
  booking.driverId = driver._id;
  booking.driverName = driver.name;
  booking.driverPhone = driver.phone;
  booking.driverVehicle = `${driver.vehicleNumber || ""} (${driver.vehicleType || ""})`.trim();

  await booking.save();

  res.status(200).json({ message: "Driver assigned to booking", booking });
});

exports.sendConfirmation = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  if (booking.status !== "driver_accepted") {
    return res.status(409).json({ message: "Booking must have a driver assigned first" });
  }

  booking.status = "on_the_way";
  await booking.save();

  res.status(200).json({
    message: "Confirmation sent to customer and driver, order is now on the way",
    booking
  });
});

exports.markDelivered = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  if (booking.status !== "on_the_way") {
    return res.status(409).json({ message: "Booking must be on the way before it can be delivered" });
  }

  booking.status = "delivered";
  booking.completedAt = new Date();
  await booking.save();

  res.status(200).json({ message: "Booking marked as delivered", booking });
});

exports.getDashboardStats = asyncHandler(async (req, res) => {
  const counts = await Booking.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  const stats = VALID_STATUSES.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {});

  counts.forEach(({ _id, count }) => {
    stats[_id] = count;
  });

  const total = await Booking.countDocuments();

  res.status(200).json({ total, byStatus: stats });
});
