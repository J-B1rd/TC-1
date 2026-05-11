import type { Calculator } from "../types";

export const cornerBead: Calculator = {
  id: "corner-bead",
  name: "Corner Bead & Trim",
  description: "Linear feet of metal or vinyl corner bead",
  inputs: [
    { id: "corners", label: "Outside Corners", unit: "ea", type: "number", defaultValue: "8", min: 0 },
    { id: "height", label: "Wall / Ceiling Height", unit: "ft", type: "number", defaultValue: "9", min: 0 },
    { id: "archways", label: "Archway LF (flexible bead)", unit: "LF", type: "number", defaultValue: "0", min: 0 },
    {
      id: "beadLength", label: "Bead Stock Length", unit: "", type: "select",
      options: [
        { label: "8 ft lengths", value: "8" },
        { label: "9 ft lengths", value: "9" },
        { label: "10 ft lengths", value: "10" },
      ],
      defaultValue: "9",
    },
  ],
  calculate: (inputs) => {
    const corners = parseFloat(inputs.corners) || 0;
    const height = parseFloat(inputs.height) || 0;
    const archLF = parseFloat(inputs.archways) || 0;
    const stockLen = parseFloat(inputs.beadLength) || 9;
    const cornerLF = corners * height;
    const totalLF = cornerLF + archLF;
    const pieces = Math.ceil(totalLF / stockLen);
    return [
      { label: "Corner Bead Pieces", value: pieces, unit: `${stockLen}-ft sticks`, highlight: true },
      { label: "Total Linear Feet", value: Math.round(totalLF), unit: "LF" },
      { label: "Corner LF", value: Math.round(cornerLF), unit: "LF" },
    ];
  },
};
