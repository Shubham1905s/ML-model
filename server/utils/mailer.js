import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

let transporterPromise;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OTP_TOP_IMAGE = path.resolve(__dirname, "../../client/dist/assets/Top.png");
const OTP_BOTTOM_IMAGE = path.resolve(__dirname, "../../client/dist/assets/bottom.png");

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

  const attachments = [];
  const topCid = "stayease-otp-top";
  const bottomCid = "stayease-otp-bottom";

  if (fs.existsSync(OTP_TOP_IMAGE)) {
    attachments.push({
      filename: "Top.png",
      path: OTP_TOP_IMAGE,
      cid: topCid
    });
  }

  if (fs.existsSync(OTP_BOTTOM_IMAGE)) {
    attachments.push({
      filename: "bottom.png",
      path: OTP_BOTTOM_IMAGE,
      cid: bottomCid
    });
  }

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #111827; line-height: 1.6;">
      ${
        attachments.find((item) => item.cid === topCid)
          ? `<img src="cid:${topCid}" alt="StayEase" style="display:block; width:100%; max-width:640px; margin:0 auto 16px;" />`
          : ""
      }
      <div style="max-width: 640px; margin: 0 auto; padding: 0 16px;">
        <p style="margin: 0 0 12px; font-size: 16px;">Welcome to StayEase!</p>
        <p style="margin: 0 0 12px; font-size: 18px; font-weight: 700;">OTP: ${otp}</p>
        <p style="margin: 0 0 12px; font-size: 16px;">Your One-Time Password (OTP) is: <strong>${otp}</strong></p>
        <p style="margin: 0 0 12px; font-size: 16px;">This OTP is valid for 10 minutes.</p>
        <p style="margin: 0 0 12px; font-size: 16px;">
          Please enter the OTP in the verification section to complete your registration.
        </p>
        <p style="margin: 0 0 12px; font-size: 16px;">
          If you did not request this, please ignore this message.
        </p>
        <p style="margin: 0 0 12px; font-size: 16px;">Thank you for choosing StayEase!</p>
      </div>
      ${
        attachments.find((item) => item.cid === bottomCid)
          ? `<img src="cid:${bottomCid}" alt="" style="display:block; width:100%; max-width:640px; margin:16px auto 0;" />`
          : ""
      }
    </div>
  `;

  await transporter.sendMail({
    from,
    to,
    subject: "Your StayEase OTP Code",
    text:
      `Welcome to StayEase!\n` +
      `OTP: ${otp}\n\n` +
      `Your One-Time Password (OTP) is: ${otp}\n` +
      `This OTP is valid for 10 minutes.\n\n` +
      `Please enter the OTP in the verification section to complete your registration.\n\n` +
      `If you did not request this, please ignore this message.\n\n` +
      `Thank you for choosing StayEase!`,
    html,
    attachments
  });

  return { delivered: true };
}
