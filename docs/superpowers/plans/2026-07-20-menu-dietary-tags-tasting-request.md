# Menu Dietary Tags + Tasting Request Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add per-dish dietary tags + a tag filter to `/menu`, and a "tasting request" flow where selected dishes carry through to a new Notes field on both reservation forms.

**Architecture:** Extract the interactive parts of `/menu` (course list, now with tags + a tag filter + tasting-request selection) into a new client component, `components/MenuList.tsx`, the same way `Gallery.tsx` was extracted from the homepage. Selected dishes surface in a fixed bottom bar with a link to `/reservations?notes=...`, extending that page's existing query-param prefill pattern. Both `ReservationsPageForm.tsx` and `ReservationTeaser.tsx` gain an optional Notes textarea; the mock API acknowledges it in the confirmation message when present.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, inline `style={{}}` objects, shared `kn-*` classes in `app/globals.css`. No test framework configured — verification is `npm run lint`, `npm run build`, and manual checks against the running dev server.

## Global Constraints

- Styling is inline `style={{}}` objects; reuse existing `kn-*` classes (`.kn-slot`, `.kn-cta-solid`, `.kn-input`) instead of adding new inline breakpoints or CSS.
- The Notes field is optional on both forms and must NOT participate in the required-field validation/error UI added previously (no `required`, no "Required" hint, excluded from `formValid`).
- Dietary tag set is fixed: `vegetarian`, `vegan`, `gluten-free`, `shellfish`, `nuts` — displayed as `VEGETARIAN`, `VEGAN`, `GF`, `SHELLFISH`, `NUTS`.
- `npm run lint` and `npm run build` must pass after each task.

---

### Task 1: Dietary tags + filter (`components/MenuList.tsx`, base extraction)

**Files:**
- Create: `components/MenuList.tsx`
- Modify: `app/menu/page.tsx` (remove `courses` array, `Peppers` helper, and the inline course-list JSX; render `<MenuList />` instead)

**Interfaces:**
- Produces: `components/MenuList.tsx` default-exports `MenuList`, a client component with no props, self-contained (owns dish data, tags, and filter state — matching how `Gallery.tsx` owns its own `items`).

- [ ] **Step 1: Create `components/MenuList.tsx`**

