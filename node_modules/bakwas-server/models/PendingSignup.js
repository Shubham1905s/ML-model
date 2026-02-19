import mongoose from "mongoose";

const pendingSignupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    phone: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["guest", "host"], default: "guest" },
    otpHash: { type: String, required: true },
    otpExpiresAt: { type: Date, required: true },
    otpVerified: { type: Boolean, default: false },
    termsAccepted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const PendingSignup = mongoose.model("PendingSignup", pendingSignupSchema);

export default PendingSignup;
