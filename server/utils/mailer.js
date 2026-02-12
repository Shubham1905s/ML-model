import nodemailer from "nodemailer";

let transporterPromise;

async function getTransporter() {
  if (transporterPromise) return transporterPromise;

  transporterPromise = (async () => {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      return null;
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  })();

  return transporterPromise;
}

export async function sendOtpEmail({ to, otp }) {
  const transporter = await getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@stayease.app";

  if (!transporter) {
    console.log(`[OTP] ${to}: ${otp}`);
    return { delivered: false };
  }

  await transporter.sendMail({
    from,
    to,
    subject: "Your StayEase OTP Code",
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    html: `<p>Your OTP is <strong>${otp}</strong>.</p><p>This code expires in 10 minutes.</p>`
  });

  return { delivered: true };
}
