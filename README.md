# Bakwas

MERN-style booking app with:
- React + Vite client (`client`)
- Express + MongoDB server (`server`)

Implemented flows:
- OTP-based account creation (email OTP)
- Login with 6-character mixed CAPTCHA
- Role-based access (`host`, `guest`, `admin`)
- Host listing publish with CAPTCHA + terms acceptance
- Guest booking with CAPTCHA + terms acceptance
- Booking payment options: Onsite Payment, Net Banking, UPI

## Local setup

```bash
npm install
npm run dev:server
npm run dev:client
```

Client runs at `http://localhost:5173` and proxies API calls to `http://localhost:5000`.

## Production build

```bash
npm run build
npm start
```

`npm run build` creates `client/dist`.  
`npm start` runs local Express API on `http://localhost:5000`.

## Environment variables

Create `.env` in repo root using `.env.example` values:

- `MONGODB_URI`
- `MONGODB_DB` (optional)
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `ACCESS_TOKEN_EXPIRES` (optional)
- `REFRESH_TOKEN_EXPIRES` (optional)
- `CLIENT_ORIGINS` (comma-separated allowed origins, optional)
- `COOKIE_SAME_SITE` (`lax` for same-origin, `none` for split domains)
- `COOKIE_SECURE` (`true` in production when `sameSite=none`)
- `ADMIN_EMAIL` (optional)
- `ADMIN_PASSWORD` (optional)
- `ADMIN_PHONE` (optional)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` (for sending OTP emails)
- `VITE_API_BASE_URL` (`/api` when frontend and backend are same domain)
- `NODE_ENV=development` for local, `production` for deployed env

If SMTP vars are missing, OTP is logged on server console in non-production mode.

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import project in Vercel.
3. Keep root as project directory (uses `vercel.json`).
4. Add environment variables from `.env.example`.
5. Deploy.

Verify:
- `https://<your-project>.vercel.app/api/health`
- `https://<your-project>.vercel.app`
