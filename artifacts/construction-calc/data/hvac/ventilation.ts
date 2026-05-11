import type { Calculator } from "../types";

export const ventilationRate: Calculator = {
  id: "ventilation-rate",
  name: "Ventilation Rate (ASHRAE 62.2)",
  description: "Required fresh air CFM for a dwelling",
  inputs: [
    { id: "sqft", label: "Floor Area", unit: "ft²", type: "number", defaultValue: "2000", min: 0 },
    { id: "bedrooms", label: "Bedrooms", unit: "ea", type: "number", defaultValue: "3", min: 0 },
  ],
  calculate: (inputs) => {
    const sqft = parseFloat(inputs.sqft) || 0;
    const bedrooms = parseFloat(inputs.bedrooms) || 0;
    const occupants = bedrooms + 1;
    const cfm = 0.01 * sqft + 7.5 * occupants;
    const ach = (cfm * 60) / (sqft * 9);
    return [
      { label: "Required Ventilation", value: Math.ceil(cfm), unit: "CFM", highlight: true },
      { label: "Estimated ACH", value: Math.round(ach * 100) / 100, unit: "ACH" },
      { label: "Design Occupants", value: occupants, unit: "people" },
    ];
  },
};
