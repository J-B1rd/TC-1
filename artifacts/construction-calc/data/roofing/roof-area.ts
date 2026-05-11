import type { Calculator } from "../types";

export const roofingArea: Calculator = {
  id: "roofing-area",
  name: "Roofing Area",
  description: "Total roof area adjusted for pitch",
  inputs: [
    { id: "length", label: "Building Length", unit: "ft", type: "number", defaultValue: "40", min: 0 },
    { id: "width", label: "Building Width", unit: "ft", type: "number", defaultValue: "30", min: 0 },
    { id: "rise", label: "Roof Pitch (rise per 12\")", unit: "in", type: "number", defaultValue: "6", min: 0 },
    { id: "overhang", label: "Eave Overhang", unit: "in", type: "number", defaultValue: "12", min: 0 },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const w = parseFloat(inputs.width) || 0;
    const rise = parseFloat(inputs.rise) || 0;
    const overhang = (parseFloat(inputs.overhang) || 0) / 12;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const multiplier = Math.sqrt(rise * rise + 144) / 12;
    const footprint = (l + overhang * 2) * (w + overhang * 2);
    const slope = footprint * multiplier;
    const squares = Math.ceil((slope * waste) / 100);
    return [
      { label: "Roof Squares", value: squares, unit: "squares", highlight: true },
      { label: "Slope Area", value: Math.round(slope), unit: "ft²" },
      { label: "Footprint", value: Math.round(footprint), unit: "ft²" },
      { label: "Pitch Multiplier", value: Math.round(multiplier * 1000) / 1000, unit: "×" },
    ];
  },
};
