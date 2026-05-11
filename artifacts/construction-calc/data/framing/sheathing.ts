import type { Calculator } from "../types";

export const sheathingSheets: Calculator = {
  id: "sheathing-sheets",
  name: "Plywood / OSB Sheets",
  description: "Sheet count for floors, walls, or roofs",
  inputs: [
    { id: "area", label: "Total Area", unit: "ft²", type: "number", defaultValue: "400", min: 0 },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const sheetArea = 32;
    const sheets = Math.ceil((area * waste) / sheetArea);
    return [
      { label: "Sheets Needed", value: sheets, unit: "sheets", highlight: true },
      { label: "Net Area", value: Math.round(area), unit: "ft²" },
      { label: "With Waste", value: Math.round(area * waste), unit: "ft²" },
    ];
  },
};
