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
