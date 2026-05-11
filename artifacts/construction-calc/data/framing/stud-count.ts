import type { Calculator } from "../types";

export const studCount: Calculator = {
  id: "stud-count",
  name: "Stud Count",
  description: "Number of studs for a wall",
  inputs: [
    { id: "length", label: "Wall Length", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    {
      id: "spacing", label: "Stud Spacing", unit: "", type: "select",
      options: [
        { label: "12\" O.C.", value: "12" },
        { label: "16\" O.C.", value: "16" },
        { label: "24\" O.C.", value: "24" },
      ],
      defaultValue: "16",
    },
    { id: "extra", label: "Extra (corners/openings)", unit: "studs", type: "number", defaultValue: "4", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const spacing = parseFloat(inputs.spacing) || 16;
    const extra = parseFloat(inputs.extra) || 0;
    const field = Math.ceil((l * 12) / spacing) + 1;
    const total = field + extra;
    return [
      { label: "Total Studs", value: total, unit: "studs", highlight: true },
      { label: "Field Studs", value: field, unit: "studs" },
      { label: "Extra (corners/headers)", value: extra, unit: "studs" },
    ];
  },
};