```tsx
"use client";

import { useMemo, useState } from "react";

const TAGS = ["vegetarian", "vegan", "gluten-free", "shellfish", "nuts"] as const;
type Tag = (typeof TAGS)[number];

const TAG_LABELS: Record<Tag, string> = {
  vegetarian: "VEGETARIAN",
  vegan: "VEGAN",
  "gluten-free": "GF",
  shellfish: "SHELLFISH",
  nuts: "NUTS",
};

const courses = [
  {
    name: "Starters",
    dishes: [
      { name: "Miang Kham", subtitle: "Betel Leaf, Smoked Trout Roe, Lime Caviar", desc: "Cold-smoked roe folded into wild betel, brightened with beads of lime.", price: "$32", heat: 1, tags: ["gluten-free"] as Tag[] },
      { name: "Larb Neua Wagyu", subtitle: "Wagyu Larb, Toasted Rice, Wild Mint", desc: "Raw wagyu cut by hand, dusted in toasted rice, cooled with mint and chili.", price: "$38", heat: 2, tags: ["gluten-free"] as Tag[] },
      { name: "Som Tam Pu Ma", subtitle: "Green Papaya, Blue Crab, Peanut Dust", desc: "Shredded papaya bound with crab, sharpened by lime and crushed peanut.", price: "$34", heat: 2, tags: ["shellfish", "nuts", "gluten-free"] as Tag[] },
      { name: "Goong Phao Nam Makham", subtitle: "Charcoal Prawn, Tamarind Caramel, Chili Salt", desc: "Whole prawn over open flame, lacquered in tamarind, finished with chili salt.", price: "$36", heat: 1, tags: ["shellfish", "gluten-free"] as Tag[] },
    ],
  },
  {
    name: "Soups",
    dishes: [
      { name: "Tom Yum Goong Mangkorn", subtitle: "Tom Yum, Maine Lobster, Kaffir Foam", desc: "Lobster in a broth of lemongrass and lime leaf, crowned with citrus foam.", price: "$42", heat: 3, tags: ["shellfish", "gluten-free"] as Tag[] },
      { name: "Tom Ped Kha", subtitle: "Duck Consommé, Galangal, Charred Shallot", desc: "A clear duck broth steeped overnight with galangal and blistered shallot.", price: "$34", heat: 0, tags: ["gluten-free"] as Tag[] },
      { name: "Tom Khamin Het Pa", subtitle: "Coconut Broth, Wild Mushroom, Turmeric Oil", desc: "Forest mushrooms in warm coconut, threaded with turmeric and white pepper.", price: "$30", heat: 1, tags: ["vegan", "vegetarian", "gluten-free"] as Tag[] },
      { name: "Tom Kha Fak Thong", subtitle: "Tom Kha, Heirloom Squash, Toasted Coconut", desc: "Roasted squash folded into coconut and galangal, finished with toasted shavings.", price: "$32", heat: 1, tags: ["vegan", "vegetarian", "gluten-free"] as Tag[] },
    ],
  },
  {
    name: "Curries",
    dishes: [
      { name: "Massaman Neua Wagyu", subtitle: "Massaman, Wagyu Short Rib, Cardamom", desc: "Short rib braised four hours in massaman spice, roasted peanut, cardamom.", price: "$48", heat: 1, tags: ["nuts", "gluten-free"] as Tag[] },
      { name: "Gaeng Keow Wan Goong Mangkorn", subtitle: "Green Curry, Maine Lobster, Thai Basil", desc: "Lobster and baby eggplant in a curry green with basil and chili.", price: "$52", heat: 2, tags: ["shellfish", "gluten-free"] as Tag[] },
      { name: "Gaeng Pa Neua Kwang", subtitle: "Jungle Curry, Venison, Wild Peppercorn", desc: "Venison loin in a broth without coconut, fierce with green peppercorn.", price: "$46", heat: 3, tags: ["gluten-free"] as Tag[] },
      { name: "Panang Ped", subtitle: "Panang, Duck Breast, Kaffir Lime", desc: "Seared duck breast in a thickened panang, lifted by kaffir lime leaf.", price: "$44", heat: 2, tags: ["gluten-free"] as Tag[] },
    ],
  },
  {
    name: "Mains",
    dishes: [
      { name: "Wagyu Yang Jim Jaew", subtitle: "Charcoal Wagyu, Nam Jim Jaew, Sticky Rice Ash", desc: "Grilled wagyu striploin, smoked chili dip, sticky rice pressed into ash.", price: "$65", heat: 1, tags: ["gluten-free"] as Tag[] },
      { name: "Pla Turbot Khamin", subtitle: "Whole Turbot, Turmeric, Lemongrass Butter", desc: "Roasted turbot basted in turmeric and lemongrass, served whole at the table.", price: "$58", heat: 0, tags: ["gluten-free"] as Tag[] },
      { name: "Ped Yang Makham", subtitle: "Roast Duck, Tamarind Glaze, Pickled Plum", desc: "Duck roasted to order, lacquered in tamarind, cut with pickled plum.", price: "$48", heat: 0, tags: ["gluten-free"] as Tag[] },
      { name: "Pla Dam Sam Rot", subtitle: "Black Cod, Three-Flavor Sauce, Crisp Garlic", desc: "Marinated cod, sauced sweet-sour-spicy, finished with shards of fried garlic.", price: "$52", heat: 2, tags: ["gluten-free"] as Tag[] },
    ],
  },
  {
    name: "Desserts",
    dishes: [
      { name: "Khao Niao Mamuang", subtitle: "Mango, Sticky Rice, Coconut Ash", desc: "Mango cut ripe, warm sticky rice, coconut cream dusted with ash.", price: "$28", heat: 0, tags: ["vegan", "vegetarian", "gluten-free"] as Tag[] },
      { name: "Custard Cha Thai", subtitle: "Thai Tea Custard, Toasted Rice Crumble", desc: "Silken custard in the color of Thai tea, crumbled toasted rice.", price: "$30", heat: 0, tags: ["vegetarian", "gluten-free"] as Tag[] },
      { name: "Sorbet Maphrao", subtitle: "Coconut Sorbet, Palm Sugar, Roasted Cashew", desc: "Coconut churned cold, palm sugar caramel, roasted cashew for crunch.", price: "$28", heat: 0, tags: ["vegan", "vegetarian", "nuts", "gluten-free"] as Tag[] },
      { name: "Chocolate Makham Phrik", subtitle: "Dark Chocolate, Tamarind Caramel, Chili", desc: "Dark chocolate cut with tamarind caramel, a whisper of chili at the end.", price: "$32", heat: 1, tags: ["vegetarian", "gluten-free"] as Tag[] },
    ],
  },
];

function Peppers({ heat }: { heat: number }) {
  if (!heat) return null;
  const label = heat >= 3 ? "VERY SPICY" : "SPICY";
  return (
    <span
      style={{
        marginLeft: 10,
        fontSize: 10,
        letterSpacing: "0.14em",
        fontWeight: 400,
        color: "#c2a06a",
        verticalAlign: "middle",
      }}
      title={`Spice level ${heat} of 3`}
    >
      {label}
    </span>
  );
}

function DishTags({ tags }: { tags: Tag[] }) {
  return (
    <>
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            marginLeft: 10,
            fontSize: 10,
            letterSpacing: "0.14em",
            fontWeight: 400,
            color: "#c2a06a",
            verticalAlign: "middle",
          }}
        >
          {TAG_LABELS[tag]}
        </span>
      ))}
    </>
  );
}

export default function MenuList() {
  const [activeTag, setActiveTag] = useState<Tag | null>(null);

  const filteredCourses = useMemo(() => {
    if (!activeTag) return courses;
    return courses
      .map((course) => ({
        ...course,
        dishes: course.dishes.filter((dish) => dish.tags.includes(activeTag)),
      }))
      .filter((course) => course.dishes.length > 0);
  }, [activeTag]);

  return (
    <>
      <div style={{ padding: "0 clamp(24px,6vw,96px)", maxWidth: 840, margin: "0 auto clamp(48px,6vw,72px)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          <button type="button" className={`kn-slot${activeTag === null ? " selected" : ""}`} onClick={() => setActiveTag(null)}>
            ALL
          </button>
          {TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`kn-slot${activeTag === tag ? " selected" : ""}`}
              onClick={() => setActiveTag(tag)}
            >
              {TAG_LABELS[tag]}
            </button>
          ))}
        </div>
      </div>

      {filteredCourses.map((course, i) => (
        <div
          key={course.name}
          style={{ padding: `0 clamp(24px,6vw,96px) ${i === filteredCourses.length - 1 ? "clamp(96px,11vw,150px)" : "clamp(80px,9vw,120px)"}` }}
        >
          <div style={{ maxWidth: 840, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 36 }}>
              <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(26px,3vw,36px)", color: "#ece7de" }}>{course.name}</span>
              <span style={{ flex: 1, height: 1, background: "rgba(201,162,75,0.3)" }} />
            </div>

            {course.dishes.map((dish, di) => (
              <div
                key={dish.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "8px 24px",
                  alignItems: "center",
                  padding: "26px 0",
                  borderBottom: di === course.dishes.length - 1 ? "none" : "1px solid rgba(236,231,222,0.09)",
                }}
              >
                <div>
                  <div style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 19, marginBottom: 6 }}>
                    {dish.name}
                    <Peppers heat={dish.heat} />
                    <DishTags tags={dish.tags} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(236,231,222,0.42)", marginBottom: 6 }}>{dish.subtitle}</div>
                  <div style={{ fontSize: 14, fontWeight: 300, fontStyle: "italic", color: "rgba(236,231,222,0.6)", maxWidth: "56ch" }}>{dish.desc}</div>
                </div>
                <div style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 18, color: "#c2a06a" }}>{dish.price}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
```

