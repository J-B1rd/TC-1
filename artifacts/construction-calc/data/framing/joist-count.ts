import type { Calculator } from "../types";

export const joistCount: Calculator = {
  id: "joist-count",
  name: "Joist / Rafter Count",
  description: "Number of joists or rafters for a span",
  inputs: [
    { id: "span", label: "Span Length", unit: "ft", type: "number", defaultValue: "16", min: 0 },
    {
      id: "spacing", label: "Spacing", unit: "", type: "select",
      options: [
        { label: "12\" O.C.", value: "12" },
        { label: "16\" O.C.", value: "16" },
        { label: "19.2\" O.C.", value: "19.2" },
        { label: "24\" O.C.", value: "24" },
      ],
      defaultValue: "16",
    },
  ],
  calculate: (inputs) => {
    const span = parseFloat(inputs.span) || 0;
    const spacing = parseFloat(inputs.spacing) || 16;
    const count = Math.ceil((span * 12) / spacing) + 1;
    return [
      { label: "Joist / Rafter Count", value: count, unit: "pcs", highlight: true },
      { label: "Span", value: span, unit: "ft" },
    ];
  },
};
