import type { Trade } from "../types";
import { battInsulation } from "./batt";
import { blownInInsulation } from "./blown-in";
import { rigidFoam } from "./rigid-foam";
import { sprayFoam } from "./spray-foam";
import { rValueCalc } from "./r-value";

export { battInsulation, blownInInsulation, rigidFoam, sprayFoam, rValueCalc };

export const insulationTrade: Trade = {
  id: "insulation",
  name: "Insulation",
  color: "#D97706",
  icon: "thermometer",
  calculators: [battInsulation, blownInInsulation, rigidFoam, sprayFoam, rValueCalc],
};
