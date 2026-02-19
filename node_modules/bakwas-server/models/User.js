import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["guest", "host", "admin"], default: "guest" },
    phone: { type: String, default: "" },
    refreshTokenHash: { type: String, default: "" },
    resetTokenHash: { type: String, default: "" },
    resetTokenExpiresAt: { type: Date }
  },
  { timestamps: true }
);

userSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    phone: this.phone
  };
};

const User = mongoose.model("User", userSchema);

export default User;
