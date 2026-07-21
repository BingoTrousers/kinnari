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
