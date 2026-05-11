import type { Calculator } from "../types";

export const postHole: Calculator = {
  id: "post-hole",
  name: "Post Hole",
  description: "Concrete for post holes (Sakrete / Quikrete)",
  inputs: [
    { id: "count", label: "Number of Holes", unit: "ea", type: "number", defaultValue: "4", min: 1 },
    { id: "diameter", label: "Hole Diameter", unit: "in", type: "number", defaultValue: "10", min: 0 },
    { id: "depth", label: "Hole Depth", unit: "ft", type: "number", defaultValue: "3.5", min: 0 },
    { id: "postSize", label: "Post Size (square)", unit: "in", type: "number", defaultValue: "4", min: 0 },
  ],
  calculate: (inputs) => {
    const count = parseFloat(inputs.count) || 1;
    const dHole = (parseFloat(inputs.diameter) || 0) / 12;
    const depth = parseFloat(inputs.depth) || 0;
    const post = (parseFloat(inputs.postSize) || 0) / 12;
    const holeVol = Math.PI * (dHole / 2) ** 2 * depth;
    const postVol = post * post * depth;
    const netVol = Math.max(holeVol - postVol, 0);
    const totalCF = netVol * count;
    const totalCY = totalCF / 27;
    const bags80 = Math.ceil(totalCF / 0.45);
    const bags50 = Math.ceil(totalCF / 0.375);
    return [
      { label: "Total Cubic Yards", value: Math.round(totalCY * 1000) / 1000, unit: "yd³", highlight: true },
      { label: "80 lb Bags (total)", value: bags80, unit: "bags" },
      { label: "50 lb Bags (total)", value: bags50, unit: "bags" },
      { label: "Bags Per Hole (80lb)", value: Math.ceil(bags80 / count), unit: "bags" },
    ];
  },
};
