const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." }
});

// Phone-based OTP requests use the always-valid static test code, so there is
// no real delivery cost to rate-limit against. Only email-based OTP requests
// (which send a real email) are throttled, keyed by the email address itself
// so it can't be bypassed by switching IPs.
const OTP_EMAIL_REQUEST_MAX = 5;

const otpEmailRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: OTP_EMAIL_REQUEST_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !!req.body?.phone,
  keyGenerator: (req) => (req.body?.email || req.ip).toLowerCase(),
  message: { message: "Too many OTP requests for this email. Please try again in 15 minutes." }
});

const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again later." }
});

// Returns a warning string once the caller is down to their last couple of
// allowed email-OTP requests, so the UI can tell them before they get blocked.
// req.rateLimit is only populated when otpEmailRequestLimiter actually ran
// (i.e. an email-based request), so phone-based requests never get a warning.
function getOtpRequestWarning(req) {
  const info = req.rateLimit;
  if (!info || info.remaining > 1) return null;

  return info.remaining === 1
    ? "You have 1 OTP request left before you're temporarily blocked for 15 minutes."
    : "This was your last OTP request. Further requests are blocked for 15 minutes.";
}

module.exports = { loginLimiter, otpEmailRequestLimiter, otpVerifyLimiter, OTP_EMAIL_REQUEST_MAX, getOtpRequestWarning };
