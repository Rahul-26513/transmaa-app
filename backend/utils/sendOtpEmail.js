const crypto = require("crypto");
const nodemailer = require("nodemailer");

let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  cachedTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    },
    // Some hosts block outbound SMTP entirely, which otherwise hangs the
    // connection forever instead of failing fast. Cap each phase so a
    // blocked network degrades to "email not delivered" quickly.
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000
  });

  return cachedTransporter;
}

const PORTAL_COPY = {
  customer: {
    portalName: "Customer Portal",
    intro: "Use this code to log in and continue booking trucks, tracking loads, or browsing the vehicle marketplace."
  },
  driver: {
    portalName: "Driver Portal",
    intro: "Use this code to log in and start browsing available loads on your route."
  }
};

function getCopy(role) {
  return PORTAL_COPY[role] || { portalName: "Account", intro: "Use this code to log in to your Transmaa account." };
}

// A stable Message-ID per (recipient, role), reused as References/In-Reply-To
// on every OTP email sent to that person. Combined with a fixed subject line
// (the OTP itself is not in the subject), this keeps repeated OTP requests in
// a single Gmail thread instead of spawning a new thread every time.
function getThreadAnchor(toEmail, role) {
  const hash = crypto.createHash("sha1").update(`${role || "account"}:${toEmail.toLowerCase()}`).digest("hex");
  return `<otp-${hash}@transmaa.app>`;
}

async function sendOtpEmail(toEmail, otp, context = {}) {
  const { role, name } = context;
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!toEmail) {
    console.log(`[DEV] OTP ${otp} (no email on file to send to)`);
    return { delivered: false, reason: "no-email" };
  }

  if (!gmailUser || !gmailPass) {
    console.log(`[DEV] OTP for ${toEmail}: ${otp} (GMAIL_USER/GMAIL_APP_PASSWORD not set, email not actually sent)`);
    return { delivered: false, reason: "no-api-key" };
  }

  const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || 5;
  const { portalName, intro } = getCopy(role);
  const greetingName = name ? name.split(" ")[0] : "there";
  const threadAnchor = getThreadAnchor(toEmail, role);

  const sendWithTimeout = (mailOptions, timeoutMs = 9000) =>
    Promise.race([
      getTransporter().sendMail(mailOptions),
      new Promise((_, reject) => setTimeout(() => reject(new Error("SMTP send timed out")), timeoutMs))
    ]);

  try {
    await sendWithTimeout({
      from: `Transmaa Logistics (No-Reply) <${gmailUser}>`,
      to: toEmail,
      subject: `Your Transmaa ${portalName} verification code`,
      references: threadAnchor,
      inReplyTo: threadAnchor,
      text: `Hi ${greetingName},\n\nYour Transmaa ${portalName} verification code is ${otp}.\n\n${intro}\n\nThis code expires in ${expiryMinutes} minutes. If you didn't request this, you can ignore this email.\n\nThis is an automated message. Please do not reply to this email.\n\n- Transmaa Logistics`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #0F172A;">
          <p>Hi ${greetingName},</p>
          <p>Your Transmaa <strong>${portalName}</strong> verification code is:</p>
          <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #F97316; margin: 16px 0;">${otp}</p>
          <p style="color: #334155; font-size: 14px;">${intro}</p>
          <p>This code expires in ${expiryMinutes} minutes.</p>
          <p style="color: #64748B; font-size: 13px;">If you didn't request this code, you can safely ignore this email.</p>
          <p style="color: #94A3B8; font-size: 12px; margin-top: 24px;">This is an automated message. Please do not reply to this email.<br>Transmaa Logistics</p>
        </div>
      `
    });

    return { delivered: true };
  } catch (err) {
    console.error(`[OTP EMAIL] Failed to send to ${toEmail}: ${err.message}`);
    console.log(`[DEV FALLBACK] OTP for ${toEmail}: ${otp}`);
    return { delivered: false, reason: "send-failed" };
  }
}

module.exports = sendOtpEmail;
