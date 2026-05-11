import type { Calculator } from "../types";

export const concreteSlab: Calculator = {
  id: "concrete-slab",
  name: "Concrete Slab",
  description: "Volume and bag count for a concrete slab",
  inputs: [
    { id: "length", label: "Length", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    { id: "width", label: "Width", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    { id: "thickness", label: "Thickness", unit: "in", type: "number", defaultValue: "4", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const w = parseFloat(inputs.width) || 0;
    const t = (parseFloat(inputs.thickness) || 0) / 12;
    const cubicFt = l * w * t;
    const cubicYards = cubicFt / 27;
    const bags80 = Math.ceil(cubicFt / 0.45);
    const bags60 = Math.ceil(cubicFt / 0.3);
    return [
      { label: "Cubic Yards", value: Math.round(cubicYards * 100) / 100, unit: "yd³", highlight: true },
      { label: "Cubic Feet", value: Math.round(cubicFt * 10) / 10, unit: "ft³" },
      { label: "80 lb Bags", value: bags80, unit: "bags" },
      { label: "60 lb Bags", value: bags60, unit: "bags" },
    ];
  },
};