- [ ] **Step 2: Update `app/menu/page.tsx` to use `MenuList`**

Replace the entire file with:

```tsx
import Nav from "@/components/Nav";
import Link from "next/link";
import MenuList from "@/components/MenuList";

export default function MenuPage() {
  return (
    <div style={{ background: "#17140f", color: "#ece7de", fontFamily: "var(--font-mulish), sans-serif", overflowX: "hidden" }}>
      <Nav active="menu" />

      {/* HEADER */}
      <div style={{ padding: "clamp(150px,18vw,220px) clamp(24px,6vw,96px) clamp(64px,8vw,96px)", textAlign: "center" }}>
        <div style={{ fontSize: 12, letterSpacing: "0.28em", color: "#c2a06a", marginBottom: 20 }}>THE MENU</div>
        <h1 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 500, fontSize: "clamp(44px,7vw,84px)", margin: "0 0 22px", color: "#ece7de" }}>KINNARI</h1>
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "clamp(16px,1.8vw,20px)", color: "rgba(236,231,222,0.7)", maxWidth: "46ch", margin: "0 auto" }}>
          Five courses, each built with precision — the essential tastes of Thailand, quieted and refined.
        </p>
      </div>

      <MenuList />

      {/* CTA */}
      <div style={{ padding: "0 clamp(24px,6vw,96px) clamp(96px,11vw,150px)", textAlign: "center" }}>
        <Link href="/reservations" className="kn-cta">RESERVE A TABLE</Link>
      </div>

      <div style={{ padding: "0 clamp(24px,6vw,96px) 40px" }}>
        <div
          style={{
            maxWidth: 1360,
            margin: "0 auto",
            paddingTop: 40,
            paddingBottom: 24,
            borderTop: "1px solid rgba(236,231,222,0.1)",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 11, color: "rgba(236,231,222,0.35)" }}>© 2026 KINNARI. A concept.</span>
          <span style={{ fontSize: 11, color: "rgba(236,231,222,0.35)" }}>12 Harrow Lane, Aldermere Quarter</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Lint and build**

Run: `npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Manual check**

