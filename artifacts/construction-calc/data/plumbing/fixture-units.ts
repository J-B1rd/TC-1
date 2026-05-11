import type { Calculator } from "../types";

export const fixtureUnits: Calculator = {
  id: "fixture-units",
  name: "Fixture Units (DFU)",
  description: "Total drainage fixture units for a system",
  inputs: [
    { id: "toilets", label: "Toilets / Water Closets", unit: "ea", type: "number", defaultValue: "2", min: 0 },
    { id: "sinks", label: "Lavatories / Sinks", unit: "ea", type: "number", defaultValue: "2", min: 0 },
    { id: "bathtubs", label: "Bathtubs / Showers", unit: "ea", type: "number", defaultValue: "1", min: 0 },
    { id: "dishwasher", label: "Dishwashers", unit: "ea", type: "number", defaultValue: "1", min: 0 },
    { id: "washingMachine", label: "Washing Machines", unit: "ea", type: "number", defaultValue: "1", min: 0 },
    { id: "floorDrains", label: "Floor Drains", unit: "ea", type: "number", defaultValue: "0", min: 0 },
  ],
  calculate: (inputs) => {
    const toilets = parseFloat(inputs.toilets) || 0;
    const sinks = parseFloat(inputs.sinks) || 0;
    const bathtubs = parseFloat(inputs.bathtubs) || 0;
    const dw = parseFloat(inputs.dishwasher) || 0;
    const wm = parseFloat(inputs.washingMachine) || 0;
    const fd = parseFloat(inputs.floorDrains) || 0;
    const total = (toilets * 4) + (sinks * 1) + (bathtubs * 2) + (dw * 2) + (wm * 3) + (fd * 2);
    let minBranchSize = "2\"";
    if (total > 8) minBranchSize = "3\"";
    if (total > 20) minBranchSize = "4\"";
    return [
      { label: "Total DFUs", value: total, unit: "DFU", highlight: true },
      { label: "Min Branch Drain Size", value: 0, unit: minBranchSize },
    ];
  },
};
