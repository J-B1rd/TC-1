import type { Calculator } from "../types";

export const cfmPerRoom: Calculator = {
  id: "cfm-per-room",
  name: "CFM per Room",
  description: "Airflow required per room based on area and system size",
  inputs: [
    { id: "roomArea", label: "Room Area", unit: "ft²", type: "number", defaultValue: "200", min: 0 },
    { id: "totalArea", label: "Total Conditioned Area", unit: "ft²", type: "number", defaultValue: "2000", min: 0 },
    { id: "systemCfm", label: "System Total CFM", unit: "CFM", type: "number", defaultValue: "1200", min: 0 },
  ],
  calculate: (inputs) => {
    const room = parseFloat(inputs.roomArea) || 0;
    const total = parseFloat(inputs.totalArea) || 1;
    const sysCfm = parseFloat(inputs.systemCfm) || 0;
    const fraction = room / total;
    const roomCfm = fraction * sysCfm;
    let ductDiam = 6;
    if (roomCfm > 100) ductDiam = 7;
    if (roomCfm > 150) ductDiam = 8;
    if (roomCfm > 200) ductDiam = 9;
    if (roomCfm > 250) ductDiam = 10;
    return [
      { label: "Room CFM", value: Math.round(roomCfm), unit: "CFM", highlight: true },
      { label: "% of System", value: Math.round(fraction * 100), unit: "%" },
      { label: "Suggested Supply Duct", value: ductDiam, unit: "in round" },
    ];
  },
};
