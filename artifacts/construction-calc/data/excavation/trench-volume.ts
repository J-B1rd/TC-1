import type { Calculator } from "../types";

export const trenchVolume: Calculator = {
  id: "trench-volume",
  name: "Trench Volume",
  description: "Cubic yards for a trench excavation",
  inputs: [
    { id: "length", label: "Trench Length", unit: "ft", type: "number", defaultValue: "100", min: 0 },
    { id: "width", label: "Trench Width", unit: "ft", type: "number", defaultValue: "2", min: 0 },
    { id: "depth", label: "Trench Depth", unit: "ft", type: "number", defaultValue: "4", min: 0 },
    { id: "swell", label: "Swell Factor", unit: "%", type: "number", defaultValue: "25", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const w = parseFloat(inputs.width) || 0;
    const d = parseFloat(inputs.depth) || 0;
    const swell = 1 + (parseFloat(inputs.swell) || 0) / 100;
    const bank = (l * w * d) / 27;
    const loose = bank * swell;
    return [
      { label: "Bank Volume", value: Math.round(bank * 100) / 100, unit: "yd³", highlight: true },
      { label: "Loose Volume (haul)", value: Math.round(loose * 100) / 100, unit: "yd³" },
      { label: "Trench Area", value: Math.round(l * w), unit: "ft²" },
    ];
  },
};
