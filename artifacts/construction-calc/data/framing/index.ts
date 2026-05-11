import type { Trade } from "../types";
import { studCount } from "./stud-count";
import { boardFeet } from "./board-feet";
import { sheathingSheets } from "./sheathing";
import { joistCount } from "./joist-count";
import { rafterLength } from "./rafter-length";
import { wallFramingList } from "./wall-framing";
import { stairCalculator } from "./stair-calculator";
import { deckBoards } from "./deck-boards";

export { studCount, boardFeet, sheathingSheets, joistCount, rafterLength, wallFramingList, stairCalculator, deckBoards };

export const framingTrade: Trade = {
  id: "framing",
  name: "Framing",
  color: "#92400E",
  icon: "box",
  calculators: [studCount, boardFeet, sheathingSheets, joistCount, rafterLength, wallFramingList, stairCalculator, deckBoards],
};
