import type { Calculator } from "../types";

export const roofPitch: Calculator = {
  id: "roof-pitch",
  name: "Roof Pitch",
  description: "Convert between pitch, angle, and multiplier",
  inputs: [
    { id: "rise", label: "Rise", unit: "in", type: "number", defaultValue: "6", min: 0 },
    { id: "run", label: "Run", unit: "in", type: "number", defaultValue: "12", min: 0.1 },
  ],
  calculate: (inputs) => {
    const rise = parseFloat(inputs.rise) || 0;
    const run = parseFloat(inputs.run) || 12;
    const angle = Math.atan(rise / run) * (180 / Math.PI);
    const multiplier = Math.sqrt(rise * rise + run * run) / run;
    const pitch = `${rise}/${run}`;
    return [
      { label: "Pitch", value: 0, unit: pitch, highlight: true },
      { label: "Angle", value: Math.round(angle * 100) / 100, unit: "°" },
      { label: "Slope Multiplier", value: Math.round(multiplier * 10000) / 10000, unit: "×" },
    ];
  },
};
