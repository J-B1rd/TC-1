import type { Calculator } from "../types";

export const stepConcrete: Calculator = {
  id: "step-concrete",
  name: "Concrete Steps",
  description: "Concrete volume for exterior or interior steps",
  inputs: [
    { id: "steps", label: "Number of Steps", unit: "ea", type: "number", defaultValue: "3", min: 1 },
    { id: "width", label: "Stair Width", unit: "ft", type: "number", defaultValue: "4", min: 0 },
    { id: "rise", label: "Rise (each step)", unit: "in", type: "number", defaultValue: "7", min: 0 },
    { id: "run", label: "Run (tread depth)", unit: "in", type: "number", defaultValue: "11", min: 0 },
  ],
  calculate: (inputs) => {
    const steps = parseFloat(inputs.steps) || 1;
    const w = parseFloat(inputs.width) || 0;
    const rise = (parseFloat(inputs.rise) || 0) / 12;
    const run = (parseFloat(inputs.run) || 0) / 12;
    const totalRise = steps * rise;
    const totalRun = steps * run;
    const triangleVol = (totalRise * totalRun / 2) * w;
    const cy = triangleVol / 27;
    const bags80 = Math.ceil(triangleVol / 0.45);
    return [
      { label: "Cubic Yards", value: Math.round(cy * 100) / 100, unit: "yd³", highlight: true },
      { label: "Cubic Feet", value: Math.round(triangleVol * 10) / 10, unit: "ft³" },
      { label: "80 lb Bags", value: bags80, unit: "bags" },
      { label: "Total Rise", value: Math.round(totalRise * 12), unit: "in" },
    ];
  },
};
