import type { Calculator } from "../types";

export const septicSizing: Calculator = {
  id: "septic-sizing",
  name: "Septic Tank Sizing",
  description: "Minimum tank gallons and leach field for a home",
  inputs: [
    { id: "bedrooms", label: "Bedrooms", unit: "ea", type: "number", defaultValue: "3", min: 1 },
    {
      id: "soilPerc", label: "Soil Percolation Rate", unit: "", type: "select",
      options: [
        { label: "Fast (< 3 min/in) — sandy", value: "fast" },
        { label: "Moderate (3–30 min/in) — loam", value: "mod" },
        { label: "Slow (30–60 min/in) — clay", value: "slow" },
      ],
      defaultValue: "mod",
    },
  ],
  calculate: (inputs) => {
    const br = parseFloat(inputs.bedrooms) || 3;
    const perc = inputs.soilPerc;
    const tankGal = br <= 2 ? 1000 : 1000 + (br - 2) * 250;
    const dailyFlow = br * 75;
    const sqftPerGpd = perc === "fast" ? 0.8 : perc === "mod" ? 1.2 : 2.0;
    const leachSqFt = Math.ceil(dailyFlow * sqftPerGpd);
    const totalSqFt = leachSqFt * 2;
    return [
      { label: "Minimum Tank Size", value: tankGal, unit: "gal", highlight: true },
      { label: "Daily Flow", value: dailyFlow, unit: "GPD" },
      { label: "Primary Field", value: leachSqFt, unit: "ft²" },
      { label: "Total (w/ 100% reserve)", value: totalSqFt, unit: "ft²" },
    ];
  },
};
