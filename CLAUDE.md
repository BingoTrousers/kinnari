@AGENTS.md

## Project

KINNARI — a fine Thai dining restaurant concept site. Next.js App Router, TypeScript, no database. See README.md for pages and stack.

## Conventions used in this codebase

- Styling is inline `style={{}}` objects (no Tailwind utility classes in use, no CSS modules), matching the visual style the site was originally built from. Shared responsive behavior (media queries, hover states, keyframes) lives in `app/globals.css` under `kn-*` class names — reuse those classes instead of adding new inline breakpoints.
- All content images go through `next/image`. The hero image is `priority`; everything below the fold is `loading="lazy"`. Unsplash is the only configured remote image host (`next.config.ts` `images.remotePatterns`) — add new hosts there if new image sources are introduced.
- `components/Nav.tsx` and `components/Footer.tsx` are shared across all three pages; edit there rather than duplicating markup per-page.
- The `/reservations` page reads `date`, `partySize`, and `name` from the URL query string (populated by the homepage teaser form) — it's wrapped in `<Suspense>` because `useSearchParams` requires it for static rendering.
- The reservation API routes (`app/api/reservations/*`) are intentionally fake: no persistence, artificial delay, and a randomized failure path to exercise the UI's error state. Don't wire in a real database without discussing it first — that's a deliberate design choice, not an oversight.
