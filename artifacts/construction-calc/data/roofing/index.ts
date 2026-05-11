import type { Trade } from "../types";
import { roofPitch } from "./roof-pitch";
import { roofingArea } from "./roof-area";
import { shingleCount } from "./shingles";
import { underlaymentRolls } from "./underlayment";
import { valleyLength } from "./valley-hip";
import { snowLoad } from "./snow-load";
import { dripEdge } from "./drip-edge";

export { roofPitch, roofingArea, shingleCount, underlaymentRolls, valleyLength, snowLoad, dripEdge };

export const roofingTrade: Trade = {
  id: "roofing",
  name: "Roofing",
  color: "#7C3AED",
  icon: "home",
  calculators: [roofPitch, roofingArea, shingleCount, underlaymentRolls, valleyLength, snowLoad, dripEdge],
};
