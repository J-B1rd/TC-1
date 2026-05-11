import type { Calculator } from "../types";

export const stairCalculator: Calculator = {
  id: "stair-calculator",
  name: "Stair Calculator",
  description: "Risers, treads, stringer length, and material for a staircase",
  inputs: [
    { id: "totalRise", label: "Total Rise (floor to floor)", unit: "in", type: "number", defaultValue: "109", min: 0 },
    { id: "treadDepth", label: "Tread Depth", unit: "in", type: "number", defaultValue: "10", min: 0 },
    { id: "width", label: "Stair Width", unit: "in", type: "number", defaultValue: "36", min: 0 },
    { id: "treadsPerStringer", label: "Stringers", unit: "ea", type: "number", defaultValue: "3", min: 2 },
  ],
  calculate: (inputs) => {
    const totalRise = parseFloat(inputs.totalRise) || 0;
    const treadDepth = parseFloat(inputs.treadDepth) || 10;
    const width = parseFloat(inputs.width) || 36;
    const stringers = parseFloat(inputs.treadsPerStringer) || 3;
    const risers = Math.ceil(totalRise / 7.75);
    const riserHeight = totalRise / risers;
    const totalRun = (risers - 1) * treadDepth;
    const stringerLen = Math.sqrt(totalRise * totalRise + totalRun * totalRun) / 12;
    const treadCount = risers - 1;
    const treadBoardFt = (treadCount * (width / 12) * (treadDepth / 12)) * 1.1;
    return [
      { label: "Number of Risers", value: risers, unit: "risers", highlight: true },
      { label: "Riser Height", value: Math.round(riserHeight * 100) / 100, unit: "in" },
      { label: "Treads", value: treadCount, unit: "treads" },
      { label: "Total Run", value: Math.round(totalRun * 10) / 10, unit: "in" },
      { label: "Stringer Length", value: Math.round(stringerLen * 100) / 100, unit: "ft each" },
      { label: "Tread Board-Feet", value: Math.round(treadBoardFt * 10) / 10, unit: "BF" },
    ];
  },
};
