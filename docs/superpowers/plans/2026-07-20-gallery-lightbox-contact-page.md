# Gallery Lightbox + Contact Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a click-through lightbox to the homepage gallery, and a new standalone `/contact` page, reachable from Nav (desktop + mobile) and Footer.

**Architecture:** Extract the homepage gallery into a self-contained client component (`components/Gallery.tsx`) that owns its own lightbox state (open index, keyboard nav, body-scroll lock). Add a new server-component route (`app/contact/page.tsx`) styled like the existing `/menu` page, reusing the Footer's existing address/hours/contact copy and the `.kn-footer-grid` / `.kn-cta` CSS classes. Widen `Nav`'s `active` prop and add matching links in `Nav.tsx`, `MobileNavToggle.tsx`, and `Footer.tsx`.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, inline `style={{}}` objects, shared `kn-*` classes in `app/globals.css`. No test framework is configured in this project (`package.json` has no `jest`/`vitest`/testing-library) — verification is `npm run lint`, `npm run build`, and manual checks against the running dev server.

## Global Constraints

- Styling is inline `style={{}}` objects; reuse existing `kn-*` classes from `app/globals.css` instead of adding new inline breakpoints.
- All content images go through `next/image`; below-the-fold images use `loading="lazy"`.
- `components/Nav.tsx` and `components/Footer.tsx` are shared across all pages — edit there, don't duplicate markup per-page.
- No map, no contact form, no new API route, no invented details beyond what's already in `Footer.tsx` (per the approved spec).
- `npm run lint` and `npm run build` must pass after each task.

---

### Task 1: Gallery lightbox

**Files:**
- Create: `components/Gallery.tsx`
- Modify: `app/page.tsx:1-6` (imports), `app/page.tsx:127-159` (inline gallery block → `<Gallery />`)

**Interfaces:**
- Produces: `components/Gallery.tsx` default-exports `Gallery`, a client component with no props. It renders the `id="gallery"` section (heading + `.kn-gallery-grid`) exactly as today, plus a lightbox overlay.

