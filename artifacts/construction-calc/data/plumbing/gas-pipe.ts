import type { Calculator } from "../types";

export const gasPipeSizing: Calculator = {
  id: "gas-pipe-sizing",
  name: "Gas Pipe Sizing",
  description: "Pipe diameter for natural gas or propane supply",
  inputs: [
    { id: "btu", label: "Total BTU/hr Load", unit: "BTU/hr", type: "number", defaultValue: "200000", min: 0 },
    { id: "length", label: "Pipe Length", unit: "ft", type: "number", defaultValue: "50", min: 0 },
    {
      id: "gas", label: "Gas Type", unit: "", type: "select",
      options: [
        { label: "Natural Gas (1000 BTU/ft³)", value: "1000" },
        { label: "Propane LP (2500 BTU/ft³)", value: "2500" },
      ],
      defaultValue: "1000",
    },
    {
      id: "pressure", label: "Supply Pressure", unit: "", type: "select",
      options: [
        { label: "Low (< 2 PSI) — residential", value: "low" },
        { label: "Medium (2–5 PSI) — commercial", value: "med" },
        { label: "High (> 5 PSI) — industrial", value: "high" },
      ],
      defaultValue: "low",
    },
  ],
  calculate: (inputs) => {
    const btu = Math.max(parseFloat(inputs.btu) || 0, 0);
    const length = Math.max(parseFloat(inputs.length) || 0, 0);
    const heatVal = parseFloat(inputs.gas) || 1000;
    const cfh = btu / heatVal;
    const pressureFactor = inputs.pressure === "med" ? 1.5 : inputs.pressure === "high" ? 2.5 : 1.0;
    const cfhCapacity: [string, number][] = [
      ["1/2\" CSST / SCH 40", 40],
      ["3/4\" CSST / SCH 40", 90],
      ["1\" SCH 40", 190],
      ["1-1/4\" SCH 40", 370],
      ["1-1/2\" SCH 40", 590],
      ["2\" SCH 40", 1130],
      ["2-1/2\" SCH 40", 1900],
      ["3\" SCH 40", 3600],
    ];
    const lengthFactor = Math.sqrt(50 / Math.max(length, 1));
    let selectedSize = cfhCapacity[cfhCapacity.length - 1][0];
    for (const [size, cap] of cfhCapacity) {
      if (cap * lengthFactor * pressureFactor >= cfh) { selectedSize = size; break; }
    }
    return [
      { label: "Recommended Pipe", value: 0, unit: selectedSize, highlight: true },
      { label: "Flow Rate Required", value: Math.round(cfh * 10) / 10, unit: "CFH" },
      { label: "Total BTU/hr", value: Math.round(btu), unit: "BTU/hr" },
      { label: "Pressure Boost Factor", value: pressureFactor, unit: "×" },
    ];
  },
};
