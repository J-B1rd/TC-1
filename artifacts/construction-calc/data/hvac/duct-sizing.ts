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
    { id: "height", label: "Rect Height (if applicable)", unit: "in", type: "number", defaultValue: "10", min: 1 },
  ],
  calculate: (inputs) => {
    const cfm = Math.max(parseFloat(inputs.cfm) || 0, 0);
    const velocity = Math.max(parseFloat(inputs.velocity) || 800, 1);
    const h = Math.max(parseFloat(inputs.height) || 10, 1);
    if (cfm === 0) {
      return [
        { label: "Airflow Required", value: 0, unit: "CFM — enter a value above 0", highlight: true },
      ];
    }
    const areaSqFt = cfm / velocity;
    const areaSqIn = areaSqFt * 144;
    const diam = Math.sqrt((4 * areaSqIn) / Math.PI);
    const rectWidth = areaSqIn / h;
    const displayVal = inputs.type === "round" ? diam : rectWidth;
    return [
      { label: inputs.type === "round" ? "Round Diameter" : "Rect Width", value: Math.round(displayVal * 10) / 10, unit: "in", highlight: true },
      { label: "Duct Area", value: Math.round(areaSqIn * 10) / 10, unit: "in²" },
      { label: "Velocity", value: velocity, unit: "FPM" },
      { label: "Equiv. Round Diam.", value: Math.round(diam * 10) / 10, unit: "in" },
    ];
  },
};
