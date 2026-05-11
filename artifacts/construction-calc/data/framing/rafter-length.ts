import type { Calculator } from "../types";

export const rafterLength: Calculator = {
  id: "rafter-length",
  name: "Rafter Length",
  description: "Common rafter length from span and pitch",
  inputs: [
    { id: "span", label: "Building Span (outside to outside)", unit: "ft", type: "number", defaultValue: "28", min: 0 },
    { id: "overhang", label: "Eave Overhang", unit: "in", type: "number", defaultValue: "12", min: 0 },
    { id: "rise", label: "Rise (in per 12\" run)", unit: "in", type: "number", defaultValue: "6", min: 0 },
    { id: "ridgeBoard", label: "Ridge Board Thickness", unit: "in", type: "number", defaultValue: "1.5", min: 0 },
  ],
  calculate: (inputs) => {
    const span = parseFloat(inputs.span) || 0;
    const overhang = (parseFloat(inputs.overhang) || 0) / 12;
    const rise = parseFloat(inputs.rise) || 0;
    const ridge = (parseFloat(inputs.ridgeBoard) || 0) / 12;
    const run = span / 2 - ridge / 2;
    const multiplier = Math.sqrt(rise * rise + 144) / 12;
    const rafterLen = run * multiplier;
    const totalLen = rafterLen + overhang * multiplier;
    return [
      { label: "Rafter Length (to ridge)", value: Math.round(rafterLen * 100) / 100, unit: "ft", highlight: true },
      { label: "Total w/ Overhang", value: Math.round(totalLen * 100) / 100, unit: "ft" },
      { label: "Run", value: Math.round(run * 100) / 100, unit: "ft" },
      { label: "Pitch Multiplier", value: Math.round(multiplier * 1000) / 1000, unit: "×" },
    ];
  },
};
