import type { Calculator } from "../types";

export const rValueCalc: Calculator = {
  id: "r-value-stack",
  name: "R-Value Stack-Up",
  description: "Total wall or roof assembly R-value from multiple layers",
  inputs: [
    { id: "sheathing", label: "Sheathing (OSB/ply 1/2\")", unit: "R", type: "number", defaultValue: "0.63", min: 0, step: 0.01 },
    { id: "cavity", label: "Cavity Insulation", unit: "R", type: "number", defaultValue: "13", min: 0 },
    { id: "rigidFoamR", label: "Continuous Rigid Foam", unit: "R", type: "number", defaultValue: "5", min: 0 },
    { id: "drywall", label: "Drywall 1/2\"", unit: "R", type: "number", defaultValue: "0.45", min: 0, step: 0.01 },
    { id: "siding", label: "Siding / Cladding", unit: "R", type: "number", defaultValue: "0.81", min: 0, step: 0.01 },
    { id: "airFilms", label: "Air Films (inside + outside)", unit: "R", type: "number", defaultValue: "0.92", min: 0, step: 0.01 },
  ],
  calculate: (inputs) => {
    const layers = [
      parseFloat(inputs.sheathing) || 0,
      parseFloat(inputs.cavity) || 0,
      parseFloat(inputs.rigidFoamR) || 0,
      parseFloat(inputs.drywall) || 0,
      parseFloat(inputs.siding) || 0,
      parseFloat(inputs.airFilms) || 0,
    ];
    const totalR = layers.reduce((a, b) => a + b, 0);
    const uValue = totalR > 0 ? 1 / totalR : 0;
    return [
      { label: "Total R-Value", value: Math.round(totalR * 100) / 100, unit: "R", highlight: true },
      { label: "U-Factor", value: Math.round(uValue * 10000) / 10000, unit: "BTU/hr·ft²·°F" },
      { label: "Cavity Only", value: parseFloat(inputs.cavity) || 0, unit: "R" },
      { label: "Continuous Foam", value: parseFloat(inputs.rigidFoamR) || 0, unit: "R" },
    ];
  },
};
