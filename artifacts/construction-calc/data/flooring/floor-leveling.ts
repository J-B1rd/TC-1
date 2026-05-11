import type { Calculator } from "../types";

export const floorLeveling: Calculator = {
  id: "floor-leveling",
  name: "Self-Leveling Concrete",
  description: "Bags of self-leveler for floor prep",
  inputs: [
    { id: "area", label: "Floor Area", unit: "ft²", type: "number", defaultValue: "200", min: 0 },
    { id: "depth", label: "Average Depth", unit: "in", type: "number", defaultValue: "0.25", min: 0, step: 0.0625 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const depth = parseFloat(inputs.depth) || 0;
    const cubicFt = area * (depth / 12);
    const bags50 = Math.ceil(cubicFt / 0.4);
    return [
      { label: "50 lb Bags", value: bags50, unit: "bags", highlight: true },
      { label: "Volume", value: Math.round(cubicFt * 100) / 100, unit: "ft³" },
      { label: "Floor Area", value: Math.round(area), unit: "ft²" },
    ];
  },
};
