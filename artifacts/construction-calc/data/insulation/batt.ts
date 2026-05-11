import type { Calculator } from "../types";

export const battInsulation: Calculator = {
  id: "batt-insulation",
  name: "Batt / Roll Insulation",
  description: "Bags or rolls of fiberglass or mineral wool batts",
  inputs: [
    { id: "area", label: "Area to Insulate", unit: "ft²", type: "number", defaultValue: "500", min: 0 },
    {
      id: "rValue", label: "Target R-Value", unit: "", type: "select",
      options: [
        { label: "R-11 (2×4 wall, 3.5\")", value: "R11" },
        { label: "R-13 (2×4 wall, 3.5\")", value: "R13" },
        { label: "R-15 (2×4 wall, 3.5\" HD)", value: "R15" },
        { label: "R-19 (2×6 wall, 5.5\")", value: "R19" },
        { label: "R-21 (2×6 wall, 5.5\" HD)", value: "R21" },
        { label: "R-30 (floor/attic, 9.5\")", value: "R30" },
        { label: "R-38 (attic, 12\")", value: "R38" },
        { label: "R-49 (attic, 16\")", value: "R49" },
      ],
      defaultValue: "R13",
    },
    {
      id: "spacing", label: "Framing Spacing", unit: "", type: "select",
      options: [
        { label: "16\" O.C.", value: "16" },
        { label: "24\" O.C.", value: "24" },
      ],
      defaultValue: "16",
    },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "5", min: 0 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const coverageMap: Record<string, [number, string]> = {
      R11: [40, "40 ft²/roll"],
      R13: [40, "40 ft²/roll"],
      R15: [32, "32 ft²/roll"],
      R19: [48, "48 ft²/roll"],
      R21: [40, "40 ft²/roll"],
      R30: [40, "40 ft²/roll"],
      R38: [32, "32 ft²/bag"],
      R49: [24, "24 ft²/bag"],
    };
    const [covPer] = coverageMap[inputs.rValue] || [40, "40 ft²"];
    const rolls = Math.ceil((area * waste) / covPer);
    const vapor = Math.ceil(area * 1.1 / 200);
    return [
      { label: "Rolls / Bags", value: rolls, unit: "rolls", highlight: true },
      { label: "Area (w/ waste)", value: Math.round(area * waste), unit: "ft²" },
      { label: "Vapor Barrier Rolls", value: vapor, unit: "rolls (200 ft²)" },
    ];
  },
};
