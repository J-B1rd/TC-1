import type { Calculator } from "../types";

export const haulLoads: Calculator = {
  id: "haul-loads",
  name: "Haul Loads",
  description: "Truck trips needed to haul excavated material",
  inputs: [
    { id: "volume", label: "Loose Volume", unit: "yd³", type: "number", defaultValue: "200", min: 0 },
    {
      id: "truckSize", label: "Truck Capacity", unit: "", type: "select",
      options: [
        { label: "Pickup (1 yd³)", value: "1" },
        { label: "Single Axle (5–6 yd³)", value: "5.5" },
        { label: "Tandem Axle (10–12 yd³)", value: "11" },
        { label: "Tri-Axle (14–16 yd³)", value: "15" },
        { label: "Quad-Axle (16–18 yd³)", value: "17" },
      ],
      defaultValue: "11",
    },
  ],
  calculate: (inputs) => {
    const vol = parseFloat(inputs.volume) || 0;
    const cap = parseFloat(inputs.truckSize) || 11;
    const loads = Math.ceil(vol / cap);
    return [
      { label: "Truck Loads", value: loads, unit: "loads", highlight: true },
      { label: "Total Volume", value: Math.round(vol), unit: "yd³" },
      { label: "Truck Capacity", value: cap, unit: "yd³ / load" },
    ];
  },
};
