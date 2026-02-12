import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    propertyId: { type: String, required: true },
    propertyName: { type: String, required: true, trim: true },
    guestId: { type: String, required: true },
    guestName: { type: String, required: true, trim: true },
    status: { type: String, default: "Pending" },
    checkInDate: { type: String, required: true },
    checkOutDate: { type: String, required: true },
    guests: { type: Number, required: true, min: 1 },
    pricing: {
      base: { type: Number, required: true },
      taxes: { type: Number, required: true },
      platformFee: { type: Number, required: true },
      total: { type: Number, required: true }
    },
    paymentMethod: {
      type: String,
      enum: ["Onsite Payment", "Net Banking", "UPI"],
      required: true
    },
    termsAccepted: { type: Boolean, required: true }
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
