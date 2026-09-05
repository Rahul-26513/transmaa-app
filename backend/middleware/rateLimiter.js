const rateLimit = require("express-rate-limit");

// Phone numbers that always use the static prototype OTP (123456) instead of a
// real emailed code. These are exempted from the OTP-request throttle below,
// since re-sending a static code carries no SMS/email cost or abuse risk.
// Configurable via env so it's easy to add/remove demo numbers without a code change.
const STATIC_OTP_PHONES = new Set(
  (process.env.STATIC_OTP_PHONES || "9999999999,7093124579,9848011223,9849567123")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." }
});

const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  // Previously this limiter was keyed only by IP, so anyone testing behind the
  // same network (QA, demo, shared office wifi) shared one bucket of 5 requests
  // and locked each other out. Key by phone number instead, so each account
  // gets its own budget.
  keyGenerator: (req) => req.body?.phone || req.ip,
  // Numbers using the static prototype OTP don't need throttling on the
  // request side — skip the limiter for them entirely.
  skip: (req) => STATIC_OTP_PHONES.has(req.body?.phone),
  message: { message: "Too many OTP requests. Please try again later." }
});

const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again later." }
});

module.exports = { loginLimiter, otpRequestLimiter, otpVerifyLimiter };