With the dev server running, open `http://localhost:3000/menu`:
- All 20 dishes render with their spice tags (unchanged) plus new dietary tags where applicable.
- Click each filter pill (`VEGETARIAN`, `VEGAN`, `GF`, `SHELLFISH`, `NUTS`) → only matching dishes
  show, and any course with zero matches disappears entirely. Click `ALL` → everything returns.

- [ ] **Step 5: Commit**

```bash
git add components/MenuList.tsx app/menu/page.tsx
git commit -m "$(cat <<'EOF'
Add dietary tags and a tag filter to the menu

Extracts the menu's course list into a client component so dishes can
carry dietary tags (vegetarian, vegan, gluten-free, shellfish, nuts) and
be filtered by them, reusing the existing .kn-slot pill styling.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Tasting request selection + sticky bar

**Files:**
- Modify: `components/MenuList.tsx` (add selection state, per-dish toggle, sticky bar)

**Interfaces:**
- Consumes: nothing new from other tasks.
- Produces: navigates to `/reservations?notes=...`, consumed by Task 3's updated `ReservationsPageForm.tsx` (`searchParams.get("notes")`).

- [ ] **Step 1: Add the `Link` import and selection state**

In `components/MenuList.tsx`, change:

```tsx
"use client";

import { useMemo, useState } from "react";
```

to:

```tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
```

Change:

```tsx
export default function MenuList() {
  const [activeTag, setActiveTag] = useState<Tag | null>(null);
```

to:

```tsx
export default function MenuList() {
  const [activeTag, setActiveTag] = useState<Tag | null>(null);
  const [selectedDishes, setSelectedDishes] = useState<Set<string>>(new Set());

  function toggleDish(name: string) {
    setSelectedDishes((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }
```

- [ ] **Step 2: Add the per-dish toggle button**

Change the dish name block:

```tsx
                <div>
                  <div style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 19, marginBottom: 6 }}>
                    {dish.name}
                    <Peppers heat={dish.heat} />
                    <DishTags tags={dish.tags} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(236,231,222,0.42)", marginBottom: 6 }}>{dish.subtitle}</div>
                  <div style={{ fontSize: 14, fontWeight: 300, fontStyle: "italic", color: "rgba(236,231,222,0.6)", maxWidth: "56ch" }}>{dish.desc}</div>
                </div>
```

to:

```tsx
                <div>
                  <div style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 19, marginBottom: 6 }}>
                    {dish.name}
                    <Peppers heat={dish.heat} />
                    <DishTags tags={dish.tags} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(236,231,222,0.42)", marginBottom: 6 }}>{dish.subtitle}</div>
                  <div style={{ fontSize: 14, fontWeight: 300, fontStyle: "italic", color: "rgba(236,231,222,0.6)", maxWidth: "56ch", marginBottom: 10 }}>{dish.desc}</div>
                  <button
                    type="button"
                    onClick={() => toggleDish(dish.name)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      color: selectedDishes.has(dish.name) ? "#e6d5ab" : "rgba(236,231,222,0.45)",
                    }}
                  >
                    {selectedDishes.has(dish.name) ? "✓ ADDED TO TASTING REQUEST" : "+ ADD TO TASTING REQUEST"}
                  </button>
                </div>
