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
`npm start` runs Express and serves both API + frontend.

## Environment variables

Create `server/.env` using `.env.example` values:

- `MONGODB_URI`
- `MONGODB_DB` (optional)
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `ACCESS_TOKEN_EXPIRES` (optional)
- `REFRESH_TOKEN_EXPIRES` (optional)
- `CLIENT_ORIGIN` (optional for split deployment)
- `ADMIN_EMAIL` (optional)
- `ADMIN_PASSWORD` (optional)
- `ADMIN_PHONE` (optional)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` (for sending OTP emails)
- `NODE_ENV=development` for local, `production` for deployed env

If SMTP vars are missing, OTP is logged on server console in non-production mode.

## Deploy on Render (single web service)

1. Push repo to GitHub/GitLab.
2. In Render: `New +` -> `Web Service`.
3. Connect repo and branch.
4. Set:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variables from above.
6. Deploy.

Verify:
- `https://<your-service>.onrender.com/api/health`
- `https://<your-service>.onrender.com`

## Blueprint deploy

This repo includes `render.yaml`, so you can also deploy via Render Blueprint.
