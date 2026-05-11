import type { Calculator } from "../types";

export const btuLoad: Calculator = {
  id: "btu-load",
  name: "BTU Load (Room A/C)",
  description: "BTU per hour needed to cool or heat a room",
  inputs: [
    { id: "area", label: "Room Area", unit: "ft²", type: "number", defaultValue: "300", min: 0 },
    { id: "ceilingHt", label: "Ceiling Height", unit: "ft", type: "number", defaultValue: "8", min: 0 },
    {
      id: "insulation", label: "Insulation Quality", unit: "", type: "select",
      options: [
        { label: "Poor (older home, drafty)", value: "poor" },
        { label: "Average", value: "average" },
        { label: "Good (well insulated)", value: "good" },
      ],
      defaultValue: "average",
    },
    { id: "people", label: "Occupants", unit: "people", type: "number", defaultValue: "2", min: 0 },
    {
      id: "sun", label: "Sun Exposure", unit: "", type: "select",
      options: [
        { label: "Shaded", value: "shaded" },
        { label: "Normal", value: "normal" },
        { label: "Very Sunny", value: "sunny" },
      ],
      defaultValue: "normal",
    },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const height = parseFloat(inputs.ceilingHt) || 8;
    const people = parseFloat(inputs.people) || 0;
    const volume = area * height;
    let btusPerCuFt = 5;
    if (inputs.insulation === "poor") btusPerCuFt = 7;
    else if (inputs.insulation === "good") btusPerCuFt = 4;
    let base = volume * btusPerCuFt;
    if (inputs.sun === "sunny") base *= 1.1;
    else if (inputs.sun === "shaded") base *= 0.9;
    base += people * 600;
    const tons = base / 12000;
    return [
      { label: "BTU/hr Required", value: Math.round(base / 100) * 100, unit: "BTU/hr", highlight: true },
      { label: "Tons", value: Math.round(tons * 10) / 10, unit: "tons" },
      { label: "Room Volume", value: Math.round(volume), unit: "ft³" },
    ];
  },
};
