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
