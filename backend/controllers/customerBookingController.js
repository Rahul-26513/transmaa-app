const Booking = require("../models/Booking");
const Driver = require("../models/Driver");
const asyncHandler = require("../utils/asyncHandler");

exports.createBooking = asyncHandler(async (req, res) => {
  const {
    fromLocation,
    toLocation,
    shiftingDate,
    shiftingTime,
    goodsType,
    truckType,
    truckCapacity,
    loadWeight,
    description,
    specialInstructions,
    distanceKm,
    customerExpectedCost
  } = req.body;

  if (!fromLocation || !toLocation) {
    return res.status(400).json({ message: "From and to locations are required" });
  }

  const booking = await Booking.create({
    customerId: req.user._id,
    customerName: req.user.name,
    customerPhone: req.user.phone,
    fromLocation,
    toLocation,
    shiftingDate,
    shiftingTime,
    goodsType,
    truckType,
    truckCapacity,
    loadWeight,
    description,
    specialInstructions,
    distanceKm,
    customerExpectedCost
  });

  res.status(201).json({ message: "Booking created successfully", booking });
});

exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ customerId: req.user._id }).sort({ createdAt: -1 });

  const driverIds = bookings.filter((b) => b.driverId).map((b) => b.driverId);
  const drivers = driverIds.length
    ? await Driver.find({ _id: { $in: driverIds } })
    : [];
  const driverById = new Map(drivers.map((d) => [String(d._id), d]));

  const enriched = bookings.map((b) => {
    const driver = b.driverId ? driverById.get(String(b.driverId)) : null;
    return {
      ...b.toObject(),
      driverRating: driver ? driver.rating : undefined
    };
  });

  res.status(200).json({ count: enriched.length, bookings: enriched });
});

exports.getMyBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, customerId: req.user._id });

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  res.status(200).json({ booking });
});
