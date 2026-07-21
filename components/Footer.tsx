import Link from "next/link";

export default function Footer() {
  return (
    <div style={{ padding: "clamp(72px,8vw,110px) clamp(24px,6vw,96px) 40px" }}>
      <div
        className="kn-footer-grid"
        style={{
          maxWidth: 1360,
          margin: "0 auto",
          paddingBottom: 56,
          borderBottom: "1px solid rgba(236,231,222,0.1)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span style={{ width: 8, height: 8, background: "#c2a06a", transform: "rotate(45deg)", display: "inline-block" }} />
            <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 20, letterSpacing: "0.14em", color: "#ece7de" }}>KINNARI</span>
          </div>
          <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.8, color: "rgba(236,231,222,0.55)", maxWidth: "34ch", margin: 0 }}>
            A refined reimagining of Thai cuisine, in the heart of Aldermere Quarter.
          </p>
        </div>
        <div>
          <div style={{ fontSize: 11, letterSpacing: "0.16em", color: "#c2a06a", marginBottom: 18 }}>LOCATION &amp; HOURS</div>
          <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.9, color: "rgba(236,231,222,0.7)", margin: "0 0 16px" }}>
            12 Harrow Lane
            <br />
            Aldermere Quarter
          </p>
          <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.9, color: "rgba(236,231,222,0.7)", margin: 0 }}>
            Tuesday – Sunday
            <br />
            5:30 PM – 11:00 PM
            <br />
            Closed Monday
          </p>
        </div>
        <div>
          <div style={{ fontSize: 11, letterSpacing: "0.16em", color: "#c2a06a", marginBottom: 18 }}>CONTACT</div>
          <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.9, color: "rgba(236,231,222,0.7)", margin: "0 0 16px" }}>
            +1 (212) 555-0148
            <br />
            reservations@kinnari.com
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/#story" style={{ color: "rgba(236,231,222,0.6)", textDecoration: "none", fontSize: 12, letterSpacing: "0.1em" }}>STORY</Link>
            <Link href="/menu" style={{ color: "rgba(236,231,222,0.6)", textDecoration: "none", fontSize: 12, letterSpacing: "0.1em" }}>MENU</Link>
            <Link href="/#gallery" style={{ color: "rgba(236,231,222,0.6)", textDecoration: "none", fontSize: 12, letterSpacing: "0.1em" }}>GALLERY</Link>
            <Link href="/contact" style={{ color: "rgba(236,231,222,0.6)", textDecoration: "none", fontSize: 12, letterSpacing: "0.1em" }}>CONTACT</Link>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1360, margin: "24px auto 0", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontSize: 11, color: "rgba(236,231,222,0.35)" }}>© 2026 KINNARI. A concept.</span>
        <span style={{ fontSize: 11, color: "rgba(236,231,222,0.35)" }}>Aldermere Quarter</span>
      </div>
    </div>
  );
}
