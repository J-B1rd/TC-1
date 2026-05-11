import type { Calculator } from "../types";

export const shingleCount: Calculator = {
  id: "shingle-count",
  name: "Shingle Count",
  description: "Bundles or squares of shingles needed",
  inputs: [
    { id: "squares", label: "Roof Squares", unit: "squares", type: "number", defaultValue: "20", min: 0 },
    {
      id: "type", label: "Shingle Type", unit: "", type: "select",
      options: [
        { label: "3-Tab (3 bundles/sq)", value: "3" },
        { label: "Architectural / Laminated (4 bundles/sq)", value: "4" },
        { label: "Premium / Heavy (5 bundles/sq)", value: "5" },
      ],
      defaultValue: "4",
    },
    { id: "waste", label: "Waste / Hips & Valleys", unit: "%", type: "number", defaultValue: "15", min: 0 },
  ],
  calculate: (inputs) => {
    const squares = parseFloat(inputs.squares) || 0;
    const bundlesPerSq = parseFloat(inputs.type) || 4;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const totalSquares = squares * waste;
    const bundles = Math.ceil(totalSquares * bundlesPerSq);
    const nails = Math.round(totalSquares * 320);
    return [
      { label: "Bundles", value: bundles, unit: "bundles", highlight: true },
      { label: "Squares (w/ waste)", value: Math.round(totalSquares * 10) / 10, unit: "squares" },
      { label: "Roofing Nails", value: nails, unit: "nails" },
    ];
  },
};
