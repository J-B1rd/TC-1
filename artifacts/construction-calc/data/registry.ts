import type { Trade, Calculator } from "./types";
import { concreteTrade } from "./concrete";
import { framingTrade } from "./framing";
import { electricalTrade } from "./electrical";
import { plumbingTrade } from "./plumbing";
import { hvacTrade } from "./hvac";
import { roofingTrade } from "./roofing";
import { masonryTrade } from "./masonry";
import { paintingTrade } from "./painting";
import { flooringTrade } from "./flooring";
import { excavationTrade } from "./excavation";
import { drywallTrade } from "./drywall";
import { insulationTrade } from "./insulation";
import { landscapingTrade } from "./landscaping";

export const trades: Trade[] = [
  concreteTrade,
  framingTrade,
  electricalTrade,
  plumbingTrade,
  hvacTrade,
  roofingTrade,
  masonryTrade,
  paintingTrade,
  flooringTrade,
  excavationTrade,
  drywallTrade,
  insulationTrade,
  landscapingTrade,
];

export function getTradeById(id: string): Trade | undefined {
  return trades.find((t) => t.id === id);
}

export function getCalculatorById(tradeId: string, calcId: string): Calculator | undefined {
  const trade = getTradeById(tradeId);
  return trade?.calculators.find((c) => c.id === calcId);
}

export type { Trade, Calculator };
export * from "./types";
