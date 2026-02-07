import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
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
import User from "./models/User.js";
import {
  generateResetToken,
  hashPassword,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyPassword,
  verifyRefreshToken
} from "./utils/auth.js";
import { requireAuth, requireRole } from "./middleware/auth.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/api/auth"
};

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

connectDatabase()
  .then((connection) => {
    console.log(`MongoDB connected: ${connection.name}`);
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      User.findOne({ email: process.env.ADMIN_EMAIL.toLowerCase() })
        .then(async (existing) => {
          if (!existing) {
            const passwordHash = await hashPassword(process.env.ADMIN_PASSWORD);
            await User.create({
              name: "Admin",
              email: process.env.ADMIN_EMAIL.toLowerCase(),
              passwordHash,
              role: "admin"
            });
            console.log("Admin user seeded.");
          }
        })
        .catch(() => {});
    }
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "bakwas-server", time: new Date().toISOString() });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const normalizedEmail = String(email).toLowerCase();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    if (!emailOk) {
      return res.status(400).json({ message: "Enter a valid email." });
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash,
      role: role === "host" ? "host" : "guest"
    });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    res.cookie("refreshToken", refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.status(201).json({
      message: "Registration successful",
      accessToken,
      user: user.toPublic()
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const matches = await verifyPassword(password, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    res.cookie("refreshToken", refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.json({
      message: "Login successful",
      accessToken,
      user: user.toPublic()
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed." });
  }
});

app.post("/api/auth/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      try {
        const payload = verifyRefreshToken(refreshToken);
        const user = await User.findById(payload.sub);
        if (user) {
          user.refreshTokenHash = "";
          await user.save();
        }
      } catch (error) {
        // Ignore invalid refresh tokens on logout.
      }
    }
    res.clearCookie("refreshToken", COOKIE_OPTIONS);
    return res.json({ message: "Logged out." });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed." });
  }
});

app.post("/api/auth/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Missing refresh token." });
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub);
    if (!user || user.refreshTokenHash !== hashToken(refreshToken)) {
      return res.status(401).json({ message: "Invalid refresh token." });
    }

    const accessToken = signAccessToken(user);
    const nextRefreshToken = signRefreshToken(user);
    user.refreshTokenHash = hashToken(nextRefreshToken);
    await user.save();

    res.cookie("refreshToken", nextRefreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.json({ accessToken, user: user.toPublic() });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token." });
  }
});

app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body || {};
    const user = await User.findOne({ email: String(email || "").toLowerCase() });
    if (!user) {
      return res.json({ message: "If an account exists, a reset link has been sent." });
    }

    const resetToken = generateResetToken();
    user.resetTokenHash = hashToken(resetToken);
    user.resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    return res.json({
      message: "If an account exists, a reset link has been sent.",
      resetToken
    });
  } catch (error) {
    return res.status(500).json({ message: "Reset request failed." });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body || {};
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required." });
    }
    if (String(newPassword).length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const user = await User.findOne({
      resetTokenHash: hashToken(token),
      resetTokenExpiresAt: { $gt: new Date() }
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    user.passwordHash = await hashPassword(newPassword);
    user.resetTokenHash = "";
    user.resetTokenExpiresAt = null;
    await user.save();

    return res.json({ message: "Password reset successful." });
  } catch (error) {
    return res.status(500).json({ message: "Password reset failed." });
  }
});

app.post("/api/auth/change-password", requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required." });
    }
    if (String(newPassword).length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const matches = await verifyPassword(currentPassword, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    return res.json({ message: "Password updated." });
  } catch (error) {
    return res.status(500).json({ message: "Password update failed." });
  }
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  return res.json({ user: user.toPublic() });
});

app.put("/api/auth/me", requireAuth, async (req, res) => {
  try {
    const { name, phone } = req.body || {};
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (name) user.name = String(name).trim();
    if (phone !== undefined) user.phone = String(phone).trim();
    await user.save();
    return res.json({ message: "Profile updated.", user: user.toPublic() });
  } catch (error) {
    return res.status(500).json({ message: "Profile update failed." });
  }
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

app.get("/api/stats", (req, res) => {
  res.json(stats);
});

app.get("/api/admin/stats", requireAuth, requireRole(["admin"]), (req, res) => {
  res.json(stats);
});

app.get("/api/host/overview", requireAuth, requireRole(["host", "admin"]), (req, res) => {
  res.json(hostOverview);
});

app.get("/api/host/listings", requireAuth, requireRole(["host", "admin"]), (req, res) => {
  res.json(properties);
});

app.post("/api/host/listings", requireAuth, requireRole(["host", "admin"]), (req, res) => {
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

app.get("/api/host/bookings", requireAuth, requireRole(["host", "admin"]), (req, res) => {
  res.json(bookings);
});

app.post("/api/host/ai-scan", requireAuth, requireRole(["host", "admin"]), (req, res) => {
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

app.get("/api/admin/overview", requireAuth, requireRole(["admin"]), (req, res) => {
  res.json(adminOverview);
});

app.get("/api/admin/approvals", requireAuth, requireRole(["admin"]), (req, res) => {
  res.json(approvals);
});

app.get("/api/admin/users", requireAuth, requireRole(["admin"]), async (req, res) => {
  const dbUsers = await User.find().sort({ createdAt: -1 });
  if (!dbUsers.length) {
    return res.json(users);
  }
  return res.json(dbUsers.map((user) => user.toPublic()));
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