```

- [ ] **Step 3: Add the sticky bar**

Change the component's closing return so the fragment ends with the sticky bar (insert this right
before the final `</>` and after the `{filteredCourses.map(...)}` block):

```tsx
      ))}

      {selectedDishes.size > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 55,
            background: "#1c1811",
            borderTop: "1px solid rgba(201,162,75,0.3)",
            padding: "16px clamp(24px,6vw,96px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 13, color: "rgba(236,231,222,0.8)" }}>
            {selectedDishes.size} dish{selectedDishes.size > 1 ? "es" : ""} selected for tasting request
          </span>
          <Link
            href={`/reservations?notes=${encodeURIComponent(`Tasting request: ${Array.from(selectedDishes).join(", ")}`)}`}
            className="kn-cta-solid"
            style={{ textDecoration: "none" }}
          >
            CONTINUE TO RESERVATION →
          </Link>
        </div>
      )}
    </>
  );
}
```

(This replaces the previous `))}\n    </>\n  );\n}` ending.)

- [ ] **Step 4: Lint and build**

Run: `npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Manual check**

On `/menu`:
- Click "+ ADD TO TASTING REQUEST" on 2 dishes → each flips to "✓ ADDED TO TASTING REQUEST", a
  sticky bar appears at the bottom reading "2 dishes selected for tasting request".
- Click the sticky bar's "CONTINUE TO RESERVATION →" → lands on `/reservations` with
  `?notes=Tasting%20request%3A%20...` in the URL (the Notes field itself won't visibly prefill
  until Task 3).

- [ ] **Step 6: Commit**

