<<<<<<< HEAD
#  MERN Room Booking
=======
# Bakwas
>>>>>>> c719ce9 (bug number 1)

MERN-style room booking app with:
- React + Vite client (`client`)
- Express + MongoDB server (`server`)

## Local setup

```bash
npm install
npm run dev:server
npm run dev:client
```

App runs at `http://localhost:5173` and proxies API calls to `http://localhost:5000`.

## Production build

```bash
npm run build
npm start
```

`npm run build` builds the React app into `client/dist`.  
`npm start` runs the Express server, which also serves `client/dist` (single-service deploy).

## Required environment variables

Create a `.env` (or use your host dashboard env settings) with:

- `MONGODB_URI` (required in production)
- `MONGODB_DB` (optional, default: `stayease`)
- `ACCESS_TOKEN_SECRET` (required)
- `REFRESH_TOKEN_SECRET` (required)
- `ACCESS_TOKEN_EXPIRES` (optional, default used by app)
- `REFRESH_TOKEN_EXPIRES` (optional, default used by app)
- `CLIENT_ORIGIN` (optional, use frontend URL if deploying frontend separately)
- `ADMIN_EMAIL` (optional, seeds admin user)
- `ADMIN_PASSWORD` (optional, seeds admin user)
- `NODE_ENV=production`

See `.env.example` for a template.

## Deploy on Render (single Web Service)

1. Push this repo to GitHub/GitLab.
2. In Render, click **New +** -> **Web Service**.
3. Connect your repo and choose the branch.
4. Use these settings:
   - Runtime: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variables from the list above.
6. Deploy.

After deploy:
- Health check: `https://<your-render-service>.onrender.com/api/health`
- App: `https://<your-render-service>.onrender.com`

## Optional: Blueprint deploy

This repo includes `render.yaml`. You can use **New + -> Blueprint** in Render and select this repo.
