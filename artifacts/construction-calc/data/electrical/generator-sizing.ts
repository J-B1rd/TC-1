import type { Calculator } from "../types";

export const generatorSizing: Calculator = {
  id: "generator-sizing",
  name: "Generator Sizing",
  description: "kW generator needed for your loads",
  inputs: [
    { id: "lights", label: "Lighting Load", unit: "W", type: "number", defaultValue: "2000", min: 0 },
    { id: "hvac", label: "A/C or Heat Pump", unit: "W", type: "number", defaultValue: "5000", min: 0 },
    { id: "motorStart", label: "Largest Motor Start (HP)", unit: "HP", type: "number", defaultValue: "5", min: 0 },
    { id: "outlets", label: "Receptacle / Misc Loads", unit: "W", type: "number", defaultValue: "3000", min: 0 },
    { id: "wellPump", label: "Well / Water Pump", unit: "W", type: "number", defaultValue: "0", min: 0 },
    { id: "safetyFactor", label: "Safety Factor", unit: "%", type: "number", defaultValue: "25", min: 0 },
  ],
  calculate: (inputs) => {
    const lights = parseFloat(inputs.lights) || 0;
    const hvac = parseFloat(inputs.hvac) || 0;
    const motorHp = parseFloat(inputs.motorStart) || 0;
    const outlets = parseFloat(inputs.outlets) || 0;
    const well = parseFloat(inputs.wellPump) || 0;
    const safety = 1 + (parseFloat(inputs.safetyFactor) || 25) / 100;
    const motorStartW = motorHp * 746 * 3;
    const runningW = lights + hvac + (motorHp * 746) + outlets + well;
    const startingW = lights + motorStartW + (hvac * 0.5) + outlets + well;
    const requiredKw = (Math.max(runningW, startingW) * safety) / 1000;
    let genSize = 5;
    for (const s of [3.5, 5, 7, 10, 12, 15, 17.5, 20, 22, 25, 30, 35, 40, 45, 50, 60, 75, 100]) {
      if (s >= requiredKw) { genSize = s; break; } else { genSize = s; }
    }
    return [
      { label: "Recommended Generator", value: genSize, unit: "kW", highlight: true },
      { label: "Running Load", value: Math.round(runningW / 100) / 10, unit: "kW" },
      { label: "Starting Load (surge)", value: Math.round(startingW / 100) / 10, unit: "kW" },
      { label: "With Safety Factor", value: Math.round(requiredKw * 10) / 10, unit: "kW" },
    ];
  },
};