```bash
git add components/MenuList.tsx
git commit -m "$(cat <<'EOF'
Add tasting request selection to the menu

Selecting dishes surfaces a sticky bottom bar that links to /reservations
with the selection encoded into a notes query param, extending the page's
existing prefill pattern.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Notes field on both reservation forms + API acknowledgment

**Files:**
- Modify: `components/ReservationsPageForm.tsx`
- Modify: `components/ReservationTeaser.tsx`
- Modify: `app/api/reservations/route.ts`

**Interfaces:**
- Consumes: `notes` query param from `useSearchParams()` (Task 2 produces the URL that carries it).
- Produces: `notes: string` included in the `POST /api/reservations` body from both forms.

- [ ] **Step 1: Add the Notes field to `components/ReservationsPageForm.tsx`**

Add state, initialized from the query string, alongside the other fields:

```tsx
  const [name, setName] = useState(() => searchParams.get("name") || "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState(() => searchParams.get("notes") || "");
```

Include it in the POST body:

```tsx
        body: JSON.stringify({ date, time: selectedTime, displayTime: formatTime12(selectedTime), partySize, name, email, phone, notes }),
```

Add the textarea after the Email field and before the Available Times block:

```tsx
          <div style={{ marginBottom: 32, textAlign: "left" }}>
            <label htmlFor="res-notes" style={labelStyle}>NOTES / SPECIAL REQUESTS</label>
            <textarea
              id="res-notes"
              className="kn-input"
              rows={3}
              placeholder="Dietary needs, special occasions, tasting requests…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ resize: "vertical" }}
            />
          </div>
```

- [ ] **Step 2: Add the Notes field to `components/ReservationTeaser.tsx`**

Add state (no query-string prefill — the teaser isn't deep-linked into):

```tsx
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
```

Include it in the POST body:

```tsx
        body: JSON.stringify({
          date,
          time: selectedTime,
          displayTime: formatTime12(selectedTime),
          partySize,
          name,
          email,
          phone,
          notes,
        }),
```

Add the textarea after the Email field and before the Available Times block:

```tsx
      <div style={{ marginBottom: 28, textAlign: "left" }}>
        <label htmlFor="teaser-notes" style={labelStyle}>NOTES / SPECIAL REQUESTS</label>
        <textarea
          id="teaser-notes"
          name="notes"
          className="kn-input"
          rows={3}
          placeholder="Dietary needs, special occasions, tasting requests…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ resize: "vertical" }}
        />
      </div>
```

- [ ] **Step 3: Acknowledge notes in `app/api/reservations/route.ts`**

Change:

```tsx
  const { date, time, displayTime, partySize, name, email, phone } = body ?? {};
```

to:

```tsx
  const { date, time, displayTime, partySize, name, email, phone, notes } = body ?? {};
```

Change the confirmation response:

```tsx
  return NextResponse.json({
    confirmed: true,
    message: `Your table for ${partySize} on ${date} at ${displayTime ?? time} is confirmed. A confirmation email is on its way to ${email}.`,
  });
```

to:

```tsx
  const notesAck = typeof notes === "string" && notes.trim() ? ` We've noted your request: "${notes.trim()}."` : "";

  return NextResponse.json({
    confirmed: true,
    message: `Your table for ${partySize} on ${date} at ${displayTime ?? time} is confirmed. A confirmation email is on its way to ${email}.${notesAck}`,
  });
```

- [ ] **Step 4: Lint and build**

Run: `npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Manual check**

- From `/menu`, select 1–2 dishes, click "CONTINUE TO RESERVATION →" → on `/reservations`, the
  Notes textarea is prefilled with `Tasting request: <dish names>`.
- Submit a booking from `/reservations` with notes present → confirmation message includes the
  "We've noted your request" sentence.
- Submit a booking from the homepage teaser with the Notes field left empty → confirmation message
  has no notes sentence appended.
- Confirm neither Notes field shows a "Required" error or blocks submission when left empty.

- [ ] **Step 6: Commit**

```bash
git add components/ReservationsPageForm.tsx components/ReservationTeaser.tsx app/api/reservations/route.ts
git commit -m "$(cat <<'EOF'
Add optional Notes field to both reservation forms

Carries tasting requests from /menu through to a prefilled Notes field on
/reservations, and adds the same field to the homepage teaser for
parity. The mock API acknowledges notes in its confirmation message when
present; the field stays outside the required-field validation added
previously.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```
