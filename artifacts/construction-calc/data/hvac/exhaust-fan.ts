import type { Calculator } from "../types";

export const exhaustFan: Calculator = {
  id: "exhaust-fan",
  name: "Exhaust Fan Sizing",
  description: "CFM rating for bathroom, kitchen, or utility exhaust fans",
  inputs: [
    {
      id: "room", label: "Room Type", unit: "", type: "select",
      options: [
        { label: "Bathroom (< 100 ft²)", value: "bath_small" },
        { label: "Bathroom (> 100 ft²)", value: "bath_large" },
        { label: "Kitchen Range Hood", value: "kitchen" },
        { label: "Utility / Laundry Room", value: "utility" },
      ],
      defaultValue: "bath_small",
    },
    { id: "area", label: "Room Area", unit: "ft²", type: "number", defaultValue: "50", min: 0 },
    { id: "ceilingHt", label: "Ceiling Height", unit: "ft", type: "number", defaultValue: "8", min: 0 },
    { id: "btu", label: "Range BTU (kitchen only)", unit: "BTU/hr", type: "number", defaultValue: "60000", min: 0 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const ht = parseFloat(inputs.ceilingHt) || 8;
    const btu = parseFloat(inputs.btu) || 0;
    const roomType = inputs.room;
    let cfm = 0;
    let rule = "";
    if (roomType === "bath_small") {
      cfm = Math.max(50, area);
      rule = "HVI: 1 CFM/ft², min 50 CFM";
    } else if (roomType === "bath_large") {
      cfm = Math.max(Math.ceil(area * 1.07), 100);
      rule = "ASHRAE 62.2: per fixture method";
    } else if (roomType === "kitchen") {
      cfm = Math.max(btu / 100, 400);
      rule = "HVI: 1 CFM per 100 BTU, min 400";
    } else {
      cfm = Math.ceil((area * ht * 0.5) / 60);
      rule = "0.5 ACH minimum";
    }
    return [
      { label: "Required CFM", value: Math.ceil(cfm), unit: "CFM", highlight: true },
      { label: "Sone Rating (max)", value: roomType === "bath_small" ? 1 : 2, unit: "sones" },
      { label: "Sizing Method", value: 0, unit: rule },
    ];
  },
};
