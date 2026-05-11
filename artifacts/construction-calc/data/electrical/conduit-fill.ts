import type { Calculator } from "../types";

export const conduitFill: Calculator = {
  id: "conduit-fill",
  name: "Conduit Fill",
  description: "Wire fill percentage in conduit",
  inputs: [
    {
      id: "awg", label: "Wire Gauge", unit: "", type: "select",
      options: [
        { label: "14 AWG THHN", value: "0.0097" },
        { label: "12 AWG THHN", value: "0.0133" },
        { label: "10 AWG THHN", value: "0.0211" },
        { label: "8 AWG THHN", value: "0.0366" },
        { label: "6 AWG THHN", value: "0.0507" },
        { label: "4 AWG THHN", value: "0.0824" },
        { label: "2 AWG THHN", value: "0.1158" },
      ],
      defaultValue: "0.0133",
    },
    { id: "count", label: "Number of Wires", unit: "wires", type: "number", defaultValue: "3", min: 1 },
    {
      id: "conduit", label: "Conduit Trade Size", unit: "", type: "select",
      options: [
        { label: "1/2\" EMT (0.122 in²)", value: "0.122" },
        { label: "3/4\" EMT (0.213 in²)", value: "0.213" },
        { label: "1\" EMT (0.346 in²)", value: "0.346" },
        { label: "1-1/4\" EMT (0.598 in²)", value: "0.598" },
        { label: "1-1/2\" EMT (0.814 in²)", value: "0.814" },
        { label: "2\" EMT (1.342 in²)", value: "1.342" },
        { label: "2-1/2\" EMT (2.343 in²)", value: "2.343" },
        { label: "3\" EMT (3.538 in²)", value: "3.538" },
      ],
      defaultValue: "0.213",
    },
  ],
  calculate: (inputs) => {
    const wireArea = parseFloat(inputs.awg) || 0;
    const count = parseFloat(inputs.count) || 1;
    const conduitArea = parseFloat(inputs.conduit) || 1;
    const totalWireArea = wireArea * count;
    const fillPct = (totalWireArea / conduitArea) * 100;
    const limit = count === 1 ? 53 : count === 2 ? 31 : 40;
    const ok = fillPct <= limit;
    return [
      { label: "Fill Percentage", value: Math.round(fillPct * 10) / 10, unit: "%", highlight: true },
      { label: "NEC Limit", value: limit, unit: "%" },
      { label: "Status (0=OK, 1=Over)", value: ok ? 0 : 1, unit: ok ? "PASS" : "OVER" },
      { label: "Total Wire Area", value: Math.round(totalWireArea * 10000) / 10000, unit: "in²" },
    ];
  },
};
