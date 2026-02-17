# Architecture

## Overview

**Bakwas (StayEase)** is a MERN-stack property booking platform. Guests can browse and book properties, hosts can publish listings, and admins can manage the platform. The app implements OTP-based registration, CAPTCHA-protected login, JWT authentication with refresh token rotation, and role-based access control.

## Tech Stack

| Layer      | Technology                              |
| ---------- | --------------------------------------- |
| Frontend   | React 18, React Router 6, Axios, Vite  |
| Backend    | Express 4, Node.js (ES Modules)        |
| Database   | MongoDB via Mongoose 8                 |
| Auth       | JWT (access + refresh tokens), bcryptjs |
| Email      | Nodemailer (SMTP)                      |
| Deployment | Vercel (serverless) / Render (web service) |

## Project Structure

```
bakwas/
├── client/                  # React SPA (Vite)
│   ├── src/
│   │   ├── auth/            # AuthProvider context + ProtectedRoute
│   │   ├── components/      # Reusable UI (CaptchaField, StatCard)
│   │   ├── pages/           # Route-level pages
│   │   ├── services/        # API service functions (dashboard)
│   │   ├── api.js           # Axios instance + token management
│   │   ├── App.jsx          # Route definitions
│   │   ├── Layout.jsx       # Shell (header, nav, footer)
│   │   └── main.jsx         # Entry point
│   └── vite.config.js       # Dev server + API proxy config
│
├── server/                  # Express API
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── PendingSignup.js
│   │   ├── Property.js
│   │   ├── Booking.js
│   │   └── Payment.js
│   ├── middleware/
│   │   └── auth.js          # requireAuth + requireRole middleware
│   ├── utils/
│   │   ├── auth.js          # Password hashing, JWT sign/verify
│   │   ├── captcha.js       # SVG CAPTCHA generation + verification
│   │   └── mailer.js        # OTP email delivery via Nodemailer
│   ├── app.js               # Express app, routes, CORS, DB init
│   ├── data.js              # In-memory seed/dummy data
│   ├── db.js                # Mongoose connection helper
│   └── index.js             # Server entry point (listen)
│
├── api/
│   └── [...all].js          # Vercel serverless catch-all → Express app
│
├── package.json             # Monorepo root (npm workspaces)
├── vercel.json              # Vercel deployment config
└── render.yaml              # Render deployment config
```

## Monorepo Setup

The root `package.json` uses **npm workspaces** with two packages: `client` and `server`. Key scripts:

- `npm run dev:client` — starts Vite dev server on port 5173
- `npm run dev:server` — starts Express via nodemon on port 5000
- `npm run build` — builds the React client to `client/dist`
- `npm start` — runs the production Express server

In development, the Vite dev server proxies `/api` requests to `http://localhost:5000`.

## Authentication Flow

### Registration (OTP-based)

1. Client sends `POST /api/auth/register/request-otp` with name, email, phone, password, role, and terms acceptance.
2. Server validates input, hashes the password, generates a 6-digit OTP, and stores everything in a `PendingSignup` document (TTL: 10 minutes).
3. OTP is sent via email (or logged to console in dev mode if SMTP is not configured).
4. Client sends `POST /api/auth/register/verify-otp` with email and OTP.
5. Server verifies the OTP hash, creates the `User` document, issues JWT access + refresh tokens, and sets the refresh token as an httpOnly cookie.

### Login (CAPTCHA-protected)

1. Client fetches a CAPTCHA SVG from `GET /api/captcha?purpose=login`.
2. User enters credentials + CAPTCHA solution.
3. `POST /api/auth/login` verifies CAPTCHA, then validates email/password.
4. On success, access token is returned in the response body and refresh token is set as an httpOnly cookie.

### Token Refresh

- `POST /api/auth/refresh` reads the refresh token cookie, validates it against the stored hash, then issues a new access + refresh token pair (rotation).
- The client-side `AuthProvider` attempts `/auth/me` on load; if that fails, it falls back to `/auth/refresh`.

### Password Reset

