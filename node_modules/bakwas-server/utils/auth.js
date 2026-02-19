import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

function getAccessSecret() {
  return process.env.ACCESS_TOKEN_SECRET || "dev-access-secret";
}

function getRefreshSecret() {
  return process.env.REFRESH_TOKEN_SECRET || "dev-refresh-secret";
}

function getAccessExpires() {
  return process.env.ACCESS_TOKEN_EXPIRES || "15m";
}

function getRefreshExpires() {
  return process.env.REFRESH_TOKEN_EXPIRES || "7d";
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, email: user.email },
    getAccessSecret(),
    { expiresIn: getAccessExpires() }
  );
}

export function signRefreshToken(user) {
  return jwt.sign({ sub: user._id.toString(), type: "refresh" }, getRefreshSecret(), {
    expiresIn: getRefreshExpires()
  });
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, getRefreshSecret());
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}
