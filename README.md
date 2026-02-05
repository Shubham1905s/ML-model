# Bakwas ? Dummy MERN Room Booking

This is a MERN-style room booking project built as a **fully mocked demo**. All data is in-memory and every flow is simulated (auth, booking, payments, reviews, admin stats).

## What is included (dummy)

- Auth (register/login) with a fake JWT response
- Property listings and search
- Booking creation and booking history
- Payments and invoice response
- Reviews list and submit
- Admin analytics stats
- Frontend UI that consumes the dummy API

## Setup

Install dependencies:

```bash
npm install
npm --workspace server install
npm --workspace client install
```

Run both apps:

```bash
npm run dev:server
npm run dev:client
```

Open the UI at `http://localhost:5173`.

## Notes

- Data lives in `server/data.js` and resets on every restart.
- No real auth, payments, or database connections are implemented.
- This structure is ready for replacing the mocks with a real MongoDB + JWT stack.
