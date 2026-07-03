import Nav from "@/components/Nav";
import Link from "next/link";

const courses = [
  {
    name: "Starters",
    dishes: [
      { name: "Miang Kham", subtitle: "Betel Leaf, Smoked Trout Roe, Lime Caviar", desc: "Cold-smoked roe folded into wild betel, brightened with beads of lime.", price: "$32", heat: 1 },
      { name: "Larb Neua Wagyu", subtitle: "Wagyu Larb, Toasted Rice, Wild Mint", desc: "Raw wagyu cut by hand, dusted in toasted rice, cooled with mint and chili.", price: "$38", heat: 2 },
      { name: "Som Tam Pu Ma", subtitle: "Green Papaya, Blue Crab, Peanut Dust", desc: "Shredded papaya bound with crab, sharpened by lime and crushed peanut.", price: "$34", heat: 2 },
      { name: "Goong Phao Nam Makham", subtitle: "Charcoal Prawn, Tamarind Caramel, Chili Salt", desc: "Whole prawn over open flame, lacquered in tamarind, finished with chili salt.", price: "$36", heat: 1 },
    ],
  },
  {
    name: "Soups",
    dishes: [
      { name: "Tom Yum Goong Mangkorn", subtitle: "Tom Yum, Maine Lobster, Kaffir Foam", desc: "Lobster in a broth of lemongrass and lime leaf, crowned with citrus foam.", price: "$42", heat: 3 },
      { name: "Tom Ped Kha", subtitle: "Duck Consommé, Galangal, Charred Shallot", desc: "A clear duck broth steeped overnight with galangal and blistered shallot.", price: "$34", heat: 0 },
      { name: "Tom Khamin Het Pa", subtitle: "Coconut Broth, Wild Mushroom, Turmeric Oil", desc: "Forest mushrooms in warm coconut, threaded with turmeric and white pepper.", price: "$30", heat: 1 },
      { name: "Tom Kha Fak Thong", subtitle: "Tom Kha, Heirloom Squash, Toasted Coconut", desc: "Roasted squash folded into coconut and galangal, finished with toasted shavings.", price: "$32", heat: 1 },
    ],
  },
  {
    name: "Curries",
    dishes: [
      { name: "Massaman Neua Wagyu", subtitle: "Massaman, Wagyu Short Rib, Cardamom", desc: "Short rib braised four hours in massaman spice, roasted peanut, cardamom.", price: "$48", heat: 1 },
      { name: "Gaeng Keow Wan Goong Mangkorn", subtitle: "Green Curry, Maine Lobster, Thai Basil", desc: "Lobster and baby eggplant in a curry green with basil and chili.", price: "$52", heat: 2 },
      { name: "Gaeng Pa Neua Kwang", subtitle: "Jungle Curry, Venison, Wild Peppercorn", desc: "Venison loin in a broth without coconut, fierce with green peppercorn.", price: "$46", heat: 3 },
      { name: "Panang Ped", subtitle: "Panang, Duck Breast, Kaffir Lime", desc: "Seared duck breast in a thickened panang, lifted by kaffir lime leaf.", price: "$44", heat: 2 },
    ],
  },
  {
    name: "Mains",
    dishes: [
      { name: "Wagyu Yang Jim Jaew", subtitle: "Charcoal Wagyu, Nam Jim Jaew, Sticky Rice Ash", desc: "Grilled wagyu striploin, smoked chili dip, sticky rice pressed into ash.", price: "$65", heat: 1 },
      { name: "Pla Turbot Khamin", subtitle: "Whole Turbot, Turmeric, Lemongrass Butter", desc: "Roasted turbot basted in turmeric and lemongrass, served whole at the table.", price: "$58", heat: 0 },
      { name: "Ped Yang Makham", subtitle: "Roast Duck, Tamarind Glaze, Pickled Plum", desc: "Duck roasted to order, lacquered in tamarind, cut with pickled plum.", price: "$48", heat: 0 },
      { name: "Pla Dam Sam Rot", subtitle: "Black Cod, Three-Flavor Sauce, Crisp Garlic", desc: "Marinated cod, sauced sweet-sour-spicy, finished with shards of fried garlic.", price: "$52", heat: 2 },
    ],
  },
  {
    name: "Desserts",
    dishes: [
      { name: "Khao Niao Mamuang", subtitle: "Mango, Sticky Rice, Coconut Ash", desc: "Mango cut ripe, warm sticky rice, coconut cream dusted with ash.", price: "$28", heat: 0 },
      { name: "Custard Cha Thai", subtitle: "Thai Tea Custard, Toasted Rice Crumble", desc: "Silken custard in the color of Thai tea, crumbled toasted rice.", price: "$30", heat: 0 },
      { name: "Sorbet Maphrao", subtitle: "Coconut Sorbet, Palm Sugar, Roasted Cashew", desc: "Coconut churned cold, palm sugar caramel, roasted cashew for crunch.", price: "$28", heat: 0 },
      { name: "Chocolate Makham Phrik", subtitle: "Dark Chocolate, Tamarind Caramel, Chili", desc: "Dark chocolate cut with tamarind caramel, a whisper of chili at the end.", price: "$32", heat: 1 },
    ],
  },
];

function Peppers({ heat }: { heat: number }) {
  if (!heat) return null;
  const label = heat >= 3 ? "VERY SPICY" : "SPICY";
  return (
    <span
      style={{
        marginLeft: 10,
        fontSize: 10,
        letterSpacing: "0.14em",
        fontWeight: 400,
        color: "#c2a06a",
        verticalAlign: "middle",
      }}
      title={`Spice level ${heat} of 3`}
    >
      {label}
    </span>
  );
}

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

      {courses.map((course, i) => (
        <div
          key={course.name}
          style={{ padding: `0 clamp(24px,6vw,96px) ${i === courses.length - 1 ? "clamp(96px,11vw,150px)" : "clamp(80px,9vw,120px)"}` }}
        >
          <div style={{ maxWidth: 840, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 36 }}>
              <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(26px,3vw,36px)", color: "#ece7de" }}>{course.name}</span>
              <span style={{ flex: 1, height: 1, background: "rgba(201,162,75,0.3)" }} />
            </div>

            {course.dishes.map((dish, di) => (
              <div
                key={dish.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "8px 24px",
                  alignItems: "center",
                  padding: "26px 0",
                  borderBottom: di === course.dishes.length - 1 ? "none" : "1px solid rgba(236,231,222,0.09)",
                }}
              >
                <div>
                  <div style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 19, marginBottom: 6 }}>
                    {dish.name}
                    <Peppers heat={dish.heat} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(236,231,222,0.42)", marginBottom: 6 }}>{dish.subtitle}</div>
                  <div style={{ fontSize: 14, fontWeight: 300, fontStyle: "italic", color: "rgba(236,231,222,0.6)", maxWidth: "56ch" }}>{dish.desc}</div>
                </div>
                <div style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 18, color: "#c2a06a" }}>{dish.price}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

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
