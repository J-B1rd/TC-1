import type { Calculator } from "../types";

export const snowLoad: Calculator = {
  id: "snow-load",
  name: "Roof Snow Load",
  description: "Balanced and unbalanced snow load on a sloped roof",
  inputs: [
    { id: "pg", label: "Ground Snow Load (Pg)", unit: "psf", type: "number", defaultValue: "30", min: 0 },
    { id: "rise", label: "Roof Slope (rise per 12\")", unit: "in", type: "number", defaultValue: "6", min: 0 },
    {
      id: "exposure", label: "Exposure Category", unit: "", type: "select",
      options: [
        { label: "Sheltered (Ce = 1.2)", value: "1.2" },
        { label: "Partially Exposed (Ce = 1.0)", value: "1.0" },
        { label: "Fully Exposed (Ce = 0.9)", value: "0.9" },
      ],
      defaultValue: "1.0",
    },
    {
      id: "thermal", label: "Thermal Factor", unit: "", type: "select",
      options: [
        { label: "Heated Building (Ct = 1.0)", value: "1.0" },
        { label: "Poorly Insulated (Ct = 1.1)", value: "1.1" },
        { label: "Unheated (Ct = 1.2)", value: "1.2" },
        { label: "Freezer / Cold Storage (Ct = 1.3)", value: "1.3" },
      ],
      defaultValue: "1.0",
    },
    { id: "is", label: "Importance Factor (Is)", unit: "", type: "number", defaultValue: "1.0", min: 0.8, step: 0.05 },
  ],
  calculate: (inputs) => {
    const pg = parseFloat(inputs.pg) || 0;
    const slope = parseFloat(inputs.rise) || 6;
    const Ce = parseFloat(inputs.exposure) || 1.0;
    const Ct = parseFloat(inputs.thermal) || 1.0;
    const Is = parseFloat(inputs.is) || 1.0;
    const pf = 0.7 * Ce * Ct * Is * pg;
    const deg = Math.atan(slope / 12) * (180 / Math.PI);
    const Cs = deg <= 30 ? 1.0 : deg <= 70 ? 1.0 - (deg - 30) / 40 : 0;
    const ps = Cs * pf;
    return [
      { label: "Flat Roof Snow Load (pf)", value: Math.round(pf * 10) / 10, unit: "psf", highlight: true },
      { label: "Sloped Roof Load (ps)", value: Math.round(ps * 10) / 10, unit: "psf" },
      { label: "Slope Factor (Cs)", value: Math.round(Cs * 100) / 100, unit: "" },
      { label: "Roof Pitch", value: slope, unit: "in / 12" },
    ];
  },
};
