import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    hostId: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    location: {
      city: { type: String, required: true, trim: true },
      state: { type: String, default: "", trim: true },
      country: { type: String, default: "", trim: true }
    },
    amenities: { type: [String], default: [] },
    pricePerNight: { type: Number, required: true, min: 1 },
    maxGuests: { type: Number, default: 1, min: 1 },
    rating: { type: Number, default: 0 },
    images: { type: [String], default: [] },
    availability: {
      checkIn: { type: String, default: "14:00" },
      checkOut: { type: String, default: "11:00" },
      blackoutDates: { type: [String], default: [] }
    },
    status: { type: String, default: "Under review" },
    bookingsThisMonth: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;
