import type { Calculator } from "../types";

export const retainingWall: Calculator = {
  id: "retaining-wall",
  name: "Retaining Wall Block",
  description: "Block count and drainage stone for a retaining wall",
  inputs: [
    { id: "length", label: "Wall Length", unit: "ft", type: "number", defaultValue: "30", min: 0 },
    { id: "height", label: "Wall Height", unit: "ft", type: "number", defaultValue: "3", min: 0, step: 0.5 },
    {
      id: "blockType", label: "Block Type", unit: "", type: "select",
      options: [
        { label: "Allan Block / 6\"×18\" (0.75 ft² face)", value: "0.75" },
        { label: "Versa-Lok / 6\"×16\" (0.67 ft² face)", value: "0.67" },
        { label: "Keystone 6\"×16\" (0.67 ft² face)", value: "0.67" },
        { label: "Natural Stone ~12\"×18\" (1.5 ft²)", value: "1.5" },
      ],
      defaultValue: "0.75",
    },
    { id: "waste", label: "Waste / Cuts", unit: "%", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const h = parseFloat(inputs.height) || 0;
    const blockFace = parseFloat(inputs.blockType) || 0.75;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const faceArea = l * h;
    const blocks = Math.ceil((faceArea * waste) / blockFace);
    const drainageCY = Math.ceil((l * (h + 0.5) * 1) / 27);
    const capBlocks = Math.ceil(l * 1.05 / 1.5);
    return [
      { label: "Wall Block Count", value: blocks, unit: "blocks", highlight: true },
      { label: "Cap Blocks", value: capBlocks, unit: "blocks" },
      { label: "Drainage Stone", value: drainageCY, unit: "yd³" },
      { label: "Face Area", value: Math.round(faceArea), unit: "ft²" },
    ];
  },
};
