import type { Calculator } from "../types";

export const deckBoards: Calculator = {
  id: "deck-boards",
  name: "Deck Boards",
  description: "Linear feet and pieces of decking boards",
  inputs: [
    { id: "length", label: "Deck Length", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    { id: "width", label: "Deck Width", unit: "ft", type: "number", defaultValue: "16", min: 0 },
    {
      id: "boardWidth", label: "Board Width", unit: "", type: "select",
      options: [
        { label: "5/4×6 (5.5\" face)", value: "5.5" },
        { label: "2×6 (5.5\" face)", value: "5.5" },
        { label: "2×4 (3.5\" face)", value: "3.5" },
        { label: "1×6 Composite (5.5\")", value: "5.5" },
        { label: "1×4 Composite (3.5\")", value: "3.5" },
      ],
      defaultValue: "5.5",
    },
    { id: "gap", label: "Board Gap", unit: "in", type: "number", defaultValue: "0.25", min: 0, step: 0.0625 },
    {
      id: "boardLength", label: "Board Length", unit: "", type: "select",
      options: [
        { label: "8 ft", value: "8" },
        { label: "10 ft", value: "10" },
        { label: "12 ft", value: "12" },
        { label: "16 ft", value: "16" },
        { label: "20 ft", value: "20" },
      ],
      defaultValue: "16",
    },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const w = parseFloat(inputs.width) || 0;
    const boardFace = parseFloat(inputs.boardWidth) || 5.5;
    const gap = parseFloat(inputs.gap) || 0.25;
    const boardLen = parseFloat(inputs.boardLength) || 16;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const effectiveWidth = (boardFace + gap) / 12;
    const rowCount = Math.ceil(w / effectiveWidth);
    const lfNeeded = rowCount * l * waste;
    const pieces = Math.ceil(lfNeeded / boardLen);
    const screwsPerBoard = Math.ceil((l / 1.33) * 2);
    return [
      { label: "Pieces", value: pieces, unit: `${boardLen}-ft boards`, highlight: true },
      { label: "Linear Feet", value: Math.round(lfNeeded), unit: "LF" },
      { label: "Rows", value: rowCount, unit: "rows" },
      { label: "Screws / Clips (est.)", value: pieces * screwsPerBoard, unit: "ea" },
    ];
  },
};
