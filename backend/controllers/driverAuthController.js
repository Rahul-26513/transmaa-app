const User = require("../models/User");
const Driver = require("../models/Driver");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const { issueOtp, verifyOtp } = require("../utils/otpService");
const { getOtpRequestWarning } = require("../middleware/rateLimiter");

function publicDriver(user, driver) {
  return {
    id: user._id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    verificationStatus: driver.verificationStatus,
    status: driver.status,
    vehicleType: driver.vehicleType,
    vehicleModel: driver.vehicleModel,
    vehicleNumber: driver.vehicleNumber,
    rating: driver.rating,
    tripsCompleted: driver.tripsCompleted
  };
}

// ==========================================
// REGISTER (personal info + vehicle/experience data in one call)
// ==========================================

exports.register = asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    email,
    dob,
    gender,
    bio,
    photo,
    experienceYears,
    vehicleType,
    vehicleModel,
    vehicleNumber,
    dlNumber,
    panNumber
  } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: "Name and phone are required" });
  }

  const existingUser = await User.findOne({ phone });

  if (existingUser) {
    return res.status(409).json({ message: "An account with this phone number already exists" });
  }

  const user = await User.create({
    name,
    phone,
    email,
    role: "driver",
    status: "active"
  });

  const driver = await Driver.create({
    userId: user._id,
    name,
    phone,
    dob,
    gender,
    bio,
    photo,
    experienceYears,
    vehicleType,
    vehicleModel,
    vehicleNumber,
    dlNumber,
    panNumber,
    verificationStatus: "pending"
  });

  res.status(201).json({
    message: "Registration submitted. Background verification is in progress.",
    driver: publicDriver(user, driver)
  });
});

// ==========================================
// REQUEST LOGIN OTP
// ==========================================

exports.requestOtp = asyncHandler(async (req, res) => {
  const { phone, email } = req.body;

  if (!phone && !email) {
    return res.status(400).json({ message: "Phone number or email is required" });
  }

  const user = await User.findOne(phone ? { phone, role: "driver" } : { email, role: "driver" });

  if (!user) {
    return res.status(404).json({ message: "This account is not registered. Please register." });
  }

  if (email && !user.email) {
    return res.status(404).json({ message: "This account is not registered. Please register." });
  }

  const result = await issueOtp(phone || email, user.email, { role: "driver", name: user.name });

  res.status(200).json({
    message: "OTP sent to your registered email",
    emailDelivered: result.delivered,
    maskedEmail: result.maskedEmail,
    warning: getOtpRequestWarning(req)
  });
});

// ==========================================
// VERIFY OTP AND LOG IN
// ==========================================

exports.verifyLoginOtp = asyncHandler(async (req, res) => {
  const { phone, email, otp } = req.body;

  if ((!phone && !email) || !otp) {
    return res.status(400).json({ message: "Phone or email, and OTP are required" });
  }

  const user = await User.findOne(phone ? { phone, role: "driver" } : { email, role: "driver" });

  if (!user) {
    return res.status(404).json({ message: "This account is not registered. Please register." });
  }

  const result = await verifyOtp(phone || email, otp);

  if (!result.valid) {
    return res.status(result.tooManyAttempts ? 429 : 401).json({ message: result.message });
  }

  const driver = await Driver.findOne({ userId: user._id });

  if (!driver) {
    return res.status(404).json({ message: "Driver profile not found" });
  }

  if (driver.verificationStatus === "pending") {
    return res.status(202).json({ message: "Your verification is in progress" });
  }

  if (driver.verificationStatus === "rejected") {
    return res.status(403).json({ message: "This number got rejected" });
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = generateToken(user);

  res.status(200).json({
    message: "Login successful",
    token,
    driver: publicDriver(user, driver)
  });
});

// ==========================================
// CURRENT DRIVER PROFILE
// ==========================================

exports.getMe = asyncHandler(async (req, res) => {
  const driver = await Driver.findOne({ userId: req.user._id });

  if (!driver) {
    return res.status(404).json({ message: "Driver profile not found" });
  }

  res.status(200).json({ driver: publicDriver(req.user, driver) });
});
