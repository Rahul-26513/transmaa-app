const crypto = require("crypto");
const { google } = require("googleapis");

let cachedOAuth2Client = null;

// Render (and most free-tier PaaS hosts) block outbound SMTP entirely, so a
// classic SMTP transporter hangs forever. Sending through the Gmail REST API
// instead goes over plain HTTPS, which is never blocked, while still sending
// as the same Gmail account.
function getOAuth2Client() {
  if (cachedOAuth2Client) return cachedOAuth2Client;

  cachedOAuth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET
  );
  cachedOAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

  return cachedOAuth2Client;
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

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function buildRawMessage({ from, to, subject, references, inReplyTo, text, html }) {
  const boundary = `boundary_${crypto.randomBytes(12).toString("hex")}`;

  const headers = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    `References: ${references}`,
    `In-Reply-To: ${inReplyTo}`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`
  ];

  const body = [
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    text,
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "",
    html,
    `--${boundary}--`
  ];

  return base64UrlEncode([...headers, ...body].join("\r\n"));
}

async function sendOtpEmail(toEmail, otp, context = {}) {
  const { role, name } = context;
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  const gmailUser = process.env.GMAIL_USER;

  if (!toEmail) {
    console.log(`[DEV] OTP ${otp} (no email on file to send to)`);
    return { delivered: false, reason: "no-email" };
  }

  if (!clientId || !clientSecret || !refreshToken || !gmailUser) {
    console.log(`[DEV] OTP for ${toEmail}: ${otp} (Gmail API credentials not set, email not actually sent)`);
    return { delivered: false, reason: "no-api-key" };
  }

  const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || 5;
  const { portalName, intro } = getCopy(role);
  const greetingName = name ? name.split(" ")[0] : "there";
  const threadAnchor = getThreadAnchor(toEmail, role);

  const raw = buildRawMessage({
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

  const sendWithTimeout = (timeoutMs = 10000) =>
    Promise.race([
      google.gmail({ version: "v1", auth: getOAuth2Client() }).users.messages.send({
        userId: "me",
        requestBody: { raw }
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Gmail API send timed out")), timeoutMs))
    ]);

  try {
    await sendWithTimeout();
    return { delivered: true };
  } catch (err) {
    console.error(`[OTP EMAIL] Failed to send to ${toEmail}: ${err.message}`);
    console.log(`[DEV FALLBACK] OTP for ${toEmail}: ${otp}`);
    return { delivered: false, reason: "send-failed" };
  }
}

module.exports = sendOtpEmail;
