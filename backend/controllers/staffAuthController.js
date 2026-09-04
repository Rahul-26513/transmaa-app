const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");

function publicStaff(user) {
  return {
    id: user._id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    role: user.role,
    status: user.status,
    employeeId: user.employeeId,
    department: user.department,
    lastLoginAt: user.lastLoginAt
  };
}

// ==========================================
// BOOTSTRAP THE FIRST ADMIN ACCOUNT
// Only works while no staff/admin account exists yet, so the
// bootstrap key can't be reused as a standing backdoor afterwards.
// ==========================================

exports.bootstrapAdmin = asyncHandler(async (req, res) => {
  const providedKey = req.headers["x-setup-key"];

  if (!providedKey || providedKey !== process.env.STAFF_BOOTSTRAP_KEY) {
    return res.status(403).json({ message: "Invalid setup key" });
  }

  const existingStaffCount = await User.countDocuments({
    role: { $in: ["staff", "admin"] }
  });

  if (existingStaffCount > 0) {
    return res.status(409).json({
      message: "Setup already completed. Ask an existing admin to create new staff accounts."
    });
  }

  const { name, phone, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await User.create({
    name,
    phone,
    password: hashedPassword,
    role: "admin",
    status: "active"
  });

  const token = generateToken(admin);

  res.status(201).json({
    message: "Admin account created successfully",
    token,
    staff: publicStaff(admin)
  });
});

// ==========================================
// STAFF/ADMIN LOGIN
// ==========================================

exports.login = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  const staff = await User.findOne({
    phone,
    role: { $in: ["staff", "admin"] }
  }).select("+password");

  if (!staff) {
    return res.status(404).json({ message: "Staff account not found" });
  }

  if (staff.status !== "active") {
    return res.status(403).json({ message: "This staff account is not active" });
  }

  const passwordMatches = await bcrypt.compare(password, staff.password);

  if (!passwordMatches) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  staff.lastLoginAt = new Date();
  await staff.save();

  const token = generateToken(staff);

  res.status(200).json({
    message: "Login successful",
    token,
    staff: publicStaff(staff)
  });
});

// ==========================================
// ONBOARD A NEW STAFF ACCOUNT
// Requires an existing logged-in staff/admin.
// ==========================================

exports.registerStaff = asyncHandler(async (req, res) => {
  const { name, phone, password, role, employeeId, department, email } = req.body;

  if (role === "admin" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only an admin can create another admin" });
  }

  const existing = await User.findOne({ phone });

  if (existing) {
    return res.status(409).json({ message: "An account with this phone number already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const staff = await User.create({
    name,
    phone,
    email,
    password: hashedPassword,
    role: role === "admin" ? "admin" : "staff",
    employeeId,
    department,
    status: "active"
  });

  res.status(201).json({
    message: "Staff account created successfully",
    staff: publicStaff(staff)
  });
});

// ==========================================
// CURRENT STAFF PROFILE
// ==========================================

exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ staff: publicStaff(req.user) });
});

// ==========================================
// CHANGE PASSWORD
// ==========================================

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const staff = await User.findById(req.user._id).select("+password");

  const passwordMatches = await bcrypt.compare(currentPassword, staff.password);

  if (!passwordMatches) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  staff.password = await bcrypt.hash(newPassword, 10);
  await staff.save();

  res.status(200).json({ message: "Password updated successfully" });
});

// ==========================================
// LIST STAFF ACCOUNTS (admin only)
// ==========================================

exports.listStaff = asyncHandler(async (req, res) => {
  const staff = await User.find({ role: { $in: ["staff", "admin"] } }).sort({ createdAt: -1 });

  res.status(200).json({
    count: staff.length,
    staff: staff.map(publicStaff)
  });
});

// ==========================================
// DEACTIVATE / REACTIVATE A STAFF ACCOUNT (admin only)
// ==========================================

exports.setStaffStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["active", "inactive"].includes(status)) {
    return res.status(400).json({ message: "Status must be active or inactive" });
  }

  if (req.params.id === String(req.user._id)) {
    return res.status(400).json({ message: "You cannot change your own account status" });
  }

  const staff = await User.findOneAndUpdate(
    { _id: req.params.id, role: { $in: ["staff", "admin"] } },
    { status },
    { new: true }
  );

  if (!staff) {
    return res.status(404).json({ message: "Staff account not found" });
  }

  res.status(200).json({
    message: `Staff account ${status === "active" ? "reactivated" : "deactivated"}`,
    staff: publicStaff(staff)
  });
});
