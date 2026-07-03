"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

type Slot = { time: string; available: boolean };

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 10,
  letterSpacing: "0.14em",
  color: "rgba(236,231,222,0.5)",
  marginBottom: 8,
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatTime12(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

function ReservationsForm() {
  const searchParams = useSearchParams();

  const [date, setDate] = useState(() => searchParams.get("date") || todayISO());
  const [partySize, setPartySize] = useState(() => {
    const fromQuery = parseInt(searchParams.get("partySize") || "", 10);
    return Number.isFinite(fromQuery) && fromQuery >= 1 && fromQuery <= 12 ? fromQuery : 2;
  });
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [name, setName] = useState(() => searchParams.get("name") || "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ confirmed: boolean; message: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setSlotsLoading(true);
    setSelectedTime(null);
    setResult(null);

    fetch(`/api/reservations/availability?date=${encodeURIComponent(date)}&partySize=${partySize}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setSlots(data.slots ?? []);
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [date, partySize]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTime) return;

    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time: selectedTime, displayTime: formatTime12(selectedTime), partySize, name, email, phone }),
      });
      const data = await res.json();
      setResult(data);
      if (data.confirmed) {
        setSlots((prev) => prev.map((s) => (s.time === selectedTime ? { ...s, available: false } : s)));
        setSelectedTime(null);
      }
    } catch {
      setResult({ confirmed: false, message: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  const formValid = selectedTime && name.trim() && email.trim() && phone.trim();

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
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          {result?.confirmed ? (
            <div style={{ padding: 40, border: "1px solid rgba(201,162,75,0.35)", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: 22, color: "#e6d5ab", marginBottom: 14 }}>
                Thank you, {name.split(" ")[0]}.
              </div>
              <p style={{ fontSize: 15, fontWeight: 300, color: "rgba(236,231,222,0.82)", lineHeight: 1.7, margin: 0 }}>{result.message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="kn-res-row" style={{ marginBottom: 32, textAlign: "left" }}>
                <div>
                  <label style={labelStyle}>DATE</label>
                  <input
                    className="kn-input"
                    type="date"
                    value={date}
                    min={todayISO()}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>PARTY SIZE</label>
                  <input
                    className="kn-input"
                    type="number"
                    min={1}
                    max={12}
                    value={partySize}
                    onChange={(e) => setPartySize(Math.min(12, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>NAME</label>
                  <input className="kn-input" type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label style={labelStyle}>PHONE</label>
                  <input className="kn-input" type="tel" placeholder="(212) 555-0148" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
              </div>

              <div style={{ marginBottom: 32, textAlign: "left" }}>
                <label style={labelStyle}>EMAIL</label>
                <input className="kn-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div style={{ marginBottom: 32, textAlign: "left" }}>
                <label style={labelStyle}>AVAILABLE TIMES</label>
                {slotsLoading ? (
                  <div style={{ fontSize: 14, color: "rgba(236,231,222,0.5)", padding: "14px 0" }}>Checking availability…</div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 10 }}>
                    {slots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        className={`kn-slot${selectedTime === slot.time ? " selected" : ""}`}
                        onClick={() => setSelectedTime(slot.time)}
                      >
                        {formatTime12(slot.time)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {result && !result.confirmed && (
                <div style={{ marginBottom: 24, padding: "14px 18px", border: "1px solid rgba(201,90,75,0.4)", color: "#e6b8ab", fontSize: 14, textAlign: "left" }}>
                  {result.message}
                </div>
              )}

              <button type="submit" className="kn-cta-solid" disabled={!formValid || submitting} style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                {submitting && <span className="kn-spinner" />}
                {submitting ? "CONFIRMING…" : "REQUEST A TABLE"}
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ReservationsPage() {
  return (
    <Suspense fallback={null}>
      <ReservationsForm />
    </Suspense>
  );
}
