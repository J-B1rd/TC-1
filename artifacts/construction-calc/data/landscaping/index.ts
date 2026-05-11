import type { Trade } from "../types";
import { mulchCalc } from "./mulch";
import { sodCalc } from "./sod";
import { retainingWall } from "./retaining-wall";

export { mulchCalc, sodCalc, retainingWall };

export const landscapingTrade: Trade = {
  id: "landscaping",
  name: "Landscaping",
  color: "#16A34A",
  icon: "sun",
  calculators: [mulchCalc, sodCalc, retainingWall],
};
