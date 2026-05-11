import type { Calculator } from "../types";

export const demandFactor: Calculator = {
  id: "demand-factor",
  name: "Demand Factor",
  description: "Applied demand load from connected load (NEC 220)",
  inputs: [
    { id: "connectedLoad", label: "Connected Load", unit: "VA", type: "number", defaultValue: "50000", min: 0 },
    {
      id: "loadType", label: "Load Type", unit: "", type: "select",
      options: [
        { label: "Lighting — Dwelling (first 3 kVA)", value: "lighting_res" },
        { label: "Lighting — Commercial / Office", value: "lighting_com" },
        { label: "Receptacles (>10 kVA at 50%)", value: "receptacles" },
        { label: "Fixed Appliances (4+ at 75%)", value: "appliances" },
        { label: "Electric Dryers (5+ units NEC 220.54)", value: "dryers" },
        { label: "Ranges (NEC 220.55 — 3+ units)", value: "ranges" },
      ],
      defaultValue: "lighting_com",
    },
    { id: "count", label: "Number of Units / Circuits", unit: "ea", type: "number", defaultValue: "1", min: 1 },
  ],
  calculate: (inputs) => {
    const load = parseFloat(inputs.connectedLoad) || 0;
    const count = parseFloat(inputs.count) || 1;
    let demandPct = 100;
    let demandVA = load;
    if (inputs.loadType === "lighting_res") {
      demandVA = load <= 3000 ? load : 3000 + (load - 3000) * 0.35;
      demandPct = (demandVA / load) * 100;
    } else if (inputs.loadType === "lighting_com") {
      demandVA = load; demandPct = 100;
    } else if (inputs.loadType === "receptacles") {
      demandVA = load <= 10000 ? load : 10000 + (load - 10000) * 0.50;
      demandPct = (demandVA / load) * 100;
    } else if (inputs.loadType === "appliances") {
      demandPct = count >= 4 ? 75 : 100;
      demandVA = load * (demandPct / 100);
    } else if (inputs.loadType === "dryers") {
      let pct = 100;
      if (count >= 4 && count <= 5) pct = 85;
      else if (count >= 6 && count <= 7) pct = 75;
      else if (count >= 8 && count <= 9) pct = 70;
      else if (count >= 10 && count <= 12) pct = 65;
      else if (count >= 13 && count <= 15) pct = 60;
      else if (count >= 16 && count <= 19) pct = 55;
      else if (count >= 20 && count <= 24) pct = 50;
      else if (count >= 25 && count <= 29) pct = 45;
      else if (count >= 30) pct = 35;
      demandPct = pct; demandVA = load * (pct / 100);
    } else if (inputs.loadType === "ranges") {
      let demand = load;
      if (count === 1) demand = Math.max(load * 0.8, 8000);
      else if (count === 2) demand = Math.max(load * 0.75, 11000);
      else if (count === 3) demand = Math.max(load * 0.7, 14000);
      else if (count <= 5) demand = Math.max(load * 0.6, count * 3000);
      else if (count <= 8) demand = load * 0.55;
      else demand = load * 0.4;
      demandVA = demand; demandPct = (demand / load) * 100;
    }
    return [
      { label: "Demand Load", value: Math.round(demandVA), unit: "VA", highlight: true },
      { label: "Demand Factor", value: Math.round(demandPct * 10) / 10, unit: "%" },
      { label: "Connected Load", value: Math.round(load), unit: "VA" },
      { label: "Reduction", value: Math.round(load - demandVA), unit: "VA saved" },
    ];
  },
};
