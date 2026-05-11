import type { Calculator } from "../types";

export const heatLossGain: Calculator = {
  id: "heat-loss-gain",
  name: "Simplified Heat Load (Manual J)",
  description: "Estimated heating and cooling load for a room or zone",
  inputs: [
    { id: "area", label: "Room / Zone Area", unit: "ft²", type: "number", defaultValue: "300", min: 0 },
    { id: "ceilingHt", label: "Ceiling Height", unit: "ft", type: "number", defaultValue: "9", min: 0 },
    { id: "windows", label: "Window Area", unit: "ft²", type: "number", defaultValue: "40", min: 0 },
    { id: "wallR", label: "Wall R-Value", unit: "R", type: "number", defaultValue: "13", min: 1 },
    { id: "designDelta", label: "Design Temp Difference (ΔT)", unit: "°F", type: "number", defaultValue: "55", min: 0 },
    {
      id: "climate", label: "Climate / Occupancy", unit: "", type: "select",
      options: [
        { label: "Cold Climate (heating dominant)", value: "heat" },
        { label: "Hot Climate (cooling dominant)", value: "cool" },
        { label: "Mixed Climate", value: "mixed" },
      ],
      defaultValue: "heat",
    },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const ht = parseFloat(inputs.ceilingHt) || 9;
    const winArea = parseFloat(inputs.windows) || 0;
    const wallR = parseFloat(inputs.wallR) || 13;
    const delta = parseFloat(inputs.designDelta) || 55;
    const wallArea = (area * 4 / Math.sqrt(area)) * ht - winArea;
    const uWall = 1 / wallR;
    const uCeiling = 1 / 30;
    const uWindow = 0.35;
    const wallLoss = uWall * wallArea * delta;
    const ceilLoss = uCeiling * area * delta;
    const winLoss = uWindow * winArea * delta;
    const infiltration = (area * ht * 0.5 * 0.018 * delta);
    const totalBtu = wallLoss + ceilLoss + winLoss + infiltration;
    const tons = totalBtu / 12000;
    return [
      { label: "Total Load", value: Math.round(totalBtu), unit: "BTU/hr", highlight: true },
      { label: "Tonnage", value: Math.round(tons * 10) / 10, unit: "tons" },
      { label: "Wall Loss", value: Math.round(wallLoss), unit: "BTU/hr" },
      { label: "Window Loss", value: Math.round(winLoss), unit: "BTU/hr" },
      { label: "Infiltration", value: Math.round(infiltration), unit: "BTU/hr" },
    ];
  },
};
