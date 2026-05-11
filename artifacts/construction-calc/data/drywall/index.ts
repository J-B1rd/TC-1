import type { Trade } from "../types";
import { drywallSheets } from "./sheets";
import { jointCompound } from "./joint-compound";
import { cornerBead } from "./corner-bead";
import { drywallLiftRental } from "./hang-time";
import { drywallPatch } from "./patch";

export { drywallSheets, jointCompound, cornerBead, drywallLiftRental, drywallPatch };

export const drywallTrade: Trade = {
  id: "drywall",
  name: "Drywall",
  color: "#6366F1",
  icon: "layers",
  calculators: [drywallSheets, jointCompound, cornerBead, drywallLiftRental, drywallPatch],
};