1. `POST /api/auth/forgot-password` generates a reset token (random 32 bytes), stores its hash on the user document with a 1-hour expiry.
2. `POST /api/auth/reset-password` accepts the token and new password, verifies the hash, and updates the password.

## Authorization

- **`requireAuth` middleware** — extracts and verifies the JWT from the `Authorization: Bearer <token>` header. Attaches `req.user` with `id`, `role`, and `email`.
- **`requireRole(roles)` middleware** — checks `req.user.role` against the allowed roles array. Returns 403 if unauthorized.

### Roles

| Role    | Access                                              |
| ------- | --------------------------------------------------- |
| `guest` | Browse properties, make bookings, manage profile    |
| `host`  | All guest access + host dashboard, publish listings |
| `admin` | Full access including admin dashboard, user management, approvals |

## CAPTCHA System

A custom server-side CAPTCHA generates a 6-character string (guaranteed to contain lowercase, uppercase, digit, and special character). The text is rendered into an SVG with noise lines. CAPTCHAs are stored in an in-memory `Map` with a 5-minute TTL and are single-use. CAPTCHA is required for:

- Login
- Booking creation
- Listing publication

## Data Layer

### Mongoose Models

| Model           | Purpose                                           |
| --------------- | ------------------------------------------------- |
| `User`          | Registered users with hashed password and tokens  |
| `PendingSignup` | Temporary OTP-verified registration staging       |
| `Property`      | Accommodation listings with location and pricing  |
| `Booking`       | Reservations linking guests to properties          |
| `Payment`       | Payment records tied to bookings                  |

### Dummy Data

`server/data.js` exports in-memory arrays (`users`, `properties`, `bookings`, `payments`, `reviews`, `stats`, etc.) used by non-auth API routes. These serve as placeholder data for the frontend while the real database-backed endpoints are for authentication only.

## Client Architecture

### Routing

React Router 6 with a `Layout` wrapper that provides the header/nav/footer shell. Routes:

| Path              | Component        | Protection          |
| ----------------- | ---------------- | ------------------- |
| `/`               | HomePage         | Public              |
| `/login`          | Login            | Public              |
| `/register`       | Register         | Public              |
| `/forgot-password`| ForgotPassword   | Public              |
| `/reset-password` | ResetPassword    | Public              |
| `/profile`        | Profile          | Authenticated       |
| `/host`           | HostDashboard    | Host or Admin       |
| `/admin`          | AdminDashboard   | Admin only          |
| `/become-host`    | BecomeHost       | Host or Admin       |

### State Management

- **AuthProvider** (React Context) — manages user session, token storage (`localStorage` for access token, httpOnly cookie for refresh token), and exposes auth actions (`login`, `logout`, `requestRegisterOtp`, `verifyRegisterOtp`, `forgotPassword`, `resetPassword`, `changePassword`, `updateProfile`).
- **ProtectedRoute** — wrapper component that redirects to `/login` if unauthenticated, or to `/` if the user's role is insufficient.

### API Client

`client/src/api.js` creates a shared Axios instance with `withCredentials: true` (for cookies) and a configurable base URL (`VITE_API_BASE_URL`, defaults to `/api`). The access token is attached via the `Authorization` header.

## Deployment

### Vercel (Serverless)

- `api/[...all].js` acts as a catch-all serverless function that delegates to the Express app.
- `vercel.json` configures the build to output `client/dist` as static files, with a filesystem-first routing fallback to `index.html` for SPA routing.

### Render

- `render.yaml` defines a single web service that runs `npm install && npm run build` and starts with `npm start`.

## Environment Variables

All configuration is driven by environment variables (loaded via `dotenv` from the repo root):

- **Database**: `MONGODB_URI`, `MONGODB_DB`
- **JWT**: `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `ACCESS_TOKEN_EXPIRES`, `REFRESH_TOKEN_EXPIRES`
- **CORS/Cookies**: `CLIENT_ORIGINS`, `COOKIE_SAME_SITE`, `COOKIE_SECURE`
- **Admin Seed**: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_PHONE`
- **Email (SMTP)**: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- **Client**: `VITE_API_BASE_URL`, `NODE_ENV`
