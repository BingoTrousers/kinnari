import Link from "next/link";
import MobileNavToggle from "@/components/MobileNavToggle";

const linkStyle: React.CSSProperties = {
  color: "rgba(236,231,222,0.75)",
  textDecoration: "none",
  fontSize: 12,
  letterSpacing: "0.14em",
  fontWeight: 400,
};

export default function Nav({ active }: { active?: "menu" }) {
  return (
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
      <MobileNavToggle />
    </nav>
  );
}
