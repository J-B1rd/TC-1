import type { Calculator } from "../types";

export const boardFeet: Calculator = {
  id: "board-feet",
  name: "Board Feet",
  description: "Calculate board feet of lumber",
  inputs: [
    { id: "thickness", label: "Thickness", unit: "in", type: "number", defaultValue: "2", min: 0 },
    { id: "width", label: "Width", unit: "in", type: "number", defaultValue: "6", min: 0 },
    { id: "length", label: "Length", unit: "ft", type: "number", defaultValue: "8", min: 0 },
    { id: "quantity", label: "Quantity", unit: "pcs", type: "number", defaultValue: "10", min: 1 },
  ],
  calculate: (inputs) => {
    const t = parseFloat(inputs.thickness) || 0;
    const w = parseFloat(inputs.width) || 0;
    const l = parseFloat(inputs.length) || 0;
    const qty = parseFloat(inputs.quantity) || 1;
    const bdFtEach = (t * w * l) / 12;
    const total = bdFtEach * qty;
    return [
      { label: "Total Board Feet", value: Math.round(total * 10) / 10, unit: "BF", highlight: true },
      { label: "Board Feet Each", value: Math.round(bdFtEach * 10) / 10, unit: "BF" },
    ];
  },
};
