# Custom 404 Page + Add-to-Calendar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Next's default 404 with a themed page, and add a working "add to calendar" (.ics download) link to both reservation forms' confirmation screens.

**Architecture:** `app/not-found.tsx` is a new, standalone server component (Next renders it automatically for unmatched routes — no routing wiring needed). Each reservation form gets a `confirmedBooking` state snapshot (captured before `selectedTime` is cleared) and a duplicated `buildICSDataUrl` helper, consistent with this codebase's existing pattern of duplicating small helpers between the two forms rather than sharing a module.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, inline `style={{}}` objects, shared `kn-*` classes. No test framework configured — verification is `npm run lint`, `npm run build`, and manual checks against the running dev server.

## Global Constraints

- Styling is inline `style={{}}` objects; reuse `.kn-cta` / `.kn-cta-solid` for buttons/links.
- The `.ics` helper is duplicated in both `ReservationTeaser.tsx` and `ReservationsPageForm.tsx` — do not extract a shared module (matches how `formatTime12`/`todayISO` are already duplicated between them).
- `npm run lint` and `npm run build` must pass after each task.

---

### Task 1: Custom 404 page

**Files:**
- Create: `app/not-found.tsx`

**Interfaces:** none (standalone page, no props, nothing consumed from other tasks).

- [ ] **Step 1: Create `app/not-found.tsx`**

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        background: "#17140f",
        color: "#ece7de",
        fontFamily: "var(--font-mulish), sans-serif",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(24px,6vw,96px)",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <div style={{ fontSize: 12, letterSpacing: "0.28em", color: "#c2a06a", marginBottom: 20 }}>LOST?</div>
        <h1 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 500, fontSize: "clamp(36px,5vw,56px)", margin: "0 0 18px", color: "#ece7de" }}>
          This table isn&apos;t set.
        </h1>
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(236,231,222,0.7)", margin: "0 0 40px", lineHeight: 1.7 }}>
          The page you&apos;re looking for has wandered off the menu.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
          <Link href="/" className="kn-cta-solid" style={{ textDecoration: "none" }}>BACK TO HOME</Link>
          <Link href="/menu" className="kn-cta" style={{ textDecoration: "none" }}>VIEW THE MENU</Link>
          <Link href="/reservations" className="kn-cta" style={{ textDecoration: "none" }}>RESERVATIONS</Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Lint and build**

Run: `npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds; `/_not-found` appears in the route list.

- [ ] **Step 3: Manual check**

With the dev server running, visit `http://localhost:3000/this-route-does-not-exist`:
- Styled 404 page renders (dark background, gold eyebrow, Cormorant heading, italic line).
- All three links (`BACK TO HOME`, `VIEW THE MENU`, `RESERVATIONS`) navigate correctly.

- [ ] **Step 4: Commit**

```bash
git add app/not-found.tsx
git commit -m "$(cat <<'EOF'
Add a custom 404 page

Replaces Next's bare default not-found page with one matching the site's
dark theme and /menu's header treatment, plus links back to the key pages.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Add-to-calendar on the homepage teaser

**Files:**
- Modify: `components/ReservationTeaser.tsx`

**Interfaces:**
- Produces: nothing consumed elsewhere (self-contained within this file).

- [ ] **Step 1: Add the `buildICSDataUrl` helper**

Add this after the existing `formatTime12` function:

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

- [ ] **Step 2: Add `confirmedBooking` state**

Change:

```tsx
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ confirmed: boolean; message: string } | null>(null);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
```

to:

```tsx
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ confirmed: boolean; message: string } | null>(null);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{ date: string; time: string; partySize: number } | null>(null);
```

- [ ] **Step 3: Capture the booking snapshot on confirmation**

Change:

```tsx
      const data = await res.json();
      setResult(data);
      if (data.confirmed) {
        setSlots((prev) => prev.map((s) => (s.time === selectedTime ? { ...s, available: false } : s)));
        setSelectedTime(null);
      }
```

to:

```tsx
      const data = await res.json();
      setResult(data);
      if (data.confirmed) {
        setConfirmedBooking({ date, time: selectedTime as string, partySize });
        setSlots((prev) => prev.map((s) => (s.time === selectedTime ? { ...s, available: false } : s)));
        setSelectedTime(null);
      }
```

- [ ] **Step 4: Render the add-to-calendar link**

Change:

```tsx
  if (result?.confirmed) {
    return (
      <div style={{ padding: 40, border: "1px solid rgba(201,162,75,0.35)", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: 22, color: "#e6d5ab", marginBottom: 14 }}>
          Thank you, {name.split(" ")[0]}.
        </div>
        <p style={{ fontSize: 15, fontWeight: 300, color: "rgba(236,231,222,0.82)", lineHeight: 1.7, margin: 0 }}>{result.message}</p>
      </div>
    );
  }
