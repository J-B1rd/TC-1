import type { Calculator } from "../types";

export const drainSlope: Calculator = {
  id: "drain-slope",
  name: "Drain Slope",
  description: "Calculate slope and drop for drain lines",
  inputs: [
    { id: "length", label: "Pipe Run", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    {
      id: "slope", label: "Slope", unit: "", type: "select",
      options: [
        { label: "1/8\" per foot", value: "0.125" },
        { label: "1/4\" per foot", value: "0.25" },
        { label: "1/2\" per foot", value: "0.5" },
      ],
      defaultValue: "0.25",
    },
  ],
  calculate: (inputs) => {
    const length = parseFloat(inputs.length) || 0;
    const slopePerFt = parseFloat(inputs.slope) || 0.25;
    const totalDrop = length * slopePerFt;
    const slopePct = (slopePerFt / 12) * 100;
    return [
      { label: "Total Drop", value: Math.round(totalDrop * 100) / 100, unit: "in", highlight: true },
      { label: "Total Drop", value: Math.round((totalDrop / 12) * 100) / 100, unit: "ft" },
      { label: "Slope %", value: Math.round(slopePct * 100) / 100, unit: "%" },
    ];
  },
};
