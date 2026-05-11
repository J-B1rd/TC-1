import type { Calculator } from "../types";

export const tileLayout: Calculator = {
  id: "tile-layout",
  name: "Tile Layout",
  description: "Tile count and grout for a floor or wall",
  inputs: [
    { id: "area", label: "Area to Tile", unit: "ft²", type: "number", defaultValue: "120", min: 0 },
    {
      id: "tileSize", label: "Tile Size", unit: "", type: "select",
      options: [
        { label: "12×12 (1 ft²)", value: "1" },
        { label: "18×18 (2.25 ft²)", value: "2.25" },
        { label: "24×24 (4 ft²)", value: "4" },
        { label: "12×24 (2 ft²)", value: "2" },
        { label: "3×6 subway (0.125 ft²)", value: "0.125" },
        { label: "4×4 (0.111 ft²)", value: "0.111" },
      ],
      defaultValue: "1",
    },
    { id: "waste", label: "Waste / Cuts", unit: "%", type: "number", defaultValue: "10", min: 0 },
    { id: "groutJoint", label: "Grout Joint Width", unit: "in", type: "number", defaultValue: "0.125", min: 0, step: 0.0625 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const tileSqFt = parseFloat(inputs.tileSize) || 1;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const tiles = Math.ceil((area * waste) / tileSqFt);
    const groutBags = Math.ceil(area / 50);
    return [
      { label: "Tiles Needed", value: tiles, unit: "tiles", highlight: true },
      { label: "Grout Bags (25lb)", value: groutBags, unit: "bags" },
      { label: "Area (w/ waste)", value: Math.round(area * waste), unit: "ft²" },
    ];
  },
};
