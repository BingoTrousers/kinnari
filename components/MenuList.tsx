"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const TAGS = ["vegetarian", "vegan", "gluten-free", "shellfish", "nuts"] as const;
type Tag = (typeof TAGS)[number];

const TAG_LABELS: Record<Tag, string> = {
  vegetarian: "VEGETARIAN",
  vegan: "VEGAN",
  "gluten-free": "GF",
  shellfish: "SHELLFISH",
  nuts: "NUTS",
};

const courses = [
  {
    name: "Starters",
    dishes: [
      { name: "Miang Kham", subtitle: "Betel Leaf, Smoked Trout Roe, Lime Caviar", desc: "Cold-smoked roe folded into wild betel, brightened with beads of lime.", price: "$32", heat: 1, tags: ["gluten-free"] as Tag[] },
      { name: "Larb Neua Wagyu", subtitle: "Wagyu Larb, Toasted Rice, Wild Mint", desc: "Raw wagyu cut by hand, dusted in toasted rice, cooled with mint and chili.", price: "$38", heat: 2, tags: ["gluten-free"] as Tag[] },
      { name: "Som Tam Pu Ma", subtitle: "Green Papaya, Blue Crab, Peanut Dust", desc: "Shredded papaya bound with crab, sharpened by lime and crushed peanut.", price: "$34", heat: 2, tags: ["shellfish", "nuts", "gluten-free"] as Tag[] },
      { name: "Goong Phao Nam Makham", subtitle: "Charcoal Prawn, Tamarind Caramel, Chili Salt", desc: "Whole prawn over open flame, lacquered in tamarind, finished with chili salt.", price: "$36", heat: 1, tags: ["shellfish", "gluten-free"] as Tag[] },
    ],
  },
  {
    name: "Soups",
    dishes: [
      { name: "Tom Yum Goong Mangkorn", subtitle: "Tom Yum, Maine Lobster, Kaffir Foam", desc: "Lobster in a broth of lemongrass and lime leaf, crowned with citrus foam.", price: "$42", heat: 3, tags: ["shellfish", "gluten-free"] as Tag[] },
      { name: "Tom Ped Kha", subtitle: "Duck Consommé, Galangal, Charred Shallot", desc: "A clear duck broth steeped overnight with galangal and blistered shallot.", price: "$34", heat: 0, tags: ["gluten-free"] as Tag[] },
      { name: "Tom Khamin Het Pa", subtitle: "Coconut Broth, Wild Mushroom, Turmeric Oil", desc: "Forest mushrooms in warm coconut, threaded with turmeric and white pepper.", price: "$30", heat: 1, tags: ["vegan", "vegetarian", "gluten-free"] as Tag[] },
      { name: "Tom Kha Fak Thong", subtitle: "Tom Kha, Heirloom Squash, Toasted Coconut", desc: "Roasted squash folded into coconut and galangal, finished with toasted shavings.", price: "$32", heat: 1, tags: ["vegan", "vegetarian", "gluten-free"] as Tag[] },
    ],
  },
  {
    name: "Curries",
    dishes: [
      { name: "Massaman Neua Wagyu", subtitle: "Massaman, Wagyu Short Rib, Cardamom", desc: "Short rib braised four hours in massaman spice, roasted peanut, cardamom.", price: "$48", heat: 1, tags: ["nuts", "gluten-free"] as Tag[] },
      { name: "Gaeng Keow Wan Goong Mangkorn", subtitle: "Green Curry, Maine Lobster, Thai Basil", desc: "Lobster and baby eggplant in a curry green with basil and chili.", price: "$52", heat: 2, tags: ["shellfish", "gluten-free"] as Tag[] },
      { name: "Gaeng Pa Neua Kwang", subtitle: "Jungle Curry, Venison, Wild Peppercorn", desc: "Venison loin in a broth without coconut, fierce with green peppercorn.", price: "$46", heat: 3, tags: ["gluten-free"] as Tag[] },
      { name: "Panang Ped", subtitle: "Panang, Duck Breast, Kaffir Lime", desc: "Seared duck breast in a thickened panang, lifted by kaffir lime leaf.", price: "$44", heat: 2, tags: ["gluten-free"] as Tag[] },
    ],
  },
  {
    name: "Mains",
    dishes: [
      { name: "Wagyu Yang Jim Jaew", subtitle: "Charcoal Wagyu, Nam Jim Jaew, Sticky Rice Ash", desc: "Grilled wagyu striploin, smoked chili dip, sticky rice pressed into ash.", price: "$65", heat: 1, tags: ["gluten-free"] as Tag[] },
      { name: "Pla Turbot Khamin", subtitle: "Whole Turbot, Turmeric, Lemongrass Butter", desc: "Roasted turbot basted in turmeric and lemongrass, served whole at the table.", price: "$58", heat: 0, tags: ["gluten-free"] as Tag[] },
      { name: "Ped Yang Makham", subtitle: "Roast Duck, Tamarind Glaze, Pickled Plum", desc: "Duck roasted to order, lacquered in tamarind, cut with pickled plum.", price: "$48", heat: 0, tags: ["gluten-free"] as Tag[] },
      { name: "Pla Dam Sam Rot", subtitle: "Black Cod, Three-Flavor Sauce, Crisp Garlic", desc: "Marinated cod, sauced sweet-sour-spicy, finished with shards of fried garlic.", price: "$52", heat: 2, tags: ["gluten-free"] as Tag[] },
    ],
  },
  {
    name: "Desserts",
    dishes: [
      { name: "Khao Niao Mamuang", subtitle: "Mango, Sticky Rice, Coconut Ash", desc: "Mango cut ripe, warm sticky rice, coconut cream dusted with ash.", price: "$28", heat: 0, tags: ["vegan", "vegetarian", "gluten-free"] as Tag[] },
      { name: "Custard Cha Thai", subtitle: "Thai Tea Custard, Toasted Rice Crumble", desc: "Silken custard in the color of Thai tea, crumbled toasted rice.", price: "$30", heat: 0, tags: ["vegetarian", "gluten-free"] as Tag[] },
      { name: "Sorbet Maphrao", subtitle: "Coconut Sorbet, Palm Sugar, Roasted Cashew", desc: "Coconut churned cold, palm sugar caramel, roasted cashew for crunch.", price: "$28", heat: 0, tags: ["vegan", "vegetarian", "nuts", "gluten-free"] as Tag[] },
      { name: "Chocolate Makham Phrik", subtitle: "Dark Chocolate, Tamarind Caramel, Chili", desc: "Dark chocolate cut with tamarind caramel, a whisper of chili at the end.", price: "$32", heat: 1, tags: ["vegetarian", "gluten-free"] as Tag[] },
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

function filterButtonStyle(active: boolean): React.CSSProperties {
  return {
    background: "none",
    border: "none",
    borderBottom: active ? "1px solid #c2a06a" : "1px solid transparent",
    padding: "2px 1px 4px",
    fontSize: 10,
    letterSpacing: "0.1em",
    fontFamily: "var(--font-mulish), sans-serif",
    fontWeight: 400,
    color: active ? "#e6d5ab" : "rgba(236,231,222,0.45)",
    cursor: "pointer",
    transition: "color 0.2s, border-color 0.2s",
  };
}

function DishTags({ tags }: { tags: Tag[] }) {
  return (
    <>
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            marginLeft: 10,
            fontSize: 10,
            letterSpacing: "0.14em",
            fontWeight: 400,
            color: "#c2a06a",
            verticalAlign: "middle",
          }}
        >
          {TAG_LABELS[tag]}
        </span>
      ))}
    </>
  );
}

