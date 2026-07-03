# KINNARI

A concept restaurant website for **KINNARI**, a fine Thai dining restaurant. Built with Next.js (App Router) and TypeScript.

## Pages

- `/` — Home: hero, our story, gallery, and a self-contained reservations form (date, live time slots, party size, contact details, inline confirmation — no redirect)
- `/menu` — Full five-course menu with romanized Thai dish names and spice-level tags
- `/reservations` — Standalone reservation form with live (mocked) availability and a simulated booking flow; supports prefill via `date`, `partySize`, and `name` query params for deep links

## Reservation flow

The reservation system is a self-contained demo — there is no real database or email delivery. Both the homepage form (`components/ReservationTeaser.tsx`) and the standalone `/reservations` page book directly against the same mock API:

- `GET /api/reservations/availability?date=...&partySize=...` returns a deterministic set of mock time slots (some marked unavailable) for the given date and party size.
- `POST /api/reservations` simulates a booking request with an artificial delay, and returns a fake confirmation (or an occasional simulated "just booked" failure, to exercise the error state in the UI).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript
- `next/font` (Cormorant Garamond + Mulish)
- `next/image` for all content images, with Unsplash configured as a remote image source in `next.config.ts`

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — lint the project
