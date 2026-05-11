import type { Calculator } from "../types";

export const cutFill: Calculator = {
  id: "cut-fill",
  name: "Cut & Fill Volume",
  description: "Cubic yards of cut and fill for grading",
  inputs: [
    { id: "area", label: "Area", unit: "ft²", type: "number", defaultValue: "5000", min: 0 },
    { id: "cutDepth", label: "Average Cut Depth", unit: "ft", type: "number", defaultValue: "2", min: 0 },
    { id: "fillDepth", label: "Average Fill Depth", unit: "ft", type: "number", defaultValue: "1", min: 0 },
    { id: "swell", label: "Swell Factor", unit: "%", type: "number", defaultValue: "25", min: 0 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const cut = parseFloat(inputs.cutDepth) || 0;
    const fill = parseFloat(inputs.fillDepth) || 0;
    const swell = 1 + (parseFloat(inputs.swell) || 0) / 100;
    const cutCY = (area * cut) / 27;
    const fillCY = (area * fill) / 27;
    const excessCY = Math.max(cutCY * swell - fillCY, 0);
    return [
      { label: "Cut Volume", value: Math.round(cutCY * 10) / 10, unit: "yd³", highlight: true },
      { label: "Fill Volume", value: Math.round(fillCY * 10) / 10, unit: "yd³" },
      { label: "Excess (haul away)", value: Math.round(excessCY * 10) / 10, unit: "yd³" },
    ];
  },
};
