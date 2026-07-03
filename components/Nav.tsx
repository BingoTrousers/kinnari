"use client";

import { useState } from "react";
import Link from "next/link";

const linkStyle: React.CSSProperties = {
  color: "rgba(236,231,222,0.75)",
  textDecoration: "none",
  fontSize: 12,
  letterSpacing: "0.14em",
  fontWeight: 400,
};

const mobileLinkStyle: React.CSSProperties = {
  color: "#ece7de",
  textDecoration: "none",
  fontFamily: "var(--font-cormorant), serif",
  fontSize: 24,
  letterSpacing: "0.05em",
};

export default function Nav({ active }: { active?: "menu" }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px clamp(24px,6vw,64px)",
          background: "rgba(23,20,15,0.55)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(201,162,75,0.14)",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <span style={{ width: 8, height: 8, background: "#c2a06a", transform: "rotate(45deg)", display: "inline-block" }} />
          <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 19, letterSpacing: "0.14em", color: "#ece7de" }}>KINNARI</span>
        </Link>
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
        <button
          className="kn-burger"
          onClick={() => setNavOpen((v) => !v)}
          aria-label={navOpen ? "Close menu" : "Open menu"}
          aria-expanded={navOpen}
          aria-controls="kn-mobile-panel"
          style={{
            background: "none",
            border: "none",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
            cursor: "pointer",
            width: 44,
            height: 44,
            padding: 0,
            marginRight: -11,
          }}
        >
          <span
            style={{
              width: 22,
              height: 1,
              background: "#ece7de",
              transition: "transform 0.25s ease, opacity 0.2s ease",
              transform: navOpen ? "translateY(3px) rotate(45deg)" : "none",
            }}
          />
          <span
            style={{
              width: 22,
              height: 1,
              background: "#ece7de",
              transition: "transform 0.25s ease, opacity 0.2s ease",
              transform: navOpen ? "translateY(-3px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </nav>

      {navOpen && (
        <div
          id="kn-mobile-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="kn-mobile-panel open"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 49,
            background: "#17140f",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 36,
          }}
        >
          <Link href="/#story" onClick={() => setNavOpen(false)} style={mobileLinkStyle}>Our Story</Link>
          <Link href="/menu" onClick={() => setNavOpen(false)} style={mobileLinkStyle}>Menu</Link>
          <Link href="/#gallery" onClick={() => setNavOpen(false)} style={mobileLinkStyle}>Gallery</Link>
          <Link href="/reservations" onClick={() => setNavOpen(false)} style={{ ...mobileLinkStyle, color: "#c2a06a" }}>Reservations</Link>
          <button
            onClick={() => setNavOpen(false)}
            aria-label="Close menu"
            style={{
              marginTop: 20,
              background: "none",
              border: "1px solid rgba(236,231,222,0.3)",
              color: "rgba(236,231,222,0.6)",
              fontSize: 11,
              letterSpacing: "0.14em",
              padding: "10px 26px",
              borderRadius: 40,
              cursor: "pointer",
            }}
          >
            CLOSE
          </button>
        </div>
      )}
    </>
  );
}