- [ ] **Step 1: Create `components/Gallery.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const items = [
  { src: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80", caption: "Wagyu Yang Jim Jaew", height: 340, span: 3 },
  { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80", caption: "The dining room", height: 340, span: 3 },
  { src: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1000&q=80", caption: "Gaeng Keow Wan Goong Mangkorn", height: 280, span: 2 },
  { src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1400&q=80", caption: "The bar", height: 280, span: 2 },
  { src: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1000&q=80", caption: "Khao Niao Mamuang", height: 280, span: 2 },
];

export default function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;

    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenIndex(null);
      } else if (e.key === "ArrowLeft") {
        setOpenIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
      } else if (e.key === "ArrowRight") {
        setOpenIndex((i) => (i === null ? null : (i + 1) % items.length));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openIndex]);

  return (
    <div id="gallery" style={{ padding: "0 clamp(24px,6vw,96px) clamp(96px,12vw,160px)", maxWidth: 1360, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "clamp(48px,6vw,72px)" }}>
        <div style={{ fontSize: 12, letterSpacing: "0.28em", color: "#c2a06a", marginBottom: 20 }}>GALLERY</div>
        <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 500, fontSize: "clamp(30px,3.6vw,46px)", margin: 0, color: "#ece7de" }}>
          An evening at KINNARI
        </h2>
      </div>
      <div className="kn-gallery-grid">
        {items.map((item, index) => (
          <button
            key={item.caption}
            onClick={() => setOpenIndex(index)}
            aria-label={`View larger image: ${item.caption}`}
            style={{
              height: item.height,
              gridColumn: `span ${item.span}`,
              position: "relative",
              overflow: "hidden",
              padding: 0,
              border: "none",
              cursor: "pointer",
              display: "block",
              width: "100%",
            }}
          >
            <Image
              src={item.src}
              alt={item.caption}
              fill
              loading="lazy"
              sizes={`(max-width: 760px) 100vw, ${(item.span / 6) * 100}vw`}
              style={{ objectFit: "cover" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,17,12,0.05), rgba(20,17,12,0.6))" }} />
            <span style={{ position: "absolute", left: 22, bottom: 18, fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: 17, color: "rgba(236,231,222,0.92)", letterSpacing: "0.02em" }}>
              {item.caption}
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenIndex(null);
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "rgba(15,12,8,0.92)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <button
            onClick={() => setOpenIndex(null)}
            aria-label="Close"
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              background: "none",
              border: "1px solid rgba(236,231,222,0.3)",
              color: "rgba(236,231,222,0.8)",
              width: 40,
              height: 40,
              borderRadius: "50%",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            ✕
          </button>

          <button
            onClick={() => setOpenIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length))}
            aria-label="Previous image"
            style={{
              position: "absolute",
              left: "clamp(12px,4vw,40px)",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "rgba(236,231,222,0.7)",
              fontSize: 40,
              lineHeight: 1,
              cursor: "pointer",
              padding: 8,
            }}
          >
            ‹
          </button>
          <button
            onClick={() => setOpenIndex((i) => (i === null ? null : (i + 1) % items.length))}
            aria-label="Next image"
            style={{
              position: "absolute",
              right: "clamp(12px,4vw,40px)",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "rgba(236,231,222,0.7)",
              fontSize: 40,
              lineHeight: 1,
              cursor: "pointer",
              padding: 8,
            }}
          >
            ›
          </button>

          <div style={{ position: "relative", width: "min(92vw, 1100px)", height: "min(82vh, 720px)" }}>
            <Image
              src={items[openIndex].src}
              alt={items[openIndex].caption}
              fill
              sizes="92vw"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: 19, color: "rgba(236,231,222,0.92)" }}>
              {items[openIndex].caption}
            </div>
            <div style={{ marginTop: 8, fontSize: 12, letterSpacing: "0.1em", color: "rgba(236,231,222,0.5)" }}>
              {openIndex + 1} / {items.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Replace the inline gallery block in `app/page.tsx`**

Add the import near the top (with the other component imports):

```tsx
import Gallery from "@/components/Gallery";
```

Replace the entire `{/* GALLERY */}` block (currently `app/page.tsx:127-159`, from `<div id="gallery" ...>` through its closing `</div>`) with:

```tsx
<Gallery />
```

- [ ] **Step 3: Lint and build**

Run: `npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds, `/` route compiles.

- [ ] **Step 4: Manual check**

With the dev server running, open `http://localhost:3000/#gallery`:
- Click an image → lightbox opens on that image, caption + counter shown.
- Click ‹ / › → navigates, wraps around at both ends.
- Press `ArrowLeft` / `ArrowRight` → same navigation.
- Press `Escape`, click the backdrop, and click ✕ → each closes it.
- Background does not scroll while the lightbox is open.

- [ ] **Step 5: Commit**

