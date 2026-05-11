import type { Calculator } from "../types";

export const compactionPasses: Calculator = {
  id: "compaction-passes",
  name: "Compaction Passes",
  description: "Number of roller passes to reach target compaction",
  inputs: [
    { id: "area", label: "Area to Compact", unit: "ft²", type: "number", defaultValue: "1000", min: 0 },
    { id: "lift", label: "Lift Thickness", unit: "in", type: "number", defaultValue: "6", min: 0 },
    {
      id: "material", label: "Material", unit: "", type: "select",
      options: [
        { label: "Granular Fill / Sand (4–6 passes)", value: "5" },
        { label: "Gravel / Crushed Stone (4–6 passes)", value: "5" },
        { label: "Cohesive Soil / Clay (6–8 passes)", value: "7" },
        { label: "Subbase (6 passes)", value: "6" },
        { label: "Asphalt Base (4–6 passes)", value: "5" },
      ],
      defaultValue: "5",
    },
    { id: "rollerWidth", label: "Roller Drum Width", unit: "ft", type: "number", defaultValue: "5", min: 1 },
    { id: "speed", label: "Roller Speed", unit: "MPH", type: "number", defaultValue: "3", min: 0.5 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const passes = parseFloat(inputs.material) || 5;
    const width = parseFloat(inputs.rollerWidth) || 5;
    const speed = parseFloat(inputs.speed) || 3;
    const laneLength = area / width;
    const totalHours = (laneLength * passes) / (speed * 5280);
    return [
      { label: "Passes Required", value: passes, unit: "passes", highlight: true },
      { label: "Total Lane Length", value: Math.round(laneLength * passes), unit: "ft" },
      { label: "Est. Compaction Time", value: Math.round(totalHours * 10) / 10, unit: "hrs" },
      { label: "Area", value: Math.round(area), unit: "ft²" },
    ];
  },
};
