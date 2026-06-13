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
        { label: "19/32\" (5/8\") T&G OSB — 2.1 lb/ft²", value: "0.59:2.1" },
        { label: "23/32\" (3/4\") T&G OSB — 2.6 lb/ft²", value: "0.72:2.6" },
        { label: "3/4\" Plywood — 2.5 lb/ft²", value: "0.75:2.5" },
      ],
      defaultValue: "0.72:2.6",
    },
  ],
  calculate: (inputs) => {
    const l = Math.max(parseFloat(inputs.length) || 0, 0);
    const w = Math.max(parseFloat(inputs.width) || 0, 0);
    const waste = 1 + Math.max(parseFloat(inputs.waste) || 0, 0) / 100;
    const [, weightPerSqFtStr] = (inputs.thickness || "0.72:2.6").split(":");
    const weightPerSqFt = parseFloat(weightPerSqFtStr) || 2.6;
    const area = l * w;
    const sheets = Math.ceil((area * waste) / 32);
    const weightPerSheet = Math.round(32 * weightPerSqFt);
    const totalWeight = Math.round(sheets * weightPerSheet);
    const screws = Math.ceil(sheets * 80);
    return [
      { label: "4×8 Sheets", value: sheets, unit: "sheets", highlight: true },
      { label: "Panel Weight", value: weightPerSheet, unit: "lbs / sheet" },
      { label: "Total Panel Weight", value: totalWeight, unit: "lbs" },
      { label: "Floor Area (w/ waste)", value: Math.round(area * waste), unit: "ft²" },
      { label: "Screws / Nails (est.)", value: screws, unit: "ea" },
    ];
  },
};