```

to:

```tsx
  if (result?.confirmed) {
    return (
      <div style={{ padding: 40, border: "1px solid rgba(201,162,75,0.35)", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: 22, color: "#e6d5ab", marginBottom: 14 }}>
          Thank you, {name.split(" ")[0]}.
        </div>
        <p style={{ fontSize: 15, fontWeight: 300, color: "rgba(236,231,222,0.82)", lineHeight: 1.7, margin: "0 0 24px" }}>{result.message}</p>
        {confirmedBooking && (
          <a href={buildICSDataUrl(confirmedBooking)} download="kinnari-reservation.ics" className="kn-cta" style={{ textDecoration: "none", display: "inline-block" }}>
            ADD TO CALENDAR
          </a>
        )}
      </div>
    );
  }
```

- [ ] **Step 5: Lint and build**

Run: `npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 6: Manual check**

On the homepage, complete a booking (retry if the mock API's random failure path triggers) →
confirmation screen shows an "ADD TO CALENDAR" link; downloading it produces a valid `.ics` file
with the correct date, time, 2-hour duration, and location.

- [ ] **Step 7: Commit**

```bash
git add components/ReservationTeaser.tsx
git commit -m "$(cat <<'EOF'
Add "add to calendar" link to the homepage booking confirmation

Downloads a .ics file for the confirmed reservation via a data URI, no
backend needed. Booking details are snapshotted into confirmedBooking
state at confirmation time, since selectedTime is cleared immediately
after a successful booking.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Add-to-calendar on the standalone reservations page

**Files:**
- Modify: `components/ReservationsPageForm.tsx`

**Interfaces:** none (mirrors Task 2 in a separate file, no shared code).

- [ ] **Step 1: Add the `buildICSDataUrl` helper**

Add this after the existing `formatTime12` function (identical to Task 2's helper):

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

- [ ] **Step 2: Add `confirmedBooking` state**

Change:

```tsx
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ confirmed: boolean; message: string } | null>(null);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
```

to:

```tsx
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ confirmed: boolean; message: string } | null>(null);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{ date: string; time: string; partySize: number } | null>(null);
```

- [ ] **Step 3: Capture the booking snapshot on confirmation**

Change:

```tsx
      const data = await res.json();
      setResult(data);
      if (data.confirmed) {
        setSlots((prev) => prev.map((s) => (s.time === selectedTime ? { ...s, available: false } : s)));
        setSelectedTime(null);
      }
```

to:

```tsx
      const data = await res.json();
      setResult(data);
      if (data.confirmed) {
        setConfirmedBooking({ date, time: selectedTime as string, partySize });
        setSlots((prev) => prev.map((s) => (s.time === selectedTime ? { ...s, available: false } : s)));
        setSelectedTime(null);
      }
```

- [ ] **Step 4: Render the add-to-calendar link**

Change:

```tsx
      {result?.confirmed ? (
        <div style={{ padding: 40, border: "1px solid rgba(201,162,75,0.35)", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: 22, color: "#e6d5ab", marginBottom: 14 }}>
            Thank you, {name.split(" ")[0]}.
          </div>
          <p style={{ fontSize: 15, fontWeight: 300, color: "rgba(236,231,222,0.82)", lineHeight: 1.7, margin: 0 }}>{result.message}</p>
        </div>
      ) : (
```

to:

```tsx
      {result?.confirmed ? (
        <div style={{ padding: 40, border: "1px solid rgba(201,162,75,0.35)", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: 22, color: "#e6d5ab", marginBottom: 14 }}>
            Thank you, {name.split(" ")[0]}.
          </div>
          <p style={{ fontSize: 15, fontWeight: 300, color: "rgba(236,231,222,0.82)", lineHeight: 1.7, margin: "0 0 24px" }}>{result.message}</p>
          {confirmedBooking && (
            <a href={buildICSDataUrl(confirmedBooking)} download="kinnari-reservation.ics" className="kn-cta" style={{ textDecoration: "none", display: "inline-block" }}>
              ADD TO CALENDAR
            </a>
          )}
        </div>
      ) : (
```

- [ ] **Step 5: Lint and build**

Run: `npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 6: Manual check**

On `/reservations`, complete a booking (retry if the mock API's random failure path triggers) →
confirmation screen shows an "ADD TO CALENDAR" link; downloading it produces a valid `.ics` file
with the correct date, time, 2-hour duration, and location.

- [ ] **Step 7: Commit**

```bash
git add components/ReservationsPageForm.tsx
git commit -m "$(cat <<'EOF'
Add "add to calendar" link to the standalone reservation confirmation

Same .ics download as the homepage teaser's confirmation screen, kept as
a separate implementation in this file per the existing pattern of
duplicating small helpers between the two booking forms.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```
