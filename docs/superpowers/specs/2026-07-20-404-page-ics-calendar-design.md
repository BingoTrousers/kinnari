# Custom 404 Page + Add-to-Calendar (.ics) Design

## Context

Follow-up to the menu dietary tags / tasting request work. Two more additions, requested together:

1. A custom `/_not-found` page — currently Next's bare, unstyled default (no `app/not-found.tsx`
   exists in the project).
2. An "add to calendar" (.ics) link on both booking forms' confirmation screens.

An accessibility check across this session's work follows once these are built, as a separate
review pass (no design doc — findings + fixes reported directly).

## 1. Custom 404 Page

### File

New `app/not-found.tsx`. Next.js renders this automatically for any unmatched route — no routing
wiring needed.

### Content

Minimal, text-only, matching `/menu`'s header treatment (no image, no Nav/Footer — this is a
standalone shell in the site's dark theme, same background/font setup as every other page):

- Small gold eyebrow label: `LOST?`
- Cormorant heading: `This table isn't set.` (or similar, fine-dining-appropriate copy for a 404)
- Short italic line: something like "The page you're looking for has wandered off the menu."
- Three links back to key pages, styled with the existing `.kn-cta` / `.kn-cta-solid` classes:
  `BACK TO HOME` (solid, primary), `VIEW THE MENU`, `RESERVATIONS` (both outlined `.kn-cta`).

### Out of scope

- Custom illustration/photo (per the "minimal" decision).
- Any change to `app/robots.ts` or SEO metadata.

## 2. Add-to-Calendar (.ics)

### Where it appears

On the confirmed-booking screen of both `components/ReservationTeaser.tsx` and
`components/ReservationsPageForm.tsx`, directly below the existing thank-you message.

### The problem: booking details are cleared before the confirmation renders

Both forms currently do `setSelectedTime(null)` immediately after a successful booking (inside the
`if (data.confirmed)` branch), so by the time the "Thank you" panel renders, `selectedTime` is
already `null`. Building the .ics file needs the confirmed date/time/party size, so each form gets
a new state snapshot:

```tsx
const [confirmedBooking, setConfirmedBooking] = useState<{ date: string; time: string; partySize: number } | null>(null);
```

set alongside `setResult(data)` when `data.confirmed` is true, capturing `date`, `selectedTime`,
and `partySize` from that render's closure (before `selectedTime` is nulled out).

### Building the file

A small helper, duplicated in both files (matching the codebase's existing pattern of duplicating
small helpers like `formatTime12` between these two forms rather than sharing a module):

```tsx
function buildICSDataUrl(booking: { date: string; time: string; partySize: number }) {
  const start = new Date(`${booking.date}T${booking.time}:00`);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const toICSDate = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//KINNARI//Reservation//EN",
    "BEGIN:VEVENT",
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:Dinner reservation at KINNARI for ${booking.partySize}`,
    "LOCATION:12 Harrow Lane, Aldermere Quarter",
    "DESCRIPTION:Reservation at KINNARI.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}
```

- 2-hour event window (fixed, no configurable duration — matches the mock API's level of realism).
- Location is the fixed address already used in `Footer.tsx` / `app/contact/page.tsx`.
- Rendered as an `<a>` tag, `.kn-cta` styling, `download="kinnari-reservation.ics"`,
  `href={buildICSDataUrl(confirmedBooking)}`. Only rendered when `confirmedBooking` is non-null
  (i.e. always alongside the confirmation message).

### Out of scope

- Real calendar API integration (Google/Outlook add-to-calendar links) — just the universal `.ics`
  download, which works with any calendar app.
- Timezone handling beyond the browser's local time (consistent with this being a demo/mock
  booking flow with no real backend).

## Testing

- `npm run lint` and `npm run build` must pass.
- Manual check: visit a nonexistent route (e.g. `/nonexistent`) → styled 404 page with working
  links. Complete a booking on both forms → confirmation screen includes a working "ADD TO
  CALENDAR" download link; opening the downloaded `.ics` file shows the correct date/time/party
  size/location.
