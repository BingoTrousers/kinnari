"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const items = [
  { src: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80", caption: "Wagyu Yang Jim Jaew", height: 340, span: 3 },
  { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80", caption: "The dining room", height: 340, span: 3 },
  { src: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1000&q=80", caption: "Gaeng Keow Wan Goong Mangkorn", height: 280, span: 2 },
  { src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1400&q=80", caption: "The bar", height: 280, span: 2 },
  { src: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1000&q=80", caption: "Khao Niao Mamuang", height: 280, span: 2 },
];

export default function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (openIndex === null) {
      triggerRef.current?.focus();
      return;
    }

    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenIndex(null);
      } else if (e.key === "ArrowLeft") {
        setOpenIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
      } else if (e.key === "ArrowRight") {
        setOpenIndex((i) => (i === null ? null : (i + 1) % items.length));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openIndex]);

  return (
    <div id="gallery" style={{ padding: "0 clamp(24px,6vw,96px) clamp(96px,12vw,160px)", maxWidth: 1360, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "clamp(48px,6vw,72px)" }}>
        <div style={{ fontSize: 12, letterSpacing: "0.28em", color: "#c2a06a", marginBottom: 20 }}>GALLERY</div>
        <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 500, fontSize: "clamp(30px,3.6vw,46px)", margin: 0, color: "#ece7de" }}>
          An evening at KINNARI
        </h2>
      </div>
      <div className="kn-gallery-grid">
        {items.map((item, index) => (
          <button
            key={item.caption}
            onClick={(e) => {
              triggerRef.current = e.currentTarget;
              setOpenIndex(index);
            }}
            aria-label={`View larger image: ${item.caption}`}
            style={{
              height: item.height,
              gridColumn: `span ${item.span}`,
              position: "relative",
              overflow: "hidden",
              padding: 0,
              border: "none",
              cursor: "pointer",
              display: "block",
              width: "100%",
            }}
          >
            <Image
              src={item.src}
              alt={item.caption}
              fill
              loading="lazy"
              sizes={`(max-width: 760px) 100vw, ${(item.span / 6) * 100}vw`}
              style={{ objectFit: "cover" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,17,12,0.05), rgba(20,17,12,0.6))" }} />
            <span style={{ position: "absolute", left: 22, bottom: 18, fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: 17, color: "rgba(236,231,222,0.92)", letterSpacing: "0.02em" }}>
              {item.caption}
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenIndex(null);
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "rgba(15,12,8,0.92)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <button
            ref={closeButtonRef}
            onClick={() => setOpenIndex(null)}
            aria-label="Close"
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              background: "none",
              border: "1px solid rgba(236,231,222,0.3)",
              color: "rgba(236,231,222,0.8)",
              width: 40,
              height: 40,
              borderRadius: "50%",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            ✕
          </button>

          <button
            onClick={() => setOpenIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length))}
            aria-label="Previous image"
            style={{
              position: "absolute",
              left: "clamp(12px,4vw,40px)",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "rgba(236,231,222,0.7)",
              fontSize: 40,
              lineHeight: 1,
              cursor: "pointer",
              padding: 8,
            }}
          >
            ‹
          </button>
          <button
            onClick={() => setOpenIndex((i) => (i === null ? null : (i + 1) % items.length))}
            aria-label="Next image"
            style={{
              position: "absolute",
              right: "clamp(12px,4vw,40px)",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "rgba(236,231,222,0.7)",
              fontSize: 40,
              lineHeight: 1,
              cursor: "pointer",
              padding: 8,
            }}
          >
            ›
          </button>

          <div style={{ position: "relative", width: "min(92vw, 1100px)", height: "min(82vh, 720px)" }}>
            <Image
              src={items[openIndex].src}
              alt={items[openIndex].caption}
              fill
              sizes="92vw"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: 19, color: "rgba(236,231,222,0.92)" }}>
              {items[openIndex].caption}
            </div>
            <div style={{ marginTop: 8, fontSize: 12, letterSpacing: "0.1em", color: "rgba(236,231,222,0.5)" }}>
              {openIndex + 1} / {items.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
