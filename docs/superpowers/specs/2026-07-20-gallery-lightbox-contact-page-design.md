# Gallery Lightbox + Contact Page — Design

## Context

KINNARI is a three-page (home, menu, reservations) Next.js concept site for a fictional fine-dining
restaurant. Styling is inline `style={{}}` objects; shared responsive behavior lives in
`app/globals.css` under `kn-*` class names. This spec covers two small, independent additions
requested together:

1. A lightbox for the homepage gallery images.
2. A new standalone `/contact` page.

## 1. Gallery Lightbox

### Current state

`app/page.tsx` renders the gallery section inline: a `div#gallery` containing a heading and a
`.kn-gallery-grid` of 5 items (`{ src, caption, height, span }`), each an `Image` inside a plain
`div`. `app/page.tsx` is a server component; no interactivity exists today.

### Change

Extract the gallery section into a new client component, `components/Gallery.tsx`, rendering
exactly the current markup (same `id="gallery"` wrapper, same heading, same `.kn-gallery-grid`,
same items array moved in from `page.tsx`) plus lightbox behavior:

- Each grid image becomes clickable (button semantics) and opens the lightbox at its index.
- Lightbox state: `openIndex: number | null`, local `useState` in `Gallery.tsx`.
- Overlay (rendered when `openIndex !== null`):
  - Fixed, full-viewport, dark backdrop above the nav (`zIndex` higher than Nav's 50).
  - Enlarged image via `next/image` (`fill`, `objectFit: contain`) inside a centered,
    viewport-constrained container (e.g. `min(92vw, 1100px)` × `min(82vh, 720px)`).
  - Caption (same italic Cormorant styling as the grid caption) and a small "`n / 5`" counter.
  - Prev/next arrow buttons, wrapping around at the ends of the array.
  - Close button (✕), plus close-on-backdrop-click (only when the click target is the backdrop
    itself, not the image/controls) and close-on-`Escape`.
  - `ArrowLeft` / `ArrowRight` navigate while open.
  - Body scroll is locked (`document.body.style.overflow = "hidden"`) while open, restored on
    close/unmount.
  - `role="dialog"` `aria-modal="true"` `aria-label="Gallery image viewer"` on the overlay,
    matching the a11y level already used by `MobileNavToggle`'s panel (no full focus trap).
- All styling inline, matching the grid's existing look. No new global CSS — the layout doesn't
  need new breakpoints beyond what `.kn-gallery-grid` already handles.
- `app/page.tsx` is updated to import and render `<Gallery />` in place of the current inline
  `#gallery` block.

### Out of scope

- Swipe/touch gestures.
- Full focus trap / focus return to trigger element.
- Preloading adjacent images.

## 2. Contact Page

### Current state

`Footer.tsx` already contains the canonical location/hours/contact copy (12 Harrow Lane, Aldermere
Quarter; Tue–Sun 5:30–11 PM; phone; `reservations@kinnari.com`). There is no dedicated
contact/location page or nav entry for one. `Nav.tsx`'s `active` prop currently only accepts
`"menu"`.

### Change

New `app/contact/page.tsx`, a plain server component structured like `app/menu/page.tsx`
(`Nav` → header → content → `Footer`):

- `<Nav active="contact" />`
- Centered header block: eyebrow label + Cormorant heading + short italic intro line (same visual
  pattern as the menu page header).
- Three info blocks laid out with the existing `.kn-footer-grid` class (already responsive,
  3-col → 1-col at 700px) reusing the same copy as `Footer.tsx`:
  1. **Location & Hours** — address + hours.
  2. **Contact** — phone + email.
  3. **Reservations** — short line + a `RESERVE A TABLE` CTA (`.kn-cta`) linking to `/reservations`.
- No map, no image, no invented details beyond what's already in `Footer.tsx` — plain typographic
  layout per the approved design.
- `<Footer />` at the bottom, consistent with the other two pages.

### Nav wiring

- `components/Nav.tsx`: widen `active?: "menu"` to `active?: "menu" | "contact"`, add a `CONTACT`
  link (same pattern as the existing `MENU` link) before the `RESERVATIONS` button.
- `components/MobileNavToggle.tsx`: add a `Contact` link in the mobile panel, same style as the
  existing links.
- `components/Footer.tsx`: add a `CONTACT` link to the existing STORY / MENU / GALLERY link row,
  pointing at `/contact`.

### Out of scope

- A contact form or new API route.
- A real/interactive map embed (address is fictional).

## Testing

- `npm run lint` and `npm run build` must pass.
- Manual check in dev server: gallery lightbox opens/closes/navigates correctly on desktop and at a
  mobile width; `/contact` renders and is reachable from Nav (desktop + mobile), Footer, and
  directly by URL.
