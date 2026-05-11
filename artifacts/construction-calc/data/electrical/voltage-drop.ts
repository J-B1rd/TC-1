import type { Calculator } from "../types";

export const voltageDrop: Calculator = {
  id: "voltage-drop",
  name: "Voltage Drop",
  description: "Voltage drop over a wire run",
  inputs: [
    { id: "amps", label: "Load", unit: "A", type: "number", defaultValue: "20", min: 0 },
    { id: "distance", label: "One-Way Distance", unit: "ft", type: "number", defaultValue: "100", min: 0 },
    {
      id: "awg", label: "Wire Gauge", unit: "", type: "select",
      options: [
        { label: "14 AWG", value: "2.525" },
        { label: "12 AWG", value: "1.588" },
        { label: "10 AWG", value: "0.999" },
        { label: "8 AWG", value: "0.628" },
        { label: "6 AWG", value: "0.395" },
        { label: "4 AWG", value: "0.249" },
        { label: "2 AWG", value: "0.156" },
        { label: "1/0 AWG", value: "0.098" },
        { label: "2/0 AWG", value: "0.078" },
        { label: "3/0 AWG", value: "0.062" },
        { label: "4/0 AWG", value: "0.049" },
      ],
      defaultValue: "1.588",
    },
    {
      id: "voltage", label: "System Voltage", unit: "", type: "select",
      options: [
        { label: "120V", value: "120" },
        { label: "240V", value: "240" },
      ],
      defaultValue: "120",
    },
  ],
  calculate: (inputs) => {
    const amps = parseFloat(inputs.amps) || 0;
    const dist = parseFloat(inputs.distance) || 0;
    const ohmsPerKft = parseFloat(inputs.awg) || 1.588;
    const voltage = parseFloat(inputs.voltage) || 120;
    const totalLength = dist * 2;
    const drop = (amps * ohmsPerKft * totalLength) / 1000;
    const dropPct = (drop / voltage) * 100;
    return [
      { label: "Voltage Drop", value: Math.round(drop * 100) / 100, unit: "V", highlight: true },
      { label: "Drop %", value: Math.round(dropPct * 100) / 100, unit: "%" },
      { label: "Voltage at Load", value: Math.round((voltage - drop) * 100) / 100, unit: "V" },
    ];
  },
};
