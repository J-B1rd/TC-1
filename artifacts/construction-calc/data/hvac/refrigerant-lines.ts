import type { Calculator } from "../types";

export const refrigerantLineSizing: Calculator = {
  id: "refrigerant-line-sizing",
  name: "Refrigerant Line Set",
  description: "Suction and liquid line sizes by tonnage",
  inputs: [
    { id: "tons", label: "System Tonnage", unit: "tons", type: "number", defaultValue: "3", min: 0.5, step: 0.5 },
    {
      id: "refrigerant", label: "Refrigerant", unit: "", type: "select",
      options: [
        { label: "R-410A", value: "r410" },
        { label: "R-22 (legacy)", value: "r22" },
        { label: "R-32", value: "r32" },
        { label: "R-454B (Puron Advance)", value: "r454" },
      ],
      defaultValue: "r410",
    },
    { id: "lineLength", label: "Line Set Length", unit: "ft", type: "number", defaultValue: "25", min: 0 },
  ],
  calculate: (inputs) => {
    const tons = parseFloat(inputs.tons) || 3;
    const length = parseFloat(inputs.lineLength) || 25;
    let suction = "3/4\"", liquid = "3/8\"";
    if (tons <= 1.5) { suction = "5/8\""; liquid = "3/8\""; }
    else if (tons <= 2.5) { suction = "3/4\""; liquid = "3/8\""; }
    else if (tons <= 3.5) { suction = "7/8\""; liquid = "3/8\""; }
    else if (tons <= 5) { suction = "1-1/8\""; liquid = "1/2\""; }
    else if (tons <= 7.5) { suction = "1-3/8\""; liquid = "1/2\""; }
    else { suction = "1-5/8\""; liquid = "5/8\""; }
    const needsUpsize = length > 50 && tons >= 2;
    return [
      { label: "Suction Line OD", value: 0, unit: suction + (needsUpsize ? " (upsize)*" : ""), highlight: true },
      { label: "Liquid Line OD", value: 0, unit: liquid },
      { label: "System Capacity", value: tons * 12000, unit: "BTU/hr" },
      { label: "Long Line Note", value: 0, unit: length > 50 ? "> 50 ft: verify w/ mfr" : "Line length OK" },
    ];
  },
};
