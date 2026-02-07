import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import {
  users,
  amenities,
  properties,
  bookings,
  payments,
  reviews,
  stats,
  hostOverview,
  adminOverview,
  approvals
} from "./data.js";
import { connectDatabase } from "./db.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

connectDatabase()
  .then((connection) => {
    console.log(`MongoDB connected: ${connection.name}`);
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "bakwas-server", time: new Date().toISOString() });
});

app.post("/api/auth/register", (req, res) => {
  res.json({
    message: "Dummy register success",
    user: users[0],
    token: "dummy-jwt-token"
  });
});

app.post("/api/auth/login", (req, res) => {
  res.json({
    message: "Dummy login success",
    user: users[0],
    token: "dummy-jwt-token"
  });
});

app.get("/api/amenities", (req, res) => {
  res.json(amenities);
});

app.get("/api/properties", (req, res) => {
  res.json(properties);
});

app.get("/api/properties/:id", (req, res) => {
  const property = properties.find((item) => item.id === req.params.id);
  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }
  res.json(property);
});

app.get("/api/search", (req, res) => {
  const { location, guests, type } = req.query;
  const results = properties.filter((property) => {
    const matchesLocation = location
      ? property.location.city.toLowerCase().includes(String(location).toLowerCase())
      : true;
    const matchesGuests = guests ? property.maxGuests >= Number(guests) : true;
    const matchesType = type
      ? property.type.toLowerCase() === String(type).toLowerCase()
      : true;
    return matchesLocation && matchesGuests && matchesType;
  });

  res.json({
    criteria: { location, guests, type },
    results
  });
});

app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

app.post("/api/bookings", (req, res) => {
  res.json({
    message: "Dummy booking created",
    booking: bookings[0]
  });
});

app.get("/api/payments", (req, res) => {
  res.json(payments);
});

app.post("/api/payments", (req, res) => {
  res.json({
    message: "Dummy payment success",
    payment: payments[0]
  });
});

app.get("/api/reviews", (req, res) => {
  res.json(reviews);
});

app.post("/api/reviews", (req, res) => {
  res.json({
    message: "Dummy review submitted",
    review: reviews[0]
  });
});

app.get("/api/admin/stats", (req, res) => {
  res.json(stats);
});

app.get("/api/host/overview", (req, res) => {
  res.json(hostOverview);
});

app.get("/api/host/listings", (req, res) => {
  res.json(properties);
});

app.post("/api/host/listings", (req, res) => {
  const payload = req.body || {};
  const title = String(payload.title || "").trim();
  const city = String(payload.city || "").trim();
  const pricePerNight = Number(payload.pricePerNight);

  if (!title || !city || Number.isNaN(pricePerNight) || pricePerNight <= 0) {
    return res.status(400).json({ message: "Title, city, and price are required." });
  }

  const id = `p${Date.now()}`;
  const listing = {
    id,
    name: title,
    type: payload.propertyType || "Apartment",
    location: {
      city,
      state: payload.state || "",
      country: payload.country || ""
    },
    description: payload.description || "",
    amenities: Array.isArray(payload.amenities) ? payload.amenities : [],
    pricePerNight,
    maxGuests: Number(payload.maxGuests) || 1,
    rating: 0,
    hostId: "u2",
    images: Array.isArray(payload.images) && payload.images.length > 0
      ? payload.images
      : [
        `https://picsum.photos/seed/${id}-1/800/500`,
        `https://picsum.photos/seed/${id}-2/800/500`,
        `https://picsum.photos/seed/${id}-3/800/500`
      ],
    availability: {
      checkIn: "14:00",
      checkOut: "11:00",
      blackoutDates: []
    },
    status: "Under review",
    bookingsThisMonth: 0
  };

  properties.unshift(listing);
  return res.status(201).json({ message: "Listing submitted", listing });
});

app.get("/api/host/bookings", (req, res) => {
  res.json(bookings);
});

app.post("/api/host/ai-scan", (req, res) => {
  res.json({
    summary: {
      title: "Cozy 1BHK with balcony",
      description:
        "Bright room with queen bed, ensuite washroom, and a compact work desk. Natural light with balcony access.",
      propertyType: "Apartment",
      rooms: 1,
      washrooms: 1,
      maxGuests: 2
    },
    amenities: ["AC", "WiFi", "Hot Water", "Western Toilet", "Wardrobe", "Desk"],
    detectedEquipment: ["Ceiling fan", "TV", "Geyser", "Shower"],
    conflicts: [
      {
        field: "AC",
        message: "Photo 2 shows AC, photo 5 looks like a cooler. Please confirm."
      },
      {
        field: "Washroom",
        message: "Detected both Western toilet and squat toilet in different photos."
      }
    ],
    confidence: 0.83
  });
});

app.get("/api/admin/overview", (req, res) => {
  res.json(adminOverview);
});

app.get("/api/admin/approvals", (req, res) => {
  res.json(approvals);
});

app.get("/api/admin/users", (req, res) => {
  res.json(users);
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
