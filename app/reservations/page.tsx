import { Suspense } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ReservationsPageForm from "@/components/ReservationsPageForm";

export default function ReservationsPage() {
  return (
    <div style={{ background: "#17140f", color: "#ece7de", fontFamily: "var(--font-mulish), sans-serif", overflowX: "hidden", minHeight: "100vh" }}>
      <Nav />

      <div style={{ padding: "clamp(150px,16vw,200px) clamp(24px,6vw,96px) clamp(64px,8vw,96px)", textAlign: "center" }}>
        <div style={{ fontSize: 12, letterSpacing: "0.28em", color: "#c2a06a", marginBottom: 20 }}>RESERVATIONS</div>
        <h1 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 500, fontSize: "clamp(38px,6vw,64px)", margin: "0 0 18px", color: "#ece7de" }}>
          Reserve your table
        </h1>
        <p style={{ fontSize: 15, fontWeight: 300, color: "rgba(236,231,222,0.68)", margin: "0 auto", lineHeight: 1.7, maxWidth: "48ch" }}>
          Dinner is served nightly by reservation. We recommend booking three weeks ahead.
        </p>
      </div>

      <div style={{ padding: "0 clamp(24px,6vw,96px) clamp(96px,11vw,150px)" }}>
        <Suspense fallback={null}>
          <ReservationsPageForm />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
