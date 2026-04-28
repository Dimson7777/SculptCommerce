// Deterministic per-product signals (rating, reviews, badge, stock hints, benefit)
// Seeded by product id so values stay consistent between renders.

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export interface ProductSignals {
  rating: number;        // 4.4 – 4.9
  reviews: number;       // 18 – 380
  badge?: "Best seller" | "Popular" | "New";
  stockHint?: string;    // e.g. "Only 3 left", "Selling fast"
  benefit: string;       // short benefit line
}

const benefitsByCategory: Record<string, string[]> = {
  Strength: ["Heavy-duty steel", "Commercial grade", "Knurled grip", "Built to last"],
  Cardio: ["Smooth bearings", "Low-impact", "Quiet operation"],
  Recovery: ["High-density foam", "Therapist approved", "Easy to clean"],
  Accessories: ["Reinforced stitching", "Wrist support", "Stays put"],
  Apparel: ["Moisture-wicking", "Soft on skin", "Holds shape"],
  Wrestling: ["Mat-tested", "Reinforced seams", "Used by coaches"],
};

const fallbackBenefits = ["Built to last", "No-nonsense build", "Holds up over time"];

export function getProductSignals(id: string, category: string): ProductSignals {
  const h = hash(id);
  const rating = 4.4 + ((h % 6) * 0.1); // 4.4 – 4.9
  const reviews = 18 + (h % 363);

  const badgeRoll = h % 10;
  let badge: ProductSignals["badge"];
  if (badgeRoll < 2) badge = "Best seller";
  else if (badgeRoll < 4) badge = "Popular";
  else if (badgeRoll === 4) badge = "New";

  const stockRoll = (h >> 3) % 12;
  let stockHint: string | undefined;
  if (stockRoll === 0) stockHint = "Only 2 left";
  else if (stockRoll === 1) stockHint = "Only 4 left";
  else if (stockRoll === 2) stockHint = "Selling fast";
  else if (stockRoll === 3) stockHint = "In 12 carts";

  const pool = benefitsByCategory[category] ?? fallbackBenefits;
  const benefit = pool[h % pool.length];

  return {
    rating: Math.round(rating * 10) / 10,
    reviews,
    badge,
    stockHint,
    benefit,
  };
}