export default function MenuList() {
  const [activeTag, setActiveTag] = useState<Tag | null>(null);
  const [selectedDishes, setSelectedDishes] = useState<Set<string>>(new Set());

  function toggleDish(name: string) {
    setSelectedDishes((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  const filteredCourses = useMemo(() => {
    if (!activeTag) return courses;
    return courses
      .map((course) => ({
        ...course,
        dishes: course.dishes.filter((dish) => dish.tags.includes(activeTag)),
      }))
      .filter((course) => course.dishes.length > 0);
  }, [activeTag]);

  return (
    <>
      <div style={{ padding: "0 clamp(24px,6vw,96px)", maxWidth: 840, margin: "0 auto clamp(32px,4vw,44px)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", alignItems: "baseline" }}>
          <span style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(236,231,222,0.3)", marginRight: 4 }}>FILTER</span>
          <button type="button" onClick={() => setActiveTag(null)} style={filterButtonStyle(activeTag === null)}>
            ALL
          </button>
          {TAGS.map((tag) => (
            <button key={tag} type="button" onClick={() => setActiveTag(tag)} style={filterButtonStyle(activeTag === tag)}>
              {TAG_LABELS[tag]}
            </button>
          ))}
        </div>
      </div>

      {filteredCourses.map((course, i) => (
        <div
          key={course.name}
          style={{ padding: `0 clamp(24px,6vw,96px) ${i === filteredCourses.length - 1 ? "clamp(96px,11vw,150px)" : "clamp(80px,9vw,120px)"}` }}
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
                    <DishTags tags={dish.tags} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(236,231,222,0.42)", marginBottom: 6 }}>{dish.subtitle}</div>
                  <div style={{ fontSize: 14, fontWeight: 300, fontStyle: "italic", color: "rgba(236,231,222,0.6)", maxWidth: "56ch", marginBottom: 10 }}>{dish.desc}</div>
                  <button
                    type="button"
                    onClick={() => toggleDish(dish.name)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      color: selectedDishes.has(dish.name) ? "#e6d5ab" : "rgba(236,231,222,0.45)",
                    }}
                  >
                    {selectedDishes.has(dish.name) ? "✓ ADDED TO TASTING REQUEST" : "+ ADD TO TASTING REQUEST"}
                  </button>
                </div>
                <div style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 18, color: "#c2a06a" }}>{dish.price}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedDishes.size > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 55,
            background: "#1c1811",
            borderTop: "1px solid rgba(201,162,75,0.3)",
            padding: "16px clamp(24px,6vw,96px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 13, color: "rgba(236,231,222,0.8)" }}>
            {selectedDishes.size} dish{selectedDishes.size > 1 ? "es" : ""} selected for tasting request
          </span>
          <Link
            href={`/reservations?notes=${encodeURIComponent(`Tasting request: ${Array.from(selectedDishes).join(", ")}`)}`}
            className="kn-cta-solid"
            style={{ textDecoration: "none" }}
          >
            CONTINUE TO RESERVATION →
          </Link>
        </div>
      )}
    </>
  );
}
