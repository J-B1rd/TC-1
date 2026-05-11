import type { Calculator } from "../types";

export const underlaymentRolls: Calculator = {
  id: "underlayment-rolls",
  name: "Underlayment / Felt",
  description: "Rolls of roofing felt or synthetic underlayment needed",
  inputs: [
    { id: "area", label: "Roof Area", unit: "ft²", type: "number", defaultValue: "2000", min: 0 },
    { id: "overlap", label: "Row Overlap", unit: "in", type: "number", defaultValue: "4", min: 0 },
    {
      id: "rollType", label: "Product", unit: "", type: "select",
      options: [
        { label: "#15 Felt (4 sq / roll)", value: "400" },
        { label: "#30 Felt (2 sq / roll)", value: "200" },
        { label: "Synthetic (10 sq / roll)", value: "1000" },
        { label: "Ice & Water Shield (1 sq / roll)", value: "100" },
      ],
      defaultValue: "400",
    },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const sqPerRoll = parseFloat(inputs.rollType) || 400;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const overlapFactor = 1 + (parseFloat(inputs.overlap) || 0) / 12 * 0.05;
    const totalArea = area * waste * overlapFactor;
    const rolls = Math.ceil(totalArea / sqPerRoll);
    const squares = Math.ceil(totalArea / 100);
    return [
      { label: "Rolls Needed", value: rolls, unit: "rolls", highlight: true },
      { label: "Squares to Cover", value: squares, unit: "squares" },
      { label: "Total Area (w/ waste)", value: Math.round(totalArea), unit: "ft²" },
    ];
  },
};
