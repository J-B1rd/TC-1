import type { Calculator } from "../types";

export const recessedLightSpacing: Calculator = {
  id: "recessed-light-spacing",
  name: "Recessed Light Spacing",
  description: "How many cans and where to place them for even lighting",
  inputs: [
    { id: "length", label: "Room Length", unit: "ft", type: "number", defaultValue: "16", min: 0 },
    { id: "width", label: "Room Width", unit: "ft", type: "number", defaultValue: "12", min: 0 },
    { id: "ceilingHt", label: "Ceiling Height", unit: "ft", type: "number", defaultValue: "9", min: 0 },
    {
      id: "canSize", label: "Can / Trim Size", unit: "", type: "select",
      options: [
        { label: "4\" (spread ~4–5 ft)", value: "4.5" },
        { label: "5\" (spread ~5–6 ft)", value: "5.5" },
        { label: "6\" (spread ~6–7 ft)", value: "6.5" },
      ],
      defaultValue: "6.5",
    },
    { id: "targetFc", label: "Target Foot-Candles", unit: "fc", type: "number", defaultValue: "30", min: 5 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const w = parseFloat(inputs.width) || 0;
    const h = parseFloat(inputs.ceilingHt) || 9;
    const spread = parseFloat(inputs.canSize) || 6.5;
    const fc = parseFloat(inputs.targetFc) || 30;
    const wallOffset = h / 2;
    const spacing = spread;
    const cols = Math.ceil(l / spacing);
    const rows = Math.ceil(w / spacing);
    const count = cols * rows;
    const lumensNeeded = l * w * fc / 0.7;
    const lumensPerCan = Math.round(lumensNeeded / Math.max(count, 1));
    return [
      { label: "Recessed Cans", value: count, unit: "cans", highlight: true },
      { label: "Grid Spacing", value: Math.round(spacing * 10) / 10, unit: "ft" },
      { label: "Wall Offset", value: Math.round(wallOffset * 10) / 10, unit: "ft from wall" },
      { label: "Lumens per Can", value: lumensPerCan, unit: "lumens" },
      { label: "Total Lumens Needed", value: Math.round(lumensNeeded), unit: "lm" },
    ];
  },
};
