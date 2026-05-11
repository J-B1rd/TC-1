import type { Calculator } from "../types";

export const carpetYards: Calculator = {
  id: "carpet-yards",
  name: "Carpet / Square Yards",
  description: "Carpet needed in square yards",
  inputs: [
    { id: "length", label: "Room Length", unit: "ft", type: "number", defaultValue: "15", min: 0 },
    { id: "width", label: "Room Width", unit: "ft", type: "number", defaultValue: "12", min: 0 },
    { id: "waste", label: "Waste (seams / cuts)", unit: "%", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const w = parseFloat(inputs.width) || 0;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const sqFt = l * w * waste;
    const sqYd = sqFt / 9;
    return [
      { label: "Square Yards", value: Math.ceil(sqYd * 10) / 10, unit: "yd²", highlight: true },
      { label: "Square Feet (w/ waste)", value: Math.round(sqFt), unit: "ft²" },
      { label: "Room Area", value: Math.round(l * w), unit: "ft²" },
    ];
  },
};
