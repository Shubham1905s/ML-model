import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true },
    method: {
      type: String,
      enum: ["Onsite Payment", "Net Banking", "UPI"],
      required: true
    },
    status: { type: String, required: true },
    amount: { type: Number, required: true },
    invoiceId: { type: String, required: true }
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
