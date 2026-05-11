import type { Calculator } from "../types";

export const mulchCalc: Calculator = {
  id: "mulch",
  name: "Mulch / Topsoil / Gravel",
  description: "Cubic yards or bags of bulk material",
  inputs: [
    { id: "area", label: "Coverage Area", unit: "ft²", type: "number", defaultValue: "500", min: 0 },
    { id: "depth", label: "Depth", unit: "in", type: "number", defaultValue: "3", min: 0, step: 0.5 },
    {
      id: "material", label: "Material", unit: "", type: "select",
      options: [
        { label: "Mulch (wood, shredded)", value: "mulch" },
        { label: "Topsoil", value: "topsoil" },
        { label: "Gravel / Stone", value: "gravel" },
        { label: "Sand", value: "sand" },
        { label: "Compost", value: "compost" },
      ],
      defaultValue: "mulch",
    },
    { id: "waste", label: "Extra / Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const depth = (parseFloat(inputs.depth) || 0) / 12;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const cubicFt = area * depth * waste;
    const cy = cubicFt / 27;
    const bags2cuFt = Math.ceil(cubicFt / 2);
    const weightMap: Record<string, number> = { mulch: 800, topsoil: 2000, gravel: 2800, sand: 2700, compost: 1000 };
    const lbsPerCy = weightMap[inputs.material] || 1500;
    const tons = (cy * lbsPerCy) / 2000;
    return [
      { label: "Cubic Yards", value: Math.round(cy * 100) / 100, unit: "yd³", highlight: true },
      { label: "2 cu ft Bags", value: bags2cuFt, unit: "bags" },
      { label: "Approx Weight", value: Math.round(tons * 100) / 100, unit: "tons" },
    ];
  },
};
