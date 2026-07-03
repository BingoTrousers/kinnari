@AGENTS.md

## Project

KINNARI — a fine Thai dining restaurant concept site. Next.js App Router, TypeScript, no database. See README.md for pages and stack.

## Conventions used in this codebase

- Styling is inline `style={{}}` objects (no Tailwind utility classes in use, no CSS modules), matching the visual style the site was originally built from. Shared responsive behavior (media queries, hover states, keyframes) lives in `app/globals.css` under `kn-*` class names — reuse those classes instead of adding new inline breakpoints.
- All content images go through `next/image`. The hero image is `priority`; everything below the fold is `loading="lazy"`. Unsplash is the only configured remote image host (`next.config.ts` `images.remotePatterns`) — add new hosts there if new image sources are introduced.
- `components/Nav.tsx` and `components/Footer.tsx` are shared across all three pages; edit there rather than duplicating markup per-page.
- `components/ReservationTeaser.tsx` is the homepage's self-contained booking form (date → live time slots → name/phone/email → inline confirmation, via `POST /api/reservations`). It duplicates rather than shares logic with `/reservations` (`app/reservations/page.tsx`), which is a separate standalone booking flow reachable directly or by deep link — keep both in sync by hand when changing booking behavior.
- The standalone `/reservations` page still reads `date`, `partySize`, and `name` from the URL query string for prefill (useful for deep links); it's wrapped in `<Suspense>` because `useSearchParams` requires it for static rendering. The homepage teaser no longer navigates there — it books inline.
- The reservation API routes (`app/api/reservations/*`) are intentionally fake: no persistence, artificial delay, and a randomized failure path to exercise the UI's error state. Don't wire in a real database without discussing it first — that's a deliberate design choice, not an oversight.