```bash
git add components/Gallery.tsx app/page.tsx
git commit -m "$(cat <<'EOF'
Add lightbox to homepage gallery

Extracts the gallery section into a self-contained client component so
clicking an image opens it full-size with prev/next navigation, matching
the design spec.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Nav wiring for `/contact`

**Files:**
- Modify: `components/Nav.tsx:12` (widen `active` prop), `components/Nav.tsx:35-54` (add CONTACT link)
- Modify: `components/MobileNavToggle.tsx:81-84` (add Contact link)
- Modify: `components/Footer.tsx:46-50` (add CONTACT link)

**Interfaces:**
- Produces: `Nav`'s `active` prop type becomes `"menu" | "contact"`, consumed by Task 3's `app/contact/page.tsx` as `<Nav active="contact" />`.

- [ ] **Step 1: Widen the `active` prop and add the desktop link in `components/Nav.tsx`**

Change line 12 from:

```tsx
export default function Nav({ active }: { active?: "menu" }) {
```

to:

```tsx
export default function Nav({ active }: { active?: "menu" | "contact" }) {
```

Change the `kn-links` block (currently lines 35-54):

```tsx
      <div className="kn-links">
        <Link href="/#story" style={linkStyle}>OUR STORY</Link>
        <Link href="/menu" style={active === "menu" ? { ...linkStyle, color: "#e6d5ab" } : linkStyle}>MENU</Link>
        <Link href="/#gallery" style={linkStyle}>GALLERY</Link>
        <Link
          href="/reservations"
          style={{
            color: "#17140f",
            background: "#c2a06a",
            textDecoration: "none",
            fontSize: 12,
            letterSpacing: "0.12em",
            fontWeight: 500,
            padding: "11px 26px",
            borderRadius: 40,
          }}
        >
          RESERVATIONS
        </Link>
      </div>
```

to:

```tsx
      <div className="kn-links">
        <Link href="/#story" style={linkStyle}>OUR STORY</Link>
        <Link href="/menu" style={active === "menu" ? { ...linkStyle, color: "#e6d5ab" } : linkStyle}>MENU</Link>
        <Link href="/#gallery" style={linkStyle}>GALLERY</Link>
        <Link href="/contact" style={active === "contact" ? { ...linkStyle, color: "#e6d5ab" } : linkStyle}>CONTACT</Link>
        <Link
          href="/reservations"
          style={{
            color: "#17140f",
            background: "#c2a06a",
            textDecoration: "none",
            fontSize: 12,
            letterSpacing: "0.12em",
            fontWeight: 500,
            padding: "11px 26px",
            borderRadius: 40,
          }}
        >
          RESERVATIONS
        </Link>
      </div>
```

- [ ] **Step 2: Add the mobile link in `components/MobileNavToggle.tsx`**

Change (currently lines 81-84):

```tsx
          <Link href="/#story" onClick={() => setNavOpen(false)} style={mobileLinkStyle}>Our Story</Link>
          <Link href="/menu" onClick={() => setNavOpen(false)} style={mobileLinkStyle}>Menu</Link>
          <Link href="/#gallery" onClick={() => setNavOpen(false)} style={mobileLinkStyle}>Gallery</Link>
          <Link href="/reservations" onClick={() => setNavOpen(false)} style={{ ...mobileLinkStyle, color: "#c2a06a" }}>Reservations</Link>
```

to:

```tsx
          <Link href="/#story" onClick={() => setNavOpen(false)} style={mobileLinkStyle}>Our Story</Link>
          <Link href="/menu" onClick={() => setNavOpen(false)} style={mobileLinkStyle}>Menu</Link>
          <Link href="/#gallery" onClick={() => setNavOpen(false)} style={mobileLinkStyle}>Gallery</Link>
          <Link href="/contact" onClick={() => setNavOpen(false)} style={mobileLinkStyle}>Contact</Link>
          <Link href="/reservations" onClick={() => setNavOpen(false)} style={{ ...mobileLinkStyle, color: "#c2a06a" }}>Reservations</Link>
```

- [ ] **Step 3: Add the link in `components/Footer.tsx`**

Change (currently lines 46-50):

```tsx
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/#story" style={{ color: "rgba(236,231,222,0.6)", textDecoration: "none", fontSize: 12, letterSpacing: "0.1em" }}>STORY</Link>
            <Link href="/menu" style={{ color: "rgba(236,231,222,0.6)", textDecoration: "none", fontSize: 12, letterSpacing: "0.1em" }}>MENU</Link>
            <Link href="/#gallery" style={{ color: "rgba(236,231,222,0.6)", textDecoration: "none", fontSize: 12, letterSpacing: "0.1em" }}>GALLERY</Link>
          </div>
```

to:

```tsx
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/#story" style={{ color: "rgba(236,231,222,0.6)", textDecoration: "none", fontSize: 12, letterSpacing: "0.1em" }}>STORY</Link>
            <Link href="/menu" style={{ color: "rgba(236,231,222,0.6)", textDecoration: "none", fontSize: 12, letterSpacing: "0.1em" }}>MENU</Link>
            <Link href="/#gallery" style={{ color: "rgba(236,231,222,0.6)", textDecoration: "none", fontSize: 12, letterSpacing: "0.1em" }}>GALLERY</Link>
            <Link href="/contact" style={{ color: "rgba(236,231,222,0.6)", textDecoration: "none", fontSize: 12, letterSpacing: "0.1em" }}>CONTACT</Link>
          </div>
```

- [ ] **Step 4: Lint and build**

Run: `npm run lint`
Expected: no errors (note: `app/contact/page.tsx` doesn't exist until Task 3, so the new `/contact` links are dangling until then — this is expected and not a lint error, since Next.js `Link` doesn't validate route existence at lint/build time).

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add components/Nav.tsx components/MobileNavToggle.tsx components/Footer.tsx
git commit -m "$(cat <<'EOF'
Wire up Contact nav links ahead of the new page

Widens Nav's active prop and adds CONTACT links in the desktop nav, mobile
panel, and footer so /contact (added next) is reachable everywhere the
other pages are.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Contact page

**Files:**
- Create: `app/contact/page.tsx`

**Interfaces:**
- Consumes: `Nav` from `@/components/Nav` with `active="contact"` (Task 2), `Footer` from `@/components/Footer`, `.kn-footer-grid` and `.kn-cta` classes from `app/globals.css`.

- [ ] **Step 1: Create `app/contact/page.tsx`**

```tsx
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <div style={{ background: "#17140f", color: "#ece7de", fontFamily: "var(--font-mulish), sans-serif", overflowX: "hidden" }}>
      <Nav active="contact" />

      {/* HEADER */}
      <div style={{ padding: "clamp(150px,18vw,220px) clamp(24px,6vw,96px) clamp(64px,8vw,96px)", textAlign: "center" }}>
        <div style={{ fontSize: 12, letterSpacing: "0.28em", color: "#c2a06a", marginBottom: 20 }}>VISIT US</div>
        <h1 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 500, fontSize: "clamp(44px,7vw,84px)", margin: "0 0 22px", color: "#ece7de" }}>KINNARI</h1>
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "clamp(16px,1.8vw,20px)", color: "rgba(236,231,222,0.7)", maxWidth: "46ch", margin: "0 auto" }}>
          In the heart of Aldermere Quarter. We look forward to welcoming you to the table.
        </p>
      </div>

      {/* INFO */}
      <div style={{ padding: "0 clamp(24px,6vw,96px) clamp(96px,11vw,150px)" }}>
        <div className="kn-footer-grid" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.16em", color: "#c2a06a", marginBottom: 18 }}>LOCATION &amp; HOURS</div>
            <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.9, color: "rgba(236,231,222,0.8)", margin: "0 0 16px" }}>
              12 Harrow Lane
              <br />
              Aldermere Quarter
            </p>
            <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.9, color: "rgba(236,231,222,0.8)", margin: 0 }}>
              Tuesday – Sunday
              <br />
              5:30 PM – 11:00 PM
              <br />
              Closed Monday
            </p>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.16em", color: "#c2a06a", marginBottom: 18 }}>CONTACT</div>
            <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.9, color: "rgba(236,231,222,0.8)", margin: 0 }}>
              +1 (212) 555-0148
              <br />
              reservations@kinnari.com
            </p>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.16em", color: "#c2a06a", marginBottom: 18 }}>RESERVATIONS</div>
            <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.9, color: "rgba(236,231,222,0.8)", margin: "0 0 24px" }}>
              Dinner is served nightly by reservation.
            </p>
            <Link href="/reservations" className="kn-cta">RESERVE A TABLE</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Lint and build**

Run: `npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds, `/contact` appears as a static route in the build output.

- [ ] **Step 3: Manual check**

With the dev server running:
- Visit `http://localhost:3000/contact` directly → page renders with header, three info columns, and a working `RESERVE A TABLE` button.
- From `/`, `/menu`, and `/reservations`, click `CONTACT` in the desktop nav → lands on `/contact` with `CONTACT` highlighted gold.
- At a mobile width (<860px), open the burger menu → `Contact` link is present and works.
- Footer `CONTACT` link works from any page.

- [ ] **Step 4: Commit**

```bash
git add app/contact/page.tsx
git commit -m "$(cat <<'EOF'
Add standalone /contact page

Reuses the Footer's existing location/hours/contact copy in a full-page
layout matching the /menu page's structure, per the approved design spec.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```
