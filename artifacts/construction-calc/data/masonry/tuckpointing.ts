import type { Calculator } from "../types";

export const tuckpointing: Calculator = {
  id: "tuckpointing",
  name: "Tuckpointing Mortar",
  description: "Mortar needed to repoint an existing brick wall",
  inputs: [
    { id: "area", label: "Wall Area", unit: "ft²", type: "number", defaultValue: "100", min: 0 },
    { id: "joint", label: "Joint Width", unit: "in", type: "number", defaultValue: "0.375", min: 0, step: 0.0625 },
    { id: "depth", label: "Rake-Out Depth", unit: "in", type: "number", defaultValue: "0.75", min: 0 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const jw = parseFloat(inputs.joint) || 0.375;
    const jd = parseFloat(inputs.depth) || 0.75;
    const jointLF = area * 4.5;
    const cubicIn = jointLF * 12 * jw * jd;
    const cubicFt = cubicIn / 1728;
    const bags = Math.ceil(cubicFt / 0.25);
    return [
      { label: "Mortar Bags (60lb)", value: bags, unit: "bags", highlight: true },
      { label: "Joint Linear Feet", value: Math.round(jointLF), unit: "LF" },
      { label: "Mortar Volume", value: Math.round(cubicFt * 100) / 100, unit: "ft³" },
    ];
  },
};
