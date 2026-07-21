# Menu Dietary Tags + Tasting Request Design

## Context

Follow-up to the earlier gallery-lightbox/contact-page work. Two related additions to `/menu`,
requested together:

1. Dietary tag labels + a filter UI on the menu.
2. A "tasting request" flow: select dishes on the menu, continue to `/reservations` with those
   dishes prefilled into a new Notes field.

Both touch the same dish list, so they're implemented together in one new client component.

## 1. Dietary Tags

### Data

Add a `tags: string[]` field to every dish in the `courses` array (currently inline in
`app/menu/page.tsx`), drawn from a fixed set: `vegetarian`, `vegan`, `gluten-free`, `shellfish`,
`nuts`. Assigned per-dish from its existing `subtitle`/`desc` copy:

| Course | Dish | Tags |
|---|---|---|
| Starters | Miang Kham | gluten-free |
| Starters | Larb Neua Wagyu | gluten-free |
| Starters | Som Tam Pu Ma | shellfish, nuts, gluten-free |
| Starters | Goong Phao Nam Makham | shellfish, gluten-free |
| Soups | Tom Yum Goong Mangkorn | shellfish, gluten-free |
| Soups | Tom Ped Kha | gluten-free |
| Soups | Tom Khamin Het Pa | vegan, vegetarian, gluten-free |
| Soups | Tom Kha Fak Thong | vegan, vegetarian, gluten-free |
| Curries | Massaman Neua Wagyu | nuts, gluten-free |
| Curries | Gaeng Keow Wan Goong Mangkorn | shellfish, gluten-free |
| Curries | Gaeng Pa Neua Kwang | gluten-free |
| Curries | Panang Ped | gluten-free |
| Mains | Wagyu Yang Jim Jaew | gluten-free |
| Mains | Pla Turbot Khamin | gluten-free |
| Mains | Ped Yang Makham | gluten-free |
| Mains | Pla Dam Sam Rot | gluten-free |
| Desserts | Khao Niao Mamuang | vegan, vegetarian, gluten-free |
| Desserts | Custard Cha Thai | vegetarian, gluten-free |
| Desserts | Sorbet Maphrao | vegan, vegetarian, nuts, gluten-free |
| Desserts | Chocolate Makham Phrik | vegetarian, gluten-free |

(Most dishes end up gluten-free, which is realistic for this cuisine — rice- and fish-sauce-based,
no wheat-flour dishes in the current menu. The filter still functions correctly; it's just not
very discriminating for that one tag.)

### Display

Each dish's tags render as small gold-accent labels after the dish name, same visual weight and
placement as the existing spice `Peppers` tag (`app/menu/page.tsx` — small letter-spaced
uppercase text, `#c2a06a`). Format: uppercase tag name, `GLUTEN-FREE` shortened to `GF`.

### Filter

A row of pill buttons above the course list, reusing the existing `.kn-slot` / `.kn-slot.selected`
CSS classes (already used for reservation time slots — bordered pill, hover, selected states, no
new CSS needed): `ALL`, `VEGETARIAN`, `VEGAN`, `GF`, `SHELLFISH`, `NUTS`. Single-select — clicking a
tag filters every course section to only dishes carrying that tag; clicking `ALL` (or the same tag
again) resets. If a course section has zero matching dishes under the active filter, hide that
course's heading entirely (no empty "Curries" header with nothing under it).

## 2. Tasting Request

### Selecting dishes

Each dish gets a small toggle button, e.g. `+ ADD TO TASTING REQUEST`, that flips to `✓ ADDED` when
selected (styled as a small text button, not a full CTA). Selection state is `Set<string>` of dish
names, local to the new list component.

### Sticky bar

When `selectedDishes.size > 0`, a fixed bottom bar appears (similar treatment to the gallery
lightbox's fixed overlay, but a bar, not a modal): "`N dish(es) selected for tasting request`" plus
a `CONTINUE TO RESERVATION →` button (`.kn-cta-solid`). Clicking it navigates to:

```
/reservations?notes=${encodeURIComponent(`Tasting request: ${selectedDishNames.join(", ")}`)}
```

extending the page's existing prefill pattern (`date`, `partySize`, `name` are already read from
the query string in `ReservationsPageForm.tsx`).

### Notes field on both booking forms

Both `ReservationsPageForm.tsx` and `ReservationTeaser.tsx` get a new optional **Notes / special
requests** `<textarea>` (uses the existing `.kn-input` class, `rows={3}`, no `required` — this is
the one field in either form that's intentionally optional, so it does *not* participate in the
required-field validation/error UI added earlier). `ReservationsPageForm.tsx` initializes its value
from `searchParams.get("notes") || ""`; `ReservationTeaser.tsx` just starts empty (nothing links
into it with a prefill — added for field-set parity between the two forms only).

The `notes` value is included in the `POST /api/reservations` body from both forms. In
`app/api/reservations/route.ts`, `notes` is read as an optional field (no validation requirement,
consistent with the mock API's existing pattern) and, when non-empty, appended to the confirmation
message, e.g.:

```
Your table for 4 on 2026-08-01 at 7:00 PM is confirmed. A confirmation email is on its way to
you@example.com. We've noted your request: "Tasting request: Wagyu Yang Jim Jaew, Khao Niao
Mamuang."
```

## Component Structure

- New: `components/MenuList.tsx` — client component, owns the `courses` data (moved from
  `app/menu/page.tsx`), the `Peppers` spice-tag helper (moved from the same file), the dietary
  filter state, and the tasting-request selection state + sticky bar. Renders the full course
  list currently inline in `app/menu/page.tsx`.
- Modify: `app/menu/page.tsx` — removes the `courses` array, `Peppers` helper, and the inline
  course-list JSX; renders `<MenuList />` in their place. Stays a server component (header, intro
  copy, and bottom CTA/copyright bar are unchanged).
- Modify: `components/ReservationsPageForm.tsx` — add `notes` state (from `searchParams`) + textarea
  + include in POST body.
- Modify: `components/ReservationTeaser.tsx` — add `notes` state + textarea + include in POST body.
- Modify: `app/api/reservations/route.ts` — read optional `notes`, append acknowledgment to the
  confirmation message when present.

## Out of scope

- Multi-select / combined filters (e.g. "vegetarian AND nut-free" at once).
- Persisting the tasting-request selection across a page reload.
- Any change to the required-field validation added previously (notes stays optional and excluded
  from that logic).

## Testing

- `npm run lint` and `npm run build` must pass.
- Manual check: filter each tag on `/menu` and confirm only matching dishes (and non-empty course
  headers) show; add 2+ dishes to a tasting request, use the sticky bar to continue, confirm
  `/reservations` prefills Notes with the expected text; submit a booking with and without notes
  from both forms and confirm the confirmation message behaves as expected.
