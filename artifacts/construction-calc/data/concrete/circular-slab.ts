import type { Calculator } from "../types";

export const circularSlab: Calculator = {
  id: "circular-slab",
  name: "Circular / Round Slab",
  description: "Concrete volume for a round pad or column",
  inputs: [
    { id: "diameter", label: "Diameter", unit: "ft", type: "number", defaultValue: "10", min: 0 },
    { id: "thickness", label: "Thickness", unit: "in", type: "number", defaultValue: "4", min: 0 },
  ],
  calculate: (inputs) => {
    const d = parseFloat(inputs.diameter) || 0;
    const t = (parseFloat(inputs.thickness) || 0) / 12;
    const cubicFt = Math.PI * (d / 2) ** 2 * t;
    const cy = cubicFt / 27;
    const bags80 = Math.ceil(cubicFt / 0.45);
    return [
      { label: "Cubic Yards", value: Math.round(cy * 100) / 100, unit: "yd³", highlight: true },
      { label: "Cubic Feet", value: Math.round(cubicFt * 10) / 10, unit: "ft³" },
      { label: "80 lb Bags", value: bags80, unit: "bags" },
    ];
  },
};
