import type { Trade } from "../types";
import { brickCount } from "./brick-count";
import { cmuCount } from "../concrete/cmu-count";
import { groutVolume } from "./grout-volume";
import { mortarMix } from "./mortar-mix";
import { stoneVeneer } from "./stone-veneer";
import { tuckpointing } from "./tuckpointing";

export { brickCount, cmuCount, groutVolume, mortarMix, stoneVeneer, tuckpointing };

export const masonryTrade: Trade = {
  id: "masonry",
  name: "Masonry",
  color: "#92400E",
  icon: "grid",
  calculators: [brickCount, cmuCount, groutVolume, mortarMix, stoneVeneer, tuckpointing],
};
