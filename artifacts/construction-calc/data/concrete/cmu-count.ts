import type { Calculator } from "../types";

export const cmuCount: Calculator = {
  id: "cmu-count",
  name: "CMU Block Count",
  description: "Number of concrete masonry units for a wall",
  inputs: [
    { id: "length", label: "Wall Length", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    { id: "height", label: "Wall Height", unit: "ft", type: "number", defaultValue: "8", min: 0 },
    {
      id: "size", label: "Block Size (W×H×L nominal)", unit: "", type: "select",
      options: [
        { label: "8×8×16 standard", value: "1.125:30" },
        { label: "4×8×16 half-height", value: "2.25:40" },
        { label: "6×8×16 (6\" wide)", value: "1.125:28" },
        { label: "12×8×16 (12\" wide)", value: "1.125:22" },
      ],
      defaultValue: "1.125:30",
    },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "5", min: 0 },
  ],
  calculate: (inputs) => {
    const l = Math.max(parseFloat(inputs.length) || 0, 0);
    const h = Math.max(parseFloat(inputs.height) || 0, 0);
    const [blocksPerSqFtStr, mortarDivisorStr] = (inputs.size || "1.125:30").split(":");
    const blocksPerSqFt = parseFloat(blocksPerSqFtStr) || 1.125;
    const mortarDivisor = parseFloat(mortarDivisorStr) || 30;
    const area = l * h;
    const waste = 1 + Math.max(parseFloat(inputs.waste) || 0, 0) / 100;
    const blocks = Math.ceil(area * blocksPerSqFt * waste);
    const mortar = Math.ceil(blocks / mortarDivisor);
    return [
      { label: "Block Count", value: blocks, unit: "blocks", highlight: true },
      { label: "Wall Area", value: Math.round(area), unit: "ft²" },
      { label: "Mortar Bags (70 lb)", value: mortar, unit: "bags" },
    ];
  },
};
