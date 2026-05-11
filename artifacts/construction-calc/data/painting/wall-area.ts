import type { Calculator } from "../types";

export const wallArea: Calculator = {
  id: "wall-area",
  name: "Room Wall Area",
  description: "Paintable wall area for a rectangular room",
  inputs: [
    { id: "length", label: "Room Length", unit: "ft", type: "number", defaultValue: "14", min: 0 },
    { id: "width", label: "Room Width", unit: "ft", type: "number", defaultValue: "12", min: 0 },
    { id: "height", label: "Wall Height", unit: "ft", type: "number", defaultValue: "9", min: 0 },
    { id: "doors", label: "Doors", unit: "ea", type: "number", defaultValue: "1", min: 0 },
    { id: "windows", label: "Windows", unit: "ea", type: "number", defaultValue: "2", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const w = parseFloat(inputs.width) || 0;
    const h = parseFloat(inputs.height) || 0;
    const doors = parseFloat(inputs.doors) || 0;
    const windows = parseFloat(inputs.windows) || 0;
    const gross = 2 * (l + w) * h;
    const openings = doors * 20 + windows * 15;
    const net = gross - openings;
    return [
      { label: "Net Wall Area", value: Math.round(net), unit: "ft²", highlight: true },
      { label: "Gross Wall Area", value: Math.round(gross), unit: "ft²" },
      { label: "Ceiling Area", value: Math.round(l * w), unit: "ft²" },
      { label: "Openings Deducted", value: Math.round(openings), unit: "ft²" },
    ];
  },
};
