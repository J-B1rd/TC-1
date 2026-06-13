import type { Calculator } from "../types";

export const pressureLoss: Calculator = {
  id: "pressure-loss",
  name: "Water Pressure Loss",
  description: "Pressure drop through a pipe run (Hazen-Williams)",
  inputs: [
    { id: "gpm", label: "Flow Rate", unit: "GPM", type: "number", defaultValue: "10", min: 0 },
    { id: "length", label: "Pipe Length", unit: "ft", type: "number", defaultValue: "100", min: 0 },
    {
      id: "diameter", label: "Pipe Diameter", unit: "", type: "select",
      options: [
        { label: "1/2\"", value: "0.622" },
        { label: "3/4\"", value: "0.824" },
        { label: "1\"", value: "1.049" },
        { label: "1-1/4\"", value: "1.380" },
        { label: "1-1/2\"", value: "1.610" },
        { label: "2\"", value: "2.067" },
      ],
      defaultValue: "0.824",
    },
    {
      id: "material", label: "Pipe Material (C factor)", unit: "", type: "select",
      options: [
        { label: "Copper (C = 130)", value: "130" },
        { label: "PEX (C = 140)", value: "140" },
        { label: "PVC / CPVC (C = 150)", value: "150" },
        { label: "Steel / Iron (C = 100)", value: "100" },
      ],
      defaultValue: "130",
    },
  ],
  calculate: (inputs) => {
    const gpm = Math.max(parseFloat(inputs.gpm) || 0, 0);
    const length = Math.max(parseFloat(inputs.length) || 0, 0);
    const d = Math.max(parseFloat(inputs.diameter) || 0.824, 0.1);
    const C = Math.max(parseFloat(inputs.material) || 130, 1);
    if (gpm === 0 || length === 0) {
      return [
        { label: "Pressure Loss", value: 0, unit: "psi", highlight: true },
        { label: "Head Loss", value: 0, unit: "ft" },
        { label: "Flow Velocity", value: 0, unit: "fps" },
      ];
    }
    const headLoss = (10.67 * length * Math.pow(gpm / C, 1.852)) / Math.pow(d, 4.8704);
    const psiLoss = headLoss * 0.4335;
    const areaSqFt = Math.PI * (d / 2) ** 2 / 144;
    const fps = gpm / (areaSqFt * 7.48 * 60);
    return [
      { label: "Pressure Loss", value: Math.round(psiLoss * 100) / 100, unit: "psi", highlight: true },
      { label: "Head Loss", value: Math.round(headLoss * 100) / 100, unit: "ft" },
      { label: "Flow Velocity", value: Math.round(fps * 100) / 100, unit: "fps" },
      { label: "C Factor (material)", value: C, unit: "" },
    ];
  },
};
