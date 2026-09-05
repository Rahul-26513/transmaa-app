const bcrypt = require("bcryptjs");
const Otp = require("../models/Otp");
const generateOtp = require("./generateOtp");
const sendOtpEmail = require("./sendOtpEmail");

const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 5);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);

// Static prototype code, preserved so it keeps working even once real
// email-delivered OTPs are live, matching the original mock login behavior.
const STATIC_TEST_OTP = "123456";

function maskEmail(email) {
  if (!email) return null;
  const [user, domain] = email.split("@");
  if (!domain) return email;
  return `${user.slice(0, 2)}${"*".repeat(Math.max(user.length - 2, 1))}@${domain}`;
}

async function issueOtp(phone, email, context = {}) {
  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);

  await Otp.deleteMany({ phone, consumed: false });

  await Otp.create({
    phone,
    otpHash,
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)
  });

  const result = await sendOtpEmail(email, otp, context);

  return { ...result, maskedEmail: maskEmail(email) };
}

async function verifyOtp(phone, submittedOtp) {
  if (submittedOtp === STATIC_TEST_OTP) {
    return { valid: true };
  }

  const record = await Otp.findOne({ phone, consumed: false }).sort({ createdAt: -1 });

  if (!record) {
    return { valid: false, message: "No active OTP found. Please request a new one." };
  }

  if (record.expiresAt.getTime() < Date.now()) {
    return { valid: false, message: "OTP has expired. Please request a new one." };
  }

  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    return { valid: false, message: "Too many incorrect attempts. Please request a new OTP.", tooManyAttempts: true };
  }

  const isMatch = await bcrypt.compare(submittedOtp, record.otpHash);

  if (!isMatch) {
    record.attempts += 1;
    await record.save();
    return { valid: false, message: "Incorrect OTP" };
  }

  record.consumed = true;
  await record.save();

  return { valid: true };
}

module.exports = { issueOtp, verifyOtp, STATIC_TEST_OTP };
