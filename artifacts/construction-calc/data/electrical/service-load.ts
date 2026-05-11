import type { Calculator } from "../types";

export const serviceLoad: Calculator = {
  id: "service-load",
  name: "Dwelling Service Load (NEC 220)",
  description: "Minimum service ampacity for a residential unit",
  inputs: [
    { id: "sqft", label: "Living Area", unit: "ft²", type: "number", defaultValue: "2000", min: 0 },
    { id: "smallAppliance", label: "Small Appliance Circuits", unit: "ea", type: "number", defaultValue: "2", min: 2 },
    { id: "laundry", label: "Laundry Circuits", unit: "ea", type: "number", defaultValue: "1", min: 0 },
    { id: "range", label: "Electric Range", unit: "kW", type: "number", defaultValue: "12", min: 0 },
    { id: "dryer", label: "Electric Dryer", unit: "kW", type: "number", defaultValue: "5", min: 0 },
    { id: "hvac", label: "A/C / Heat (largest)", unit: "kW", type: "number", defaultValue: "5", min: 0 },
    { id: "waterHeater", label: "Water Heater", unit: "kW", type: "number", defaultValue: "4.5", min: 0 },
    {
      id: "voltage", label: "Service Voltage", unit: "", type: "select",
      options: [
        { label: "120/240V Single Phase", value: "240" },
        { label: "208Y/120V Three Phase", value: "208" },
      ],
      defaultValue: "240",
    },
  ],
  calculate: (inputs) => {
    const sqft = parseFloat(inputs.sqft) || 0;
    const sa = parseFloat(inputs.smallAppliance) || 2;
    const laundry = parseFloat(inputs.laundry) || 1;
    const range = (parseFloat(inputs.range) || 0) * 1000;
    const dryer = (parseFloat(inputs.dryer) || 0) * 1000;
    const hvac = (parseFloat(inputs.hvac) || 0) * 1000;
    const wh = (parseFloat(inputs.waterHeater) || 0) * 1000;
    const v = parseFloat(inputs.voltage) || 240;
    const lighting = sqft * 3;
    const saLoad = sa * 1500;
    const laundryLoad = laundry * 1500;
    const totalGeneral = lighting + saLoad + laundryLoad;
    const demandGeneral = totalGeneral <= 3000 ? totalGeneral : 3000 + (totalGeneral - 3000) * 0.35;
    const rangeDemand = range * 0.8;
    const dryerDemand = Math.max(dryer, 5000);
    const fixedAppliances = wh;
    const totalVA = demandGeneral + rangeDemand + dryerDemand + fixedAppliances + hvac;
    const amps = totalVA / v;
    let serviceSize = 100;
    for (const s of [100, 150, 200, 225, 320, 400]) {
      if (s >= amps) { serviceSize = s; break; } else { serviceSize = s; }
    }
    return [
      { label: "Calculated Load", value: Math.round(amps), unit: "A", highlight: true },
      { label: "Recommended Service", value: serviceSize, unit: "A" },
      { label: "Total VA Demand", value: Math.round(totalVA), unit: "VA" },
      { label: "General Load (demand)", value: Math.round(demandGeneral), unit: "VA" },
    ];
  },
};
