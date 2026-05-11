import type { Calculator } from "../types";

export const pressureLoss: Calculator = {
  id: "pressure-loss",
  name: "Water Pressure Loss",
  description: "Pressure drop through a pipe run",
  inputs: [
    { id: "gpm", label: "Flow Rate", unit: "GPM", type: "number", defaultValue: "10", min: 0 },
    { id: "length", label: "Pipe Length", unit: "ft", type: "number", defaultValue: "100", min: 0 },
    {
      id: "diameter", label: "Pipe Diameter", unit: "", type: "select",
      options: [
        { label: "1/2\"", value: "0.5" },
        { label: "3/4\"", value: "0.75" },
        { label: "1\"", value: "1.0" },
        { label: "1-1/4\"", value: "1.25" },
        { label: "1-1/2\"", value: "1.5" },
        { label: "2\"", value: "2.0" },
      ],
      defaultValue: "0.75",
    },
  ],
  calculate: (inputs) => {
    const gpm = parseFloat(inputs.gpm) || 0;
    const length = parseFloat(inputs.length) || 0;
    const d = parseFloat(inputs.diameter) || 0.75;
    const velocity = gpm / (0.7854 * d * d * 0.0408);
    const headLoss = (0.2083 * Math.pow(100 / 100, 1.852) * Math.pow(gpm, 1.852) * length) / (Math.pow(d, 4.8655));
    const psiLoss = headLoss * 0.4335;
    return [
      { label: "Pressure Loss", value: Math.round(psiLoss * 100) / 100, unit: "psi", highlight: true },
      { label: "Head Loss", value: Math.round(headLoss * 100) / 100, unit: "ft" },
      { label: "Flow Velocity", value: Math.round(velocity * 100) / 100, unit: "ft/s" },
    ];
  },
};
