import type { Trade } from "../types";
import { paintCoverage } from "./paint-coverage";
import { wallArea } from "./wall-area";
import { exteriorPaint } from "./exterior-paint";

export { paintCoverage, wallArea, exteriorPaint };

export const paintingTrade: Trade = {
  id: "painting",
  name: "Painting",
  color: "#DB2777",
  icon: "edit-2",
  calculators: [paintCoverage, wallArea, exteriorPaint],
};
