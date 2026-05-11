import type { Calculator } from "../types";

export const subflooring: Calculator = {
  id: "subflooring",
  name: "Subfloor Sheathing",
  description: "OSB or plywood sheets for a subfloor",
  inputs: [
    { id: "length", label: "Room Length", unit: "ft", type: "number", defaultValue: "24", min: 0 },
    { id: "width", label: "Room Width", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
    {
      id: "thickness", label: "Panel Thickness", unit: "", type: "select",
      options: [
        { label: "19/32\" (5/8\") T&G OSB", value: "0.59" },
        { label: "23/32\" (3/4\") T&G OSB", value: "0.72" },
        { label: "3/4\" Plywood", value: "0.75" },
      ],
      defaultValue: "0.72",
    },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const w = parseFloat(inputs.width) || 0;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const area = l * w;
    const sheets = Math.ceil((area * waste) / 32);
    const nails = Math.ceil(sheets * 80);
    return [
      { label: "4×8 Sheets", value: sheets, unit: "sheets", highlight: true },
      { label: "Floor Area", value: Math.round(area), unit: "ft²" },
      { label: "Area with Waste", value: Math.round(area * waste), unit: "ft²" },
      { label: "Screws / Nails (est.)", value: nails, unit: "ea" },
    ];
  },
};
