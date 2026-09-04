async function sendOtpEmail(toEmail, otp) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!toEmail) {
    console.log(`[DEV] OTP ${otp} (no email on file to send to)`);
    return { delivered: false, reason: "no-email" };
  }

  if (!apiKey) {
    console.log(`[DEV] OTP for ${toEmail}: ${otp} (RESEND_API_KEY not set, email not actually sent)`);
    return { delivered: false, reason: "no-api-key" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: process.env.OTP_FROM_EMAIL || "Transmaa <onboarding@resend.dev>",
      to: [toEmail],
      subject: "Your Transmaa login OTP",
      html: `<p>Your Transmaa login OTP is <strong>${otp}</strong>.</p><p>It expires in ${process.env.OTP_EXPIRY_MINUTES || 5} minutes. Do not share this code with anyone.</p>`
    })
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error(`[OTP EMAIL] Failed to send to ${toEmail}: ${response.status} ${body}`);
    console.log(`[DEV FALLBACK] OTP for ${toEmail}: ${otp}`);
    return { delivered: false, reason: "send-failed" };
  }

  return { delivered: true };
}

module.exports = sendOtpEmail;
