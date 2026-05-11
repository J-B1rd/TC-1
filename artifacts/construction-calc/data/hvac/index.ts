import type { Trade } from "../types";
import { btuLoad } from "./btu-load";
import { ductSizing } from "./duct-sizing";
import { cfmPerRoom } from "./cfm-per-room";
import { refrigerantLineSizing } from "./refrigerant-lines";
import { ventilationRate } from "./ventilation";
import { heatLossGain } from "./heat-load";
import { exhaustFan } from "./exhaust-fan";

export { btuLoad, ductSizing, cfmPerRoom, refrigerantLineSizing, ventilationRate, heatLossGain, exhaustFan };

export const hvacTrade: Trade = {
  id: "hvac",
  name: "HVAC",
  color: "#0891B2",
  icon: "wind",
  calculators: [btuLoad, ductSizing, cfmPerRoom, refrigerantLineSizing, ventilationRate, heatLossGain, exhaustFan],
};
