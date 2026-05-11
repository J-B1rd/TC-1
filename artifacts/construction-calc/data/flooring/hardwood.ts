import type { Calculator } from "../types";

export const hardwoodFlooring: Calculator = {
  id: "hardwood-flooring",
  name: "Hardwood / LVP Flooring",
  description: "Boxes or square feet of hardwood or LVP planks",
  inputs: [
    { id: "area", label: "Room Area", unit: "ft²", type: "number", defaultValue: "250", min: 0 },
    { id: "boxCoverage", label: "Coverage Per Box", unit: "ft²/box", type: "number", defaultValue: "20", min: 0.1 },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const coverage = parseFloat(inputs.boxCoverage) || 20;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const totalArea = area * waste;
    const boxes = Math.ceil(totalArea / coverage);
    return [
      { label: "Boxes Needed", value: boxes, unit: "boxes", highlight: true },
      { label: "Area (w/ waste)", value: Math.round(totalArea), unit: "ft²" },
      { label: "Room Area", value: Math.round(area), unit: "ft²" },
    ];
  },
};
