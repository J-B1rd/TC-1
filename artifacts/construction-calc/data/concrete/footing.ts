import type { Calculator } from "../types";

export const concreteFooting: Calculator = {
  id: "concrete-footing",
  name: "Footing / Column",
  description: "Volume for footings and columns",
  inputs: [
    { id: "length", label: "Length / Height", unit: "ft", type: "number", defaultValue: "10", min: 0 },
    { id: "width", label: "Width", unit: "in", type: "number", defaultValue: "12", min: 0 },
    { id: "depth", label: "Depth / Diameter", unit: "in", type: "number", defaultValue: "12", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const w = (parseFloat(inputs.width) || 0) / 12;
    const d = (parseFloat(inputs.depth) || 0) / 12;
    const cubicFt = l * w * d;
    const cubicYards = cubicFt / 27;
    const bags80 = Math.ceil(cubicFt / 0.45);
    return [
      { label: "Cubic Yards", value: Math.round(cubicYards * 100) / 100, unit: "yd³", highlight: true },
      { label: "Cubic Feet", value: Math.round(cubicFt * 10) / 10, unit: "ft³" },
      { label: "80 lb Bags", value: bags80, unit: "bags" },
    ];
  },
};
