import type { Trade } from "../types";
import { drainSlope } from "./drain-slope";
import { pipeSizing } from "./pipe-sizing";
import { fixtureUnits } from "./fixture-units";
import { pressureLoss } from "./pressure-loss";
import { gasPipeSizing } from "./gas-pipe";
import { waterHeaterSizing } from "./water-heater";
import { septicSizing } from "./septic";
import { pipeInsulationCalc } from "./pipe-insulation";

export { drainSlope, pipeSizing, fixtureUnits, pressureLoss, gasPipeSizing, waterHeaterSizing, septicSizing, pipeInsulationCalc };

export const plumbingTrade: Trade = {
  id: "plumbing",
  name: "Plumbing",
  color: "#1D4ED8",
  icon: "droplet",
  calculators: [drainSlope, pipeSizing, fixtureUnits, pressureLoss, gasPipeSizing, waterHeaterSizing, septicSizing, pipeInsulationCalc],
};
