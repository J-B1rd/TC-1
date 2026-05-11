import type { Calculator } from "../types";

export const solarSizing: Calculator = {
  id: "solar-sizing",
  name: "Solar System Sizing",
  description: "Array size and panel count from energy usage",
  inputs: [
    { id: "monthlyKwh", label: "Monthly Usage", unit: "kWh/mo", type: "number", defaultValue: "1000", min: 0 },
    { id: "sunHours", label: "Peak Sun Hours / Day", unit: "hrs", type: "number", defaultValue: "5", min: 0.1, step: 0.5 },
    {
      id: "panelWatts", label: "Panel Wattage", unit: "", type: "select",
      options: [
        { label: "300W panel", value: "300" },
        { label: "350W panel", value: "350" },
        { label: "400W panel", value: "400" },
        { label: "450W panel", value: "450" },
        { label: "500W panel", value: "500" },
      ],
      defaultValue: "400",
    },
    { id: "systemLoss", label: "System Loss / Derating", unit: "%", type: "number", defaultValue: "20", min: 0 },
    { id: "offset", label: "Offset Goal", unit: "%", type: "number", defaultValue: "100", min: 0 },
  ],
  calculate: (inputs) => {
    const monthly = parseFloat(inputs.monthlyKwh) || 0;
    const sunHrs = parseFloat(inputs.sunHours) || 5;
    const panelW = parseFloat(inputs.panelWatts) || 400;
    const loss = 1 - (parseFloat(inputs.systemLoss) || 20) / 100;
    const offset = (parseFloat(inputs.offset) || 100) / 100;
    const dailyKwh = (monthly * offset) / 30.4;
    const systemKw = dailyKwh / (sunHrs * loss);
    const panels = Math.ceil((systemKw * 1000) / panelW);
    const annualProduction = systemKw * sunHrs * 365 * loss;
    return [
      { label: "System Size", value: Math.round(systemKw * 100) / 100, unit: "kW DC", highlight: true },
      { label: "Panels Needed", value: panels, unit: `× ${panelW}W panels` },
      { label: "Est. Annual Production", value: Math.round(annualProduction), unit: "kWh/yr" },
      { label: "Daily Target", value: Math.round(dailyKwh * 10) / 10, unit: "kWh/day" },
    ];
  },
};
