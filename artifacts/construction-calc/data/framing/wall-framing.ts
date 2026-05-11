import type { Calculator } from "../types";

export const wallFramingList: Calculator = {
  id: "wall-framing-list",
  name: "Wall Material List",
  description: "Complete lumber list for a framed wall",
  inputs: [
    { id: "length", label: "Wall Length", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    { id: "height", label: "Wall Height (plate to plate)", unit: "ft", type: "number", defaultValue: "9", min: 0 },
    {
      id: "spacing", label: "Stud Spacing", unit: "", type: "select",
      options: [
        { label: "12\" O.C.", value: "12" },
        { label: "16\" O.C.", value: "16" },
        { label: "24\" O.C.", value: "24" },
      ],
      defaultValue: "16",
    },
    { id: "doors", label: "Doors (3/0 × 6/8)", unit: "ea", type: "number", defaultValue: "1", min: 0 },
    { id: "windows", label: "Windows", unit: "ea", type: "number", defaultValue: "1", min: 0 },
  ],
  calculate: (inputs) => {
    const length = parseFloat(inputs.length) || 0;
    const height = parseFloat(inputs.height) || 0;
    const spacing = parseFloat(inputs.spacing) || 16;
    const doors = parseFloat(inputs.doors) || 0;
    const windows = parseFloat(inputs.windows) || 0;
    const fieldStuds = Math.ceil((length * 12) / spacing) + 1;
    const extraStuds = doors * 3 + windows * 4 + 4;
    const totalStuds = fieldStuds + extraStuds;
    const plateLF = length * 3;
    const studLF = totalStuds * height;
    return [
      { label: "Total Studs", value: totalStuds, unit: "ea", highlight: true },
      { label: "Plate Linear Feet", value: Math.ceil(plateLF), unit: "LF" },
      { label: "Stud Linear Feet", value: Math.ceil(studLF), unit: "LF" },
      { label: "Field Studs", value: fieldStuds, unit: "ea" },
    ];
  },
};
