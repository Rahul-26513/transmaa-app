const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const { issueOtp, verifyOtp } = require("../utils/otpService");

function publicCustomer(user) {
  return {
    id: user._id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

// ==========================================
// REGISTER (no OTP at registration, matching the original spec)
// ==========================================

exports.register = asyncHandler(async (req, res) => {
  const { name, phone, email } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ message: "Name, phone and email are required" });
  }

  const existing = await User.findOne({ phone });

  if (existing) {
    return res.status(409).json({ message: "An account with this phone number already exists" });
  }

  const customer = await User.create({
    name,
    phone,
    email,
    role: "customer",
    status: "active"
  });

  const token = generateToken(customer);

  res.status(201).json({
    message: "Customer registered successfully",
    token,
    customer: publicCustomer(customer)
  });
});

// ==========================================
// REQUEST LOGIN OTP (emailed; static test code also always works)
// ==========================================

exports.requestOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  const customer = await User.findOne({ phone, role: "customer" });

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  const result = await issueOtp(phone, customer.email);

  res.status(200).json({
    message: "OTP sent to your registered email",
    emailDelivered: result.delivered,
    maskedEmail: result.maskedEmail
  });
});

// ==========================================
// VERIFY OTP AND LOG IN
// ==========================================

exports.verifyLoginOtp = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone and OTP are required" });
  }

  const customer = await User.findOne({ phone, role: "customer" });

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  const result = await verifyOtp(phone, otp);

  if (!result.valid) {
    return res.status(result.tooManyAttempts ? 429 : 401).json({ message: result.message });
  }

  customer.lastLoginAt = new Date();
  await customer.save();

  const token = generateToken(customer);

  res.status(200).json({
    message: "Login successful",
    token,
    customer: publicCustomer(customer)
  });
});

// ==========================================
// CURRENT CUSTOMER PROFILE
// ==========================================

exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ customer: publicCustomer(req.user) });
});

// ==========================================
// UPDATE PROFILE
// ==========================================

exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  req.user.name = name;
  if (email !== undefined) req.user.email = email;
  await req.user.save();

  res.status(200).json({
    message: "Profile updated successfully",
    customer: publicCustomer(req.user)
  });
});
