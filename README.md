# Transmaa

A logistics platform connecting customers who need trucks, the Transmaa staff
who verify and dispatch loads, and the drivers who carry them — plus a
commercial vehicle marketplace and finance/insurance enquiry desk.

## Live deployment

| App | URL |
|---|---|
| Customer app | https://transmaa-orpin.vercel.app |
| Staff console | https://transmaa-orpin.vercel.app/staff |
| Driver app | https://transmaa-orpin.vercel.app/driver |
| Backend API | https://transmaa-backend-71cb.onrender.com |

> The backend is on Render's free tier and spins down after ~15 minutes of
> inactivity. The first request after idle can take 30–60 seconds to respond.

## Logging in

- **Customers and drivers** log in with their phone number and an OTP. During
  registration/login testing, the prototype code `123456` always works,
  alongside real email-delivered OTPs.
- **Staff** log in with a phone number and password. Staff accounts are
  created by an existing admin (`POST /api/staff/auth/register`), and the
  very first admin account is created once via a bootstrap endpoint
  (`POST /api/staff/auth/bootstrap-admin`, gated by a setup key set in the
  environment) — ask an existing team member for staff credentials.

## Project structure

```
backend/    Express + MongoDB API — staff, customer, and driver auth and operations
frontend/   React (Vite) app — three routed experiences (/, /staff, /driver)
```

## Running locally

### Backend

```bash
cd backend
cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET, etc.
npm install
npm run dev             # http://localhost:5050
npm test                 # automated test suite
```

### Frontend

```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```

Set `VITE_API_BASE_URL` in the frontend environment to point at your backend
if it's not running on `http://localhost:5050`.

## Architecture

- **One backend, one database.** Customers, drivers, and staff are all
  `User` documents in a single MongoDB collection, distinguished by role.
  Bookings, driver profiles, vehicle listings, and finance enquiries are
  shared collections read/written by whichever role needs them.
- **JWT auth** for all three roles, with role-specific middleware
  (`staffMiddleware`, `driverMiddleware`) layered on a shared
  `authMiddleware`.
- **Three frontend experiences, one app.** `react-router-dom` routes `/`,
  `/staff`, and `/driver` to independent app shells that share the same
  design system and backend.

## Tests

The backend has an automated test suite (Jest + Supertest +
`mongodb-memory-server`) covering staff auth and the full
customer → staff → driver booking lifecycle end to end:

```bash
cd backend
npm test
```
