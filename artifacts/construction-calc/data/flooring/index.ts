import type { Trade } from "../types";
import { tileLayout } from "./tile-layout";
import { hardwoodFlooring } from "./hardwood";
import { carpetYards } from "./carpet";
import { subflooring } from "./subflooring";
import { floorLeveling } from "./floor-leveling";

export { tileLayout, hardwoodFlooring, carpetYards, subflooring, floorLeveling };

export const flooringTrade: Trade = {
  id: "flooring",
  name: "Flooring",
  color: "#059669",
  icon: "square",
  calculators: [tileLayout, hardwoodFlooring, carpetYards, subflooring, floorLeveling],
};
