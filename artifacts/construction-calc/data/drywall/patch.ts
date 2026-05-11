import type { Calculator } from "../types";

export const drywallPatch: Calculator = {
  id: "drywall-patch",
  name: "Patch / Repair Area",
  description: "Material for patching drywall holes or damaged sections",
  inputs: [
    { id: "holes", label: "Small Holes (< 6\")", unit: "ea", type: "number", defaultValue: "3", min: 0 },
    { id: "medPatches", label: "Medium Patches (6\"–24\")", unit: "ea", type: "number", defaultValue: "1", min: 0 },
    { id: "largePatches", label: "Large Patches (> 24\")", unit: "ft²", type: "number", defaultValue: "0", min: 0 },
  ],
  calculate: (inputs) => {
    const small = parseFloat(inputs.holes) || 0;
    const med = parseFloat(inputs.medPatches) || 0;
    const large = parseFloat(inputs.largePatches) || 0;
    const mudQts = Math.ceil(small * 0.1 + med * 0.5 + large * 0.25);
    const sandpaperSheets = Math.ceil(small * 1 + med * 2 + large * 1);
    const primerQts = Math.ceil((small + med + large) / 10);
    return [
      { label: "Joint Compound (qt)", value: Math.max(mudQts, 1), unit: "qts", highlight: true },
      { label: "Sandpaper Sheets", value: sandpaperSheets, unit: "sheets (120g)" },
      { label: "Primer (qt)", value: Math.max(primerQts, 1), unit: "qts" },
    ];
  },
};
