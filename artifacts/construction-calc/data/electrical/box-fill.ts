import type { Calculator } from "../types";

export const boxFill: Calculator = {
  id: "box-fill",
  name: "Box Fill (NEC 314.16)",
  description: "Minimum box volume from conductor and device count",
  inputs: [
    {
      id: "awg", label: "Largest Wire Gauge", unit: "", type: "select",
      options: [
        { label: "14 AWG (2.00 in³ each)", value: "2.00" },
        { label: "12 AWG (2.25 in³ each)", value: "2.25" },
        { label: "10 AWG (2.50 in³ each)", value: "2.50" },
        { label: "8 AWG (3.00 in³ each)", value: "3.00" },
        { label: "6 AWG (5.00 in³ each)", value: "5.00" },
      ],
      defaultValue: "2.25",
    },
    { id: "conductors", label: "Conductors (each wire counts 1)", unit: "ea", type: "number", defaultValue: "4", min: 0 },
    { id: "devices", label: "Devices / Switches / Outlets", unit: "ea", type: "number", defaultValue: "1", min: 0 },
    { id: "clamps", label: "Internal Cable Clamps", unit: "ea", type: "number", defaultValue: "1", min: 0 },
    { id: "grounds", label: "Ground Wires (all count as 1)", unit: "ea", type: "number", defaultValue: "2", min: 0 },
  ],
  calculate: (inputs) => {
    const vol = parseFloat(inputs.awg) || 2.25;
    const cond = parseFloat(inputs.conductors) || 0;
    const devices = parseFloat(inputs.devices) || 0;
    const clamps = parseFloat(inputs.clamps) || 0;
    const grounds = parseFloat(inputs.grounds) || 0;
    const hasGrounds = grounds > 0 ? 1 : 0;
    const hasClamps = clamps > 0 ? 1 : 0;
    const total = (cond + (devices * 2) + hasClamps + hasGrounds) * vol;
    return [
      { label: "Min Box Volume", value: Math.round(total * 100) / 100, unit: "in³", highlight: true },
      { label: "Volume Per Wire", value: vol, unit: "in³" },
      { label: "Conductor Count", value: cond, unit: "conductors" },
      { label: "Device Allowance", value: devices * 2, unit: "equiv. conductors" },
    ];
  },
};
