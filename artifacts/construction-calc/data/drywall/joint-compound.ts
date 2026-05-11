import type { Calculator } from "../types";

export const jointCompound: Calculator = {
  id: "joint-compound",
  name: "Joint Compound (Mud)",
  description: "Buckets of mud and tape for finishing drywall",
  inputs: [
    { id: "sheets", label: "Number of Sheets", unit: "sheets", type: "number", defaultValue: "50", min: 0 },
    {
      id: "coats", label: "Finish Level", unit: "", type: "select",
      options: [
        { label: "Level 3 (2 coats tape + 1 skim)", value: "3" },
        { label: "Level 4 (3 coats — standard)", value: "4" },
        { label: "Level 5 (full skim coat)", value: "5" },
      ],
      defaultValue: "4",
    },
  ],
  calculate: (inputs) => {
    const sheets = parseFloat(inputs.sheets) || 0;
    const level = parseFloat(inputs.coats) || 4;
    const sqft = sheets * 32;
    const tapeLF = sqft * 0.3;
    const tapeRolls = Math.ceil(tapeLF / 500);
    const mudFactor = level === 3 ? 3.5 : level === 4 ? 4 : 5;
    const buckets5gal = Math.ceil(sheets / mudFactor);
    const screws = Math.ceil(sheets * 32);
    return [
      { label: "5-gal Buckets (mud)", value: buckets5gal, unit: "buckets", highlight: true },
      { label: "Tape Rolls (500 ft)", value: tapeRolls, unit: "rolls" },
      { label: "Drywall Screws", value: screws, unit: "screws" },
      { label: "Total Area", value: Math.round(sqft), unit: "ft²" },
    ];
  },
};
