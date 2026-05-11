import type { Calculator } from "../types";

export const sodCalc: Calculator = {
  id: "sod",
  name: "Sod & Seed",
  description: "Pallets of sod or lbs of seed for a lawn area",
  inputs: [
    { id: "area", label: "Lawn Area", unit: "ft²", type: "number", defaultValue: "2000", min: 0 },
    {
      id: "type", label: "Installation Method", unit: "", type: "select",
      options: [
        { label: "Sod (pallets — 450 ft²/pallet)", value: "sod" },
        { label: "Seed — new lawn (4–6 lbs/1000 ft²)", value: "seed_new" },
        { label: "Seed — overseeding (2–3 lbs/1000 ft²)", value: "seed_over" },
      ],
      defaultValue: "sod",
    },
    { id: "waste", label: "Waste / Cuts", unit: "%", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const total = area * waste;
    if (inputs.type === "sod") {
      const pallets = Math.ceil(total / 450);
      const pieces = Math.ceil(total / 1.5);
      return [
        { label: "Pallets of Sod", value: pallets, unit: "pallets (450 ft²)", highlight: true },
        { label: "Individual Pieces", value: pieces, unit: "pieces" },
        { label: "Area (w/ waste)", value: Math.round(total), unit: "ft²" },
      ];
    } else {
      const lbsPer = inputs.type === "seed_new" ? 5 : 2.5;
      const lbs = Math.ceil((total / 1000) * lbsPer);
      return [
        { label: "Seed Needed", value: lbs, unit: "lbs", highlight: true },
        { label: "Area", value: Math.round(area), unit: "ft²" },
        { label: "Rate", value: lbsPer, unit: "lbs/1000 ft²" },
      ];
    }
  },
};
