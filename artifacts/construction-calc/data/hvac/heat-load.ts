import type { Calculator } from "../types";

export const heatLossGain: Calculator = {
  id: "heat-loss-gain",
  name: "Simplified Heat Load (Manual J)",
  description: "Estimated heating or cooling load for a room or zone",
  inputs: [
    { id: "area", label: "Room / Zone Area", unit: "ft²", type: "number", defaultValue: "300", min: 0 },
    { id: "ceilingHt", label: "Ceiling Height", unit: "ft", type: "number", defaultValue: "9", min: 0 },
    { id: "windows", label: "Window Area", unit: "ft²", type: "number", defaultValue: "40", min: 0 },
    { id: "wallR", label: "Wall R-Value", unit: "R", type: "number", defaultValue: "13", min: 1 },
    { id: "designDelta", label: "Design Temp Difference (ΔT)", unit: "°F", type: "number", defaultValue: "55", min: 0 },
    {
      id: "climate", label: "Mode", unit: "", type: "select",
      options: [
        { label: "Heating (heat loss only)", value: "heat" },
        { label: "Cooling (adds solar + internal loads)", value: "cool" },
        { label: "Mixed (show both)", value: "mixed" },
      ],
      defaultValue: "heat",
    },
  ],
  calculate: (inputs) => {
    const area = Math.max(parseFloat(inputs.area) || 0, 0);
    const ht = Math.max(parseFloat(inputs.ceilingHt) || 9, 0.1);
    const winArea = Math.max(parseFloat(inputs.windows) || 0, 0);
    const wallR = Math.max(parseFloat(inputs.wallR) || 13, 0.1);
    const delta = Math.max(parseFloat(inputs.designDelta) || 55, 0);
    const perimeter = area > 0 ? (4 * Math.sqrt(area)) : 0;
    const wallArea = Math.max(perimeter * ht - winArea, 0);
    const uWall = 1 / wallR;
    const uCeiling = 1 / 30;
    const uWindow = 0.35;
    const wallLoss = uWall * wallArea * delta;
    const ceilLoss = uCeiling * area * delta;
    const winLoss = uWindow * winArea * delta;
    const infiltration = area * ht * 0.5 * 0.018 * delta;
    const heatingLoad = wallLoss + ceilLoss + winLoss + infiltration;
    const solarGain = winArea * 200;
    const internalLoads = area * 3;
    const coolingLoad = wallLoss + ceilLoss + (uWindow * winArea * delta * 0.6) + infiltration * 0.7 + solarGain + internalLoads;
    const mode = inputs.climate || "heat";
    if (mode === "heat") {
      return [
        { label: "Heating Load", value: Math.round(heatingLoad), unit: "BTU/hr", highlight: true },
        { label: "Tonnage (heat)", value: Math.round(heatingLoad / 12000 * 10) / 10, unit: "tons" },
        { label: "Wall Loss", value: Math.round(wallLoss), unit: "BTU/hr" },
        { label: "Window Loss", value: Math.round(winLoss), unit: "BTU/hr" },
        { label: "Infiltration", value: Math.round(infiltration), unit: "BTU/hr" },
      ];
    } else if (mode === "cool") {
      return [
        { label: "Cooling Load", value: Math.round(coolingLoad), unit: "BTU/hr", highlight: true },
        { label: "Tonnage (cooling)", value: Math.round(coolingLoad / 12000 * 10) / 10, unit: "tons" },
        { label: "Solar Gain", value: Math.round(solarGain), unit: "BTU/hr" },
        { label: "Internal Loads", value: Math.round(internalLoads), unit: "BTU/hr" },
        { label: "Conductive Loss", value: Math.round(wallLoss + ceilLoss + winLoss), unit: "BTU/hr" },
      ];
    } else {
      return [
        { label: "Heating Load", value: Math.round(heatingLoad), unit: "BTU/hr", highlight: true },
        { label: "Heating Tonnage", value: Math.round(heatingLoad / 12000 * 10) / 10, unit: "tons" },
        { label: "Cooling Load", value: Math.round(coolingLoad), unit: "BTU/hr" },
        { label: "Cooling Tonnage", value: Math.round(coolingLoad / 12000 * 10) / 10, unit: "tons" },
        { label: "Solar Gain", value: Math.round(solarGain), unit: "BTU/hr" },
      ];
    }
  },
};
