import type { Calculator } from "../types";

export const brickCount: Calculator = {
  id: "brick-count",
  name: "Brick Count",
  description: "Number of bricks and mortar for a wall",
  inputs: [
    { id: "length", label: "Wall Length", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    { id: "height", label: "Wall Height", unit: "ft", type: "number", defaultValue: "6", min: 0 },
    {
      id: "brickSize", label: "Brick Size", unit: "", type: "select",
      options: [
        { label: "Standard (7-5/8\" × 2-1/4\" × 3-5/8\")", value: "6.75" },
        { label: "Modular (7-5/8\" × 2-1/4\" × 3-5/8\")", value: "6.75" },
        { label: "Queen (9-5/8\" × 2-3/4\" × 2-3/4\")", value: "5.76" },
        { label: "Jumbo (7-5/8\" × 2-3/4\" × 3-5/8\")", value: "5.76" },
      ],
      defaultValue: "6.75",
    },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "5", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const h = parseFloat(inputs.height) || 0;
    const bricksPerSqFt = parseFloat(inputs.brickSize) || 6.75;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const area = l * h;
    const bricks = Math.ceil(area * bricksPerSqFt * waste);
    const mortarBags = Math.ceil(bricks / 30);
    return [
      { label: "Bricks Needed", value: bricks, unit: "bricks", highlight: true },
      { label: "Wall Area", value: Math.round(area), unit: "ft²" },
      { label: "Mortar Bags (60lb)", value: mortarBags, unit: "bags" },
    ];
  },
};
