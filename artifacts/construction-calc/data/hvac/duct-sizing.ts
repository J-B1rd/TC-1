import type { Calculator } from "../types";

export const ductSizing: Calculator = {
  id: "duct-sizing",
  name: "Duct Sizing",
  description: "Round or rectangular duct size for a given CFM",
  inputs: [
    { id: "cfm", label: "Airflow", unit: "CFM", type: "number", defaultValue: "400", min: 0 },
    { id: "velocity", label: "Duct Velocity", unit: "FPM", type: "number", defaultValue: "800", min: 100 },
    {
      id: "type", label: "Duct Type", unit: "", type: "select",
      options: [
        { label: "Round", value: "round" },
        { label: "Rectangular", value: "rect" },
      ],
      defaultValue: "round",
    },
    { id: "height", label: "Rect Height (if applicable)", unit: "in", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const cfm = parseFloat(inputs.cfm) || 0;
    const velocity = parseFloat(inputs.velocity) || 800;
    const area = cfm / velocity;
    const areaSqIn = area * 144;
    const diam = Math.sqrt(areaSqIn / Math.PI) * 2;
    const h = parseFloat(inputs.height) || 10;
    const rectWidth = areaSqIn / h;
    return [
      { label: inputs.type === "round" ? "Round Diameter" : "Rect Width", value: Math.round((inputs.type === "round" ? diam : rectWidth) * 10) / 10, unit: "in", highlight: true },
      { label: "Duct Area", value: Math.round(areaSqIn * 10) / 10, unit: "in²" },
      { label: "Velocity", value: velocity, unit: "FPM" },
    ];
  },
};
