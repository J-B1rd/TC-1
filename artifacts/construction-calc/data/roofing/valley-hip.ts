import type { Calculator } from "../types";

export const valleyLength: Calculator = {
  id: "valley-length",
  name: "Valley / Hip Length",
  description: "Length of hip or valley rafters",
  inputs: [
    { id: "run", label: "Common Rafter Run", unit: "ft", type: "number", defaultValue: "12", min: 0 },
    { id: "rise", label: "Rise (in per 12\" run)", unit: "in", type: "number", defaultValue: "6", min: 0 },
  ],
  calculate: (inputs) => {
    const run = parseFloat(inputs.run) || 0;
    const rise = parseFloat(inputs.rise) || 0;
    const totalRise = (run * rise) / 12;
    const hipLength = Math.sqrt(run * run + run * run + totalRise * totalRise);
    const commonLength = Math.sqrt(run * run + totalRise * totalRise);
    return [
      { label: "Hip / Valley Length", value: Math.round(hipLength * 100) / 100, unit: "ft", highlight: true },
      { label: "Common Rafter Length", value: Math.round(commonLength * 100) / 100, unit: "ft" },
      { label: "Total Rise", value: Math.round(totalRise * 12), unit: "in" },
    ];
  },
};
