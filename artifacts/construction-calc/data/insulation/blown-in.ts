import type { Calculator } from "../types";

export const blownInInsulation: Calculator = {
  id: "blown-in",
  name: "Blown-In Insulation",
  description: "Bags of blown cellulose or fiberglass for attics",
  inputs: [
    { id: "area", label: "Attic / Floor Area", unit: "ft²", type: "number", defaultValue: "1000", min: 0 },
    {
      id: "rValue", label: "Target R-Value", unit: "", type: "select",
      options: [
        { label: "R-19 (~5.5\" cellulose)", value: "19" },
        { label: "R-30 (~8\" cellulose)", value: "30" },
        { label: "R-38 (~10\" cellulose)", value: "38" },
        { label: "R-49 (~13\" cellulose)", value: "49" },
        { label: "R-60 (~16\" cellulose)", value: "60" },
      ],
      defaultValue: "38",
    },
    {
      id: "material", label: "Material", unit: "", type: "select",
      options: [
        { label: "Cellulose (covers ~40 ft²/bag at R-38)", value: "cellulose" },
        { label: "Fiberglass (covers ~26 ft²/bag at R-38)", value: "fiberglass" },
      ],
      defaultValue: "cellulose",
    },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const r = parseFloat(inputs.rValue) || 38;
    const isCellulose = inputs.material === "cellulose";
    const baseCoverage = isCellulose ? 40 : 26;
    const rRatio = 38 / r;
    const bagCoverage = baseCoverage * rRatio;
    const bags = Math.ceil(area / bagCoverage);
    const depth = isCellulose ? (r / 3.7) : (r / 2.5);
    return [
      { label: "Bags Needed", value: bags, unit: "bags", highlight: true },
      { label: "Install Depth", value: Math.round(depth * 10) / 10, unit: "in" },
      { label: "Area", value: Math.round(area), unit: "ft²" },
      { label: "Coverage per Bag", value: Math.round(bagCoverage * 10) / 10, unit: "ft²" },
    ];
  },
};
