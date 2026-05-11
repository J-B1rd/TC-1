import type { Calculator } from "../types";

export const threePhasePower: Calculator = {
  id: "three-phase-power",
  name: "3-Phase Power",
  description: "Convert between kW, kVA, and amps for 3-phase systems",
  inputs: [
    {
      id: "known", label: "Known Value", unit: "", type: "select",
      options: [
        { label: "Amps → kW & kVA", value: "amps" },
        { label: "kW → Amps & kVA", value: "kw" },
        { label: "kVA → Amps & kW", value: "kva" },
      ],
      defaultValue: "amps",
    },
    { id: "value", label: "Value", unit: "A / kW / kVA", type: "number", defaultValue: "100", min: 0 },
    {
      id: "voltage", label: "Line Voltage", unit: "", type: "select",
      options: [
        { label: "208V", value: "208" },
        { label: "240V", value: "240" },
        { label: "277/480V", value: "480" },
        { label: "600V", value: "600" },
      ],
      defaultValue: "480",
    },
    { id: "pf", label: "Power Factor", unit: "", type: "number", defaultValue: "0.85", min: 0.1, step: 0.05 },
  ],
  calculate: (inputs) => {
    const v = parseFloat(inputs.voltage) || 480;
    const pf = parseFloat(inputs.pf) || 0.85;
    const val = parseFloat(inputs.value) || 0;
    const sqr3 = Math.sqrt(3);
    let amps = 0, kw = 0, kva = 0;
    if (inputs.known === "amps") {
      amps = val;
      kva = (sqr3 * v * amps) / 1000;
      kw = kva * pf;
    } else if (inputs.known === "kw") {
      kw = val;
      kva = kw / pf;
      amps = (kva * 1000) / (sqr3 * v);
    } else {
      kva = val;
      kw = kva * pf;
      amps = (kva * 1000) / (sqr3 * v);
    }
    return [
      { label: "Amps (A)", value: Math.round(amps * 100) / 100, unit: "A", highlight: true },
      { label: "Apparent Power (kVA)", value: Math.round(kva * 100) / 100, unit: "kVA" },
      { label: "Real Power (kW)", value: Math.round(kw * 100) / 100, unit: "kW" },
      { label: "Watts", value: Math.round(kw * 1000), unit: "W" },
    ];
  },
};
