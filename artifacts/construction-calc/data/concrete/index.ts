import type { Trade } from "../types";
import { concreteSlab } from "./slab";
import { concreteFooting } from "./footing";
import { rebarQuantity } from "./rebar";
import { cmuCount } from "./cmu-count";
import { circularSlab } from "./circular-slab";
import { postHole } from "./post-hole";
import { stepConcrete } from "./steps";

export { concreteSlab, concreteFooting, rebarQuantity, cmuCount, circularSlab, postHole, stepConcrete };

export const concreteTrade: Trade = {
  id: "concrete",
  name: "Concrete",
  color: "#6B7280",
  icon: "layers",
  calculators: [concreteSlab, concreteFooting, rebarQuantity, cmuCount, circularSlab, postHole, stepConcrete],
};
