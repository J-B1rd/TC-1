import type { Calculator } from "../types";

export const mortarMix: Calculator = {
  id: "mortar-mix",
  name: "Mortar Mix",
  description: "Bags of mortar for masonry work",
  inputs: [
    { id: "area", label: "Wall Area", unit: "ft²", type: "number", defaultValue: "100", min: 0 },
    {
      id: "type", label: "Mortar Type", unit: "", type: "select",
      options: [
        { label: "Type S (below grade, structural)", value: "S" },
        { label: "Type N (above grade, general)", value: "N" },
        { label: "Type M (heavy load, below grade)", value: "M" },
      ],
      defaultValue: "N",
    },
    {
      id: "unit", label: "Masonry Unit", unit: "", type: "select",
      options: [
        { label: "Brick — 7 bags per 100 ft²", value: "7" },
        { label: "CMU 8×8×16 — 3 bags per 100 ft²", value: "3" },
        { label: "Stone / Rubble — 10 bags per 100 ft²", value: "10" },
      ],
      defaultValue: "7",
    },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const bagsPerHundred = parseFloat(inputs.unit) || 7;
    const bags = Math.ceil((area / 100) * bagsPerHundred);
    const sand = Math.ceil(bags * 3);
    return [
      { label: "Mortar Bags (60lb)", value: bags, unit: "bags", highlight: true },
      { label: "Sand (approx)", value: sand, unit: "lbs" },
      { label: "Wall Area", value: Math.round(area), unit: "ft²" },
    ];
  },
};
