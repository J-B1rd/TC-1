import type { Calculator } from "../types";

export const stoneVeneer: Calculator = {
  id: "stone-veneer",
  name: "Stone Veneer Coverage",
  description: "Coverage for natural or manufactured stone veneer",
  inputs: [
    { id: "area", label: "Wall Area", unit: "ft²", type: "number", defaultValue: "200", min: 0 },
    {
      id: "type", label: "Stone Type", unit: "", type: "select",
      options: [
        { label: "Manufactured Flat (1 ft² / each)", value: "1.0" },
        { label: "Corner Pieces (1 LF covers ~0.75 ft²)", value: "0.75" },
        { label: "Fieldstone / Rubble (1.1 ft²)", value: "1.1" },
        { label: "Ledgestone Panel (varies, ~6 SF/box)", value: "6.0" },
      ],
      defaultValue: "1.0",
    },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
    { id: "corners", label: "Corner Linear Feet", unit: "LF", type: "number", defaultValue: "0", min: 0 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const coverage = parseFloat(inputs.type) || 1.0;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const corners = parseFloat(inputs.corners) || 0;
    const flatArea = area * waste;
    const flatPieces = Math.ceil(flatArea / coverage);
    const cornerPieces = Math.ceil(corners);
    const mortarBags = Math.ceil(area / 25 * 0.5);
    return [
      { label: "Flat Stone Needed", value: flatPieces, unit: "pieces / ft²", highlight: true },
      { label: "Corner Pieces", value: cornerPieces, unit: "LF" },
      { label: "Scratch Coat Mortar", value: mortarBags, unit: "bags (Type S)" },
      { label: "Total Area", value: Math.round(area), unit: "ft²" },
    ];
  },
};
