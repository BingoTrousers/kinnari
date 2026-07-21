"use client";

import { useState } from "react";
import Link from "next/link";

const mobileLinkStyle: React.CSSProperties = {
  color: "#ece7de",
  textDecoration: "none",
  fontFamily: "var(--font-cormorant), serif",
  fontSize: 24,
  letterSpacing: "0.05em",
};

export default function MobileNavToggle() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
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
          <Link href="/contact" onClick={() => setNavOpen(false)} style={mobileLinkStyle}>Contact</Link>
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
