import type { Calculator } from "../types";

export const transformerKva: Calculator = {
  id: "transformer-kva",
  name: "Transformer KVA",
  description: "Select transformer KVA from load and voltage",
  inputs: [
    { id: "amps", label: "Full-Load Amps", unit: "A", type: "number", defaultValue: "100", min: 0 },
    {
      id: "voltage", label: "Secondary Voltage", unit: "", type: "select",
      options: [
        { label: "120/240V (1Ø)", value: "240" },
        { label: "120/208V (3Ø)", value: "208" },
        { label: "277/480V (3Ø)", value: "480" },
        { label: "600V (3Ø)", value: "600" },
      ],
      defaultValue: "480",
    },
    {
      id: "phase", label: "Phase", unit: "", type: "select",
      options: [
        { label: "Single Phase (1Ø)", value: "single" },
        { label: "Three Phase (3Ø)", value: "three" },
      ],
      defaultValue: "three",
    },
    { id: "demandFactor", label: "Demand Factor", unit: "%", type: "number", defaultValue: "80", min: 1 },
  ],
  calculate: (inputs) => {
    const amps = parseFloat(inputs.amps) || 0;
    const v = parseFloat(inputs.voltage) || 480;
    const pf = (parseFloat(inputs.demandFactor) || 80) / 100;
    const isThree = inputs.phase === "three";
    const kva = isThree
      ? (Math.sqrt(3) * v * amps) / 1000
      : (v * amps) / 1000;
    const required = kva / pf;
    const kvaStd = [1, 1.5, 2, 3, 5, 7.5, 10, 15, 25, 37.5, 45, 50, 75, 100, 112.5, 150, 167, 200, 225, 300, 333, 500, 750, 1000];
    let selected = kvaStd[kvaStd.length - 1];
    for (const k of kvaStd) { if (k >= required) { selected = k; break; } }
    return [
      { label: "Required KVA", value: Math.round(required * 10) / 10, unit: "kVA", highlight: true },
      { label: "Standard Size", value: selected, unit: "kVA" },
      { label: "Apparent Power", value: Math.round(kva * 10) / 10, unit: "kVA" },
    ];
  },
};
