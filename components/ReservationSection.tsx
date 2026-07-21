"use client";

import { useState } from "react";
import ReservationTeaser from "@/components/ReservationTeaser";

export default function ReservationSection() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <>
      {!confirmed && (
        <>
          <div style={{ fontSize: 12, letterSpacing: "0.28em", color: "#c2a06a", marginBottom: 20 }}>RESERVATIONS</div>
          <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 500, fontSize: "clamp(32px,4vw,50px)", margin: "0 0 18px", color: "#ece7de" }}>
            Reserve your table
          </h2>
          <p style={{ fontSize: 15, fontWeight: 300, color: "rgba(236,231,222,0.68)", margin: "0 0 52px", lineHeight: 1.7 }}>
            Dinner is served nightly by reservation. We recommend booking three weeks ahead.
          </p>
        </>
      )}

      <ReservationTeaser onConfirmed={() => setConfirmed(true)} />
    </>
  );
}
