import type { Calculator } from "../types";

export const circuitLoad: Calculator = {
  id: "circuit-load",
  name: "Circuit Load",
  description: "Amps from watts at a given voltage",
  inputs: [
    { id: "watts", label: "Total Watts", unit: "W", type: "number", defaultValue: "1800", min: 0 },
    {
      id: "voltage", label: "Voltage", unit: "", type: "select",
      options: [
        { label: "120V", value: "120" },
        { label: "240V", value: "240" },
        { label: "208V", value: "208" },
        { label: "277V", value: "277" },
      ],
      defaultValue: "120",
    },
    { id: "pf", label: "Power Factor", unit: "", type: "number", defaultValue: "1.0", min: 0.1, step: 0.1 },
  ],
  calculate: (inputs) => {
    const w = parseFloat(inputs.watts) || 0;
    const v = parseFloat(inputs.voltage) || 120;
    const pf = parseFloat(inputs.pf) || 1;
    const amps = w / (v * pf);
    let breaker = 15;
    if (amps > 12) breaker = 20;
    if (amps > 16) breaker = 20;
    if (amps > 20) breaker = 30;
    if (amps > 24) breaker = 30;
    if (amps > 30) breaker = 40;
    if (amps > 40) breaker = 50;
    if (amps > 50) breaker = 60;
    if (amps > 60) breaker = 70;
    if (amps > 70) breaker = 80;
    if (amps > 80) breaker = 100;
    return [
      { label: "Amps", value: Math.round(amps * 100) / 100, unit: "A", highlight: true },
      { label: "Recommended Breaker", value: breaker, unit: "A" },
      { label: "Load at 80%", value: Math.round(amps * 0.8 * 100) / 100, unit: "A" },
    ];
  },
};
