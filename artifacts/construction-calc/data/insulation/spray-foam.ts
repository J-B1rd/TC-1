import type { Calculator } from "../types";

export const sprayFoam: Calculator = {
  id: "spray-foam",
  name: "Spray Foam Coverage",
  description: "2-part kits or board feet of spray polyurethane foam",
  inputs: [
    { id: "area", label: "Area to Spray", unit: "ft²", type: "number", defaultValue: "200", min: 0 },
    { id: "thickness", label: "Target Thickness", unit: "in", type: "number", defaultValue: "2", min: 0.5, step: 0.5 },
    {
      id: "foamType", label: "Foam Type", unit: "", type: "select",
      options: [
        { label: "Open-Cell (R-3.7/in) — air seal, interiors", value: "3.7" },
        { label: "Closed-Cell (R-6.5/in) — vapor barrier, exterior", value: "6.5" },
      ],
      defaultValue: "6.5",
    },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const thick = parseFloat(inputs.thickness) || 2;
    const rPerIn = parseFloat(inputs.foamType) || 6.5;
    const boardFt = area * thick;
    const kit600 = Math.floor(boardFt / 600);
    const remainder = boardFt % 600;
    const kit200 = Math.floor(remainder / 200);
    const rem2 = remainder % 200;
    const kit15 = Math.ceil(rem2 / 15);
    const totalR = thick * rPerIn;
    return [
      { label: "Board Feet Needed", value: Math.round(boardFt), unit: "BF", highlight: true },
      { label: "600 BF Kits", value: kit600, unit: "kits" },
      { label: "200 BF Kits", value: kit200, unit: "kits" },
      { label: "15 BF Touch-Up Kits", value: kit15, unit: "kits" },
      { label: "R-Value Achieved", value: Math.round(totalR * 10) / 10, unit: "" },
    ];
  },
};
