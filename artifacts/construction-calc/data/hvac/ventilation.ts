import type { Calculator } from "../types";

export const ventilationRate: Calculator = {
  id: "ventilation-rate",
  name: "Ventilation Rate (ASHRAE 62.2)",
  description: "Required fresh air CFM for a dwelling",
  inputs: [
    { id: "sqft", label: "Floor Area", unit: "ft²", type: "number", defaultValue: "2000", min: 1 },
    { id: "bedrooms", label: "Bedrooms", unit: "ea", type: "number", defaultValue: "3", min: 0 },
    { id: "ceilingHt", label: "Ceiling Height (for ACH)", unit: "ft", type: "number", defaultValue: "9", min: 1 },
  ],
  calculate: (inputs) => {
    const sqft = Math.max(parseFloat(inputs.sqft) || 0, 1);
    const bedrooms = Math.max(parseFloat(inputs.bedrooms) || 0, 0);
    const ht = Math.max(parseFloat(inputs.ceilingHt) || 9, 1);
    const occupants = bedrooms + 1;
    const cfm = 0.01 * sqft + 7.5 * occupants;
    const volume = sqft * ht;
    const ach = (cfm * 60) / volume;
    return [
      { label: "Required Ventilation", value: Math.ceil(cfm), unit: "CFM", highlight: true },
      { label: "Estimated ACH", value: Math.round(ach * 100) / 100, unit: "ACH" },
      { label: "Design Occupants", value: occupants, unit: "people" },
      { label: "Zone Volume", value: Math.round(volume), unit: "ft³" },
    ];
  },
};
