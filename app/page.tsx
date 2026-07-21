import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import ReservationTeaser from "@/components/ReservationTeaser";

export default function Home() {
  return (
    <div style={{ background: "#17140f", color: "#ece7de", fontFamily: "var(--font-mulish), sans-serif", overflowX: "hidden" }}>
      <Nav />

      {/* HERO */}
      <div id="top" style={{ position: "relative", height: "100vh", minHeight: 640, width: "100%" }}>
        <Image
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2000&q=80"
          alt="A candlelit table set with wine glasses and plated dishes at KINNARI"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(23,20,15,0.68) 0%, rgba(23,20,15,0.58) 40%, rgba(23,20,15,0.93) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 60% 55% at 50% 48%, rgba(15,12,8,0.55) 0%, rgba(15,12,8,0) 70%)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 24px",
          }}
        >
          <div className="kn-fade-up" style={{ fontSize: 12, letterSpacing: "0.32em", color: "#e6d5ab", marginBottom: 22, animationDelay: "0.1s", textShadow: "0 2px 16px rgba(0,0,0,0.55)" }}>
            FINE THAI DINING
          </div>
          <div
            className="kn-fade-up"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontWeight: 500,
              fontSize: "clamp(64px,13vw,168px)",
              lineHeight: 0.95,
              letterSpacing: "0.01em",
              color: "#ece7de",
              animationDelay: "0.3s",
              textShadow: "0 4px 40px rgba(0,0,0,0.6), 0 2px 12px rgba(0,0,0,0.5)",
            }}
          >
            KINNARI
          </div>
          <div
            className="kn-fade-up"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(17px,2vw,22px)",
              color: "rgba(236,231,222,0.9)",
              marginTop: 26,
              animationDelay: "0.5s",
              textShadow: "0 2px 16px rgba(0,0,0,0.6)",
            }}
          >
            A refined reimagining of Thai cuisine.
          </div>
          <Link href="/reservations" className="kn-cta-solid kn-fade-up" style={{ marginTop: 48, animationDelay: "0.7s", textDecoration: "none", display: "inline-block" }}>
            RESERVE A TABLE
          </Link>
        </div>
        <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ width: 1, height: 44, background: "linear-gradient(180deg, rgba(236,231,222,0.5), transparent)" }} />
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(236,231,222,0.4)" }}>SCROLL</div>
        </div>
      </div>

      {/* OUR STORY */}
      <div id="story" style={{ padding: "clamp(96px,12vw,160px) clamp(24px,6vw,96px)", maxWidth: 1360, margin: "0 auto" }}>
        <div className="kn-story-grid">
          <div style={{ position: "relative", height: "clamp(360px,42vw,560px)", overflow: "hidden" }}>
            <Image
              src="https://images.unsplash.com/photo-1733758036781-91f32a366982?auto=format&fit=crop&w=1200&q=80"
              alt="A Thai street food vendor cooking at a market stall in Bangkok"
              fill
              loading="lazy"
              sizes="(max-width: 820px) 100vw, 45vw"
              style={{ objectFit: "cover" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,17,12,0.1), rgba(20,17,12,0.35))" }} />
          </div>
          <div>
            <div style={{ fontSize: 12, letterSpacing: "0.28em", color: "#c2a06a", marginBottom: 20 }}>OUR STORY</div>
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 500, fontSize: "clamp(32px,4vw,52px)", lineHeight: 1.08, margin: "0 0 32px", color: "#ece7de" }}>
              A recipe,
              <br />
              remembered.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.85, fontWeight: 300, color: "rgba(236,231,222,0.82)", margin: "0 0 22px", maxWidth: "52ch" }}>
              Chef Kessarin Boonyasit grew up in the wet markets of Thonburi, watching her grandmother pound curry paste by hand before dawn. She left Bangkok at nineteen — first for a stage in Copenhagen, then a decade moving through the world&apos;s most exacting kitchens — before returning home with a single conviction: that Thai food deserves the same precision as any three-star tasting menu.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.85, fontWeight: 300, color: "rgba(236,231,222,0.82)", margin: "0 0 34px", maxWidth: "52ch" }}>
              KINNARI is the result. Nothing here is invented for shock. Every dish begins with a recipe someone&apos;s mother once made, then is taken apart — texture by texture, flavor by flavor — and rebuilt with a chef&apos;s restraint. The five essential tastes remain. The volume is simply turned down, so each one can be heard.
            </p>
            <div style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: 18, color: "#c2a06a", borderLeft: "1px solid rgba(201,162,75,0.4)", paddingLeft: 20 }}>
              &quot;We are not modernizing Thai food. We are listening to it more closely.&quot;
            </div>
          </div>
        </div>
      </div>

      {/* GALLERY */}
      <Gallery />

      {/* RESERVATIONS TEASER */}
      <div
        id="reserve"
        style={{
          background: "linear-gradient(180deg,#231018,#1c0e14)",
          padding: "clamp(96px,12vw,150px) clamp(24px,6vw,96px)",
          borderTop: "1px solid rgba(201,162,75,0.14)",
          borderBottom: "1px solid rgba(201,162,75,0.14)",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.28em", color: "#c2a06a", marginBottom: 20 }}>RESERVATIONS</div>
          <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 500, fontSize: "clamp(32px,4vw,50px)", margin: "0 0 18px", color: "#ece7de" }}>
            Reserve your table
          </h2>
          <p style={{ fontSize: 15, fontWeight: 300, color: "rgba(236,231,222,0.68)", margin: "0 0 52px", lineHeight: 1.7 }}>
            Dinner is served nightly by reservation. We recommend booking three weeks ahead.
          </p>

          <ReservationTeaser />
        </div>
      </div>

      <Footer />
    </div>
  );
}
