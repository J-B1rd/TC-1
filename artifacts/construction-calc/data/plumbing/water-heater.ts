import type { Calculator } from "../types";

export const waterHeaterSizing: Calculator = {
  id: "water-heater-sizing",
  name: "Water Heater Sizing",
  description: "Tank size and BTU for your household demand",
  inputs: [
    { id: "people", label: "Number of People", unit: "people", type: "number", defaultValue: "4", min: 1 },
    { id: "showers", label: "Peak Showers at Once", unit: "showers", type: "number", defaultValue: "2", min: 0 },
    {
      id: "type", label: "Heater Type", unit: "", type: "select",
      options: [
        { label: "Standard Tank (Gas)", value: "gas_tank" },
        { label: "Standard Tank (Electric)", value: "elec_tank" },
        { label: "Tankless / On-Demand", value: "tankless" },
      ],
      defaultValue: "gas_tank",
    },
  ],
  calculate: (inputs) => {
    const people = parseFloat(inputs.people) || 1;
    const showers = parseFloat(inputs.showers) || 1;
    const peakGPH = (showers * 20) + ((people - showers) * 5);
    const firstHour = Math.ceil(peakGPH);
    const tankSize = inputs.type === "elec_tank"
      ? Math.ceil(people * 18 / 10) * 10
      : Math.ceil(people * 15 / 10) * 10;
    const tanklessGpm = showers * 2 + 1.5;
    return [
      { label: inputs.type === "tankless" ? "Required GPM" : "Recommended Tank", value: inputs.type === "tankless" ? Math.ceil(tanklessGpm * 10) / 10 : tankSize, unit: inputs.type === "tankless" ? "GPM" : "gal", highlight: true },
      { label: "First Hour Rating", value: firstHour, unit: "gal" },
      { label: "People", value: people, unit: "occupants" },
    ];
  },
};
