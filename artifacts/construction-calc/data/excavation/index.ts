import type { Trade } from "../types";
import { cutFill } from "./cut-fill";
import { swellFactor } from "./swell-factor";
import { haulLoads } from "./haul-loads";
import { trenchVolume } from "./trench-volume";
import { gradeSlope } from "./grade-slope";
import { compactionPasses } from "./compaction";

export { cutFill, swellFactor, haulLoads, trenchVolume, gradeSlope, compactionPasses };

export const excavationTrade: Trade = {
  id: "excavation",
  name: "Excavation",
  color: "#B45309",
  icon: "truck",
  calculators: [cutFill, swellFactor, haulLoads, trenchVolume, gradeSlope, compactionPasses],
};
