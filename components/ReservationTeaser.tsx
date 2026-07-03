"use client";

import { useEffect, useState } from "react";

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

export default function ReservationTeaser() {
  const [date, setDate] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ confirmed: boolean; message: string } | null>(null);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      setSelectedTime(null);
      return;
    }

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
        body: JSON.stringify({
          date,
          time: selectedTime,
          displayTime: formatTime12(selectedTime),
          partySize,
          name,
          email,
          phone,
        }),
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

  const formValid = date && selectedTime && name.trim() && email.trim() && phone.trim();

  if (result?.confirmed) {
    return (
      <div style={{ padding: 40, border: "1px solid rgba(201,162,75,0.35)", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: 22, color: "#e6d5ab", marginBottom: 14 }}>
          Thank you, {name.split(" ")[0]}.
        </div>
        <p style={{ fontSize: 15, fontWeight: 300, color: "rgba(236,231,222,0.82)", lineHeight: 1.7, margin: 0 }}>{result.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="kn-res-row" style={{ marginBottom: 28, textAlign: "left" }}>
        <div>
          <label htmlFor="teaser-date" style={labelStyle}>DATE</label>
          <input
            id="teaser-date"
            name="date"
            className="kn-input"
            type="date"
            min={todayISO()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="teaser-party" style={labelStyle}>PARTY SIZE</label>
          <input
            id="teaser-party"
            name="partySize"
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
          <label htmlFor="teaser-name" style={labelStyle}>NAME</label>
          <input
            id="teaser-name"
            name="name"
            className="kn-input"
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="teaser-phone" style={labelStyle}>PHONE</label>
          <input
            id="teaser-phone"
            name="phone"
            className="kn-input"
            type="tel"
            placeholder="(212) 555-0148"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
      </div>

      <div style={{ marginBottom: 28, textAlign: "left" }}>
        <label htmlFor="teaser-email" style={labelStyle}>EMAIL</label>
        <input
          id="teaser-email"
          name="email"
          className="kn-input"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {date && (
        <div style={{ marginBottom: 28, textAlign: "left" }}>
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
      )}

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
  );
}
