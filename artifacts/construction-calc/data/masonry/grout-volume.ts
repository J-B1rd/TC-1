import type { Calculator } from "../types";

export const groutVolume: Calculator = {
  id: "grout-volume",
  name: "Grout Volume",
  description: "Cubic feet of grout for tile or CMU wall",
  inputs: [
    { id: "length", label: "Wall Length", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    { id: "height", label: "Wall Height", unit: "ft", type: "number", defaultValue: "8", min: 0 },
    { id: "coreSize", label: "Core Size (diameter)", unit: "in", type: "number", defaultValue: "5.5", min: 0 },
    { id: "fillPct", label: "Fill Percentage", unit: "%", type: "number", defaultValue: "100", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const h = parseFloat(inputs.height) || 0;
    const coreIn = parseFloat(inputs.coreSize) || 5.5;
    const fillPct = (parseFloat(inputs.fillPct) || 100) / 100;
    const coreAreaSqFt = (Math.PI * (coreIn / 24) ** 2);
    const coresPerFt = 0.75;
    const totalCF = l * h * coresPerFt * coreAreaSqFt * fillPct;
    const bags80 = Math.ceil(totalCF / 0.45);
    return [
      { label: "Grout Volume", value: Math.round(totalCF * 100) / 100, unit: "ft³", highlight: true },
      { label: "80 lb Bags", value: bags80, unit: "bags" },
      { label: "Wall Area", value: Math.round(l * h), unit: "ft²" },
    ];
  },
};
