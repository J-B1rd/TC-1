import type { Calculator } from "../types";

export const refrigerantLineSizing: Calculator = {
  id: "refrigerant-line-sizing",
  name: "Refrigerant Line Set",
  description: "Suction and liquid line sizes by tonnage and refrigerant",
  inputs: [
    { id: "tons", label: "System Tonnage", unit: "tons", type: "number", defaultValue: "3", min: 0.5, step: 0.5 },
    {
      id: "refrigerant", label: "Refrigerant", unit: "", type: "select",
      options: [
        { label: "R-410A (standard HFC)", value: "r410" },
        { label: "R-22 (legacy — needs larger lines)", value: "r22" },
        { label: "R-32 (can use slightly smaller)", value: "r32" },
        { label: "R-454B / Puron Advance (≈R-410A)", value: "r454" },
      ],
      defaultValue: "r410",
    },
    { id: "lineLength", label: "Line Set Length", unit: "ft", type: "number", defaultValue: "25", min: 0 },
  ],
  calculate: (inputs) => {
    const tons = Math.max(parseFloat(inputs.tons) || 3, 0.5);
    const length = Math.max(parseFloat(inputs.lineLength) || 25, 0);
    const ref = inputs.refrigerant || "r410";
    const tonsFactor = ref === "r22" ? 1.15 : ref === "r32" ? 0.90 : 1.0;
    const effectiveTons = tons * tonsFactor;
    let suction = "3/4\"", liquid = "3/8\"";
    if (effectiveTons <= 1.5) { suction = "5/8\""; liquid = "3/8\""; }
    else if (effectiveTons <= 2.5) { suction = "3/4\""; liquid = "3/8\""; }
    else if (effectiveTons <= 3.5) { suction = "7/8\""; liquid = "3/8\""; }
    else if (effectiveTons <= 5) { suction = "1-1/8\""; liquid = "1/2\""; }
    else if (effectiveTons <= 7.5) { suction = "1-3/8\""; liquid = "1/2\""; }
    else { suction = "1-5/8\""; liquid = "5/8\""; }
    const longLineNote = length > 50
      ? "> 50 ft: verify w/ mfr specs, may need additional charge"
      : "Line length OK — no derating needed";
    return [
      { label: "Suction Line OD", value: 0, unit: suction, highlight: true },
      { label: "Liquid Line OD", value: 0, unit: liquid },
      { label: "Refrigerant Factor", value: Math.round(tonsFactor * 100) / 100, unit: "× (sizing adj.)" },
      { label: "Long Line Note", value: 0, unit: longLineNote },
    ];
  },
};
