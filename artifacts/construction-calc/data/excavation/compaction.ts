import type { Calculator } from "../types";

export const compactionPasses: Calculator = {
  id: "compaction-passes",
  name: "Compaction Passes",
  description: "Number of roller passes to reach target compaction",
  inputs: [
    { id: "area", label: "Area to Compact", unit: "ft²", type: "number", defaultValue: "1000", min: 0 },
    { id: "lift", label: "Lift Thickness", unit: "in", type: "number", defaultValue: "6", min: 1 },
    {
      id: "material", label: "Material", unit: "", type: "select",
      options: [
        { label: "Granular Fill / Sand (baseline 5 passes)", value: "5" },
        { label: "Gravel / Crushed Stone (baseline 5 passes)", value: "5" },
        { label: "Cohesive Soil / Clay (baseline 7 passes)", value: "7" },
        { label: "Subbase (baseline 6 passes)", value: "6" },
        { label: "Asphalt Base (baseline 5 passes)", value: "5" },
      ],
      defaultValue: "5",
    },
    { id: "rollerWidth", label: "Roller Drum Width", unit: "ft", type: "number", defaultValue: "5", min: 1 },
    { id: "speed", label: "Roller Speed", unit: "MPH", type: "number", defaultValue: "3", min: 0.5 },
  ],
  calculate: (inputs) => {
    const area = Math.max(parseFloat(inputs.area) || 0, 0);
    const basePasses = parseFloat(inputs.material) || 5;
    const lift = Math.max(parseFloat(inputs.lift) || 6, 1);
    const width = Math.max(parseFloat(inputs.rollerWidth) || 5, 1);
    const speed = Math.max(parseFloat(inputs.speed) || 3, 0.5);
    const liftFactor = lift <= 6 ? 1.0 : lift <= 9 ? 1.25 : 1.5;
    const adjustedPasses = Math.ceil(basePasses * liftFactor);
    const laneLength = area / width;
    const totalLaneFt = laneLength * adjustedPasses;
    const totalHours = totalLaneFt / (speed * 5280);
    const liftsNeeded = lift > 12 ? Math.ceil(lift / 8) : 1;
    return [
      { label: "Passes per Lift", value: adjustedPasses, unit: "passes", highlight: true },
      { label: "Lift Thickness OK", value: lift <= 12 ? lift : 12, unit: `in (${liftsNeeded > 1 ? liftsNeeded + " lifts req." : "single lift OK"})` },
      { label: "Total Lane Length", value: Math.round(totalLaneFt), unit: "ft" },
      { label: "Est. Compaction Time", value: Math.round(totalHours * 10) / 10, unit: "hrs" },
    ];
  },
};
