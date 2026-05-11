import type { Calculator } from "../types";

export const drywallSheets: Calculator = {
  id: "drywall-sheets",
  name: "Drywall Sheets",
  description: "4×8 or 4×12 sheets for walls and ceilings",
  inputs: [
    { id: "wallArea", label: "Total Wall Area", unit: "ft²", type: "number", defaultValue: "800", min: 0 },
    { id: "ceilingArea", label: "Ceiling Area", unit: "ft²", type: "number", defaultValue: "400", min: 0 },
    { id: "doors", label: "Doors (3/0×6/8)", unit: "ea", type: "number", defaultValue: "3", min: 0 },
    { id: "windows", label: "Windows", unit: "ea", type: "number", defaultValue: "6", min: 0 },
    {
      id: "sheetSize", label: "Sheet Size", unit: "", type: "select",
      options: [
        { label: "4×8 (32 ft²)", value: "32" },
        { label: "4×9 (36 ft²)", value: "36" },
        { label: "4×12 (48 ft²)", value: "48" },
      ],
      defaultValue: "32",
    },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const walls = parseFloat(inputs.wallArea) || 0;
    const ceiling = parseFloat(inputs.ceilingArea) || 0;
    const doors = parseFloat(inputs.doors) || 0;
    const windows = parseFloat(inputs.windows) || 0;
    const sheetSqFt = parseFloat(inputs.sheetSize) || 32;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const openings = doors * 20 + windows * 15;
    const netArea = (walls + ceiling - openings) * waste;
    const sheets = Math.ceil(netArea / sheetSqFt);
    return [
      { label: "Sheets Needed", value: sheets, unit: "sheets", highlight: true },
      { label: "Net Area", value: Math.round(netArea), unit: "ft²" },
      { label: "Gross Area", value: Math.round(walls + ceiling), unit: "ft²" },
      { label: "Openings Deducted", value: Math.round(openings), unit: "ft²" },
    ];
  },
};
