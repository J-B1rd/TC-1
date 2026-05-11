import type { Calculator } from "../types";

export const swellFactor: Calculator = {
  id: "swell-factor",
  name: "Swell Factor",
  description: "Bank vs. loose vs. compacted volume",
  inputs: [
    { id: "bankCY", label: "Bank Volume", unit: "yd³", type: "number", defaultValue: "100", min: 0 },
    {
      id: "material", label: "Material", unit: "", type: "select",
      options: [
        { label: "Sand / Gravel (10–15% swell)", value: "12" },
        { label: "Common Soil (25–30% swell)", value: "27" },
        { label: "Clay (30–40% swell)", value: "35" },
        { label: "Rock (50–80% swell)", value: "65" },
        { label: "Loam (15–25% swell)", value: "20" },
      ],
      defaultValue: "27",
    },
  ],
  calculate: (inputs) => {
    const bank = parseFloat(inputs.bankCY) || 0;
    const swellPct = parseFloat(inputs.material) || 27;
    const loose = bank * (1 + swellPct / 100);
    const compacted = bank * 0.9;
    return [
      { label: "Loose Volume", value: Math.round(loose * 10) / 10, unit: "yd³ (truck load)", highlight: true },
      { label: "Bank Volume", value: bank, unit: "yd³" },
      { label: "Compacted Volume", value: Math.round(compacted * 10) / 10, unit: "yd³" },
      { label: "Swell", value: swellPct, unit: "%" },
    ];
  },
};
