import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ReservationsPageContent from "@/components/ReservationsPageContent";

export default function ReservationsPage() {
  return (
    <div style={{ background: "#17140f", color: "#ece7de", fontFamily: "var(--font-mulish), sans-serif", overflowX: "hidden", minHeight: "100vh" }}>
      <Nav />

      <ReservationsPageContent />

      <Footer />
    </div>
  );
}
