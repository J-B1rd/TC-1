import type { Calculator } from "../types";

export const cmuCount: Calculator = {
  id: "cmu-count",
  name: "CMU Block Count",
  description: "Number of concrete masonry units for a wall",
  inputs: [
    { id: "length", label: "Wall Length", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    { id: "height", label: "Wall Height", unit: "ft", type: "number", defaultValue: "8", min: 0 },
    {
      id: "size", label: "Block Size", unit: "", type: "select",
      options: [
        { label: "8×8×16", value: "0.89" },
        { label: "4×8×16", value: "0.89" },
        { label: "6×8×16", value: "0.89" },
        { label: "12×8×16", value: "0.89" },
      ],
      defaultValue: "0.89",
    },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "5", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const h = parseFloat(inputs.height) || 0;
    const area = l * h;
    const blocksPerSqFt = 1.125;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const blocks = Math.ceil(area * blocksPerSqFt * waste);
    const mortar = Math.ceil(blocks / 30);
    return [
      { label: "Block Count", value: blocks, unit: "blocks", highlight: true },
      { label: "Wall Area", value: Math.round(area), unit: "ft²" },
      { label: "Mortar Bags (70lb)", value: mortar, unit: "bags" },
    ];
  },
};
