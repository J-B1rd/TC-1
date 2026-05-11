import type { Calculator } from "../types";

export const rigidFoam: Calculator = {
  id: "rigid-foam",
  name: "Rigid Foam Board",
  description: "4×8 sheets of XPS, EPS, or polyiso board",
  inputs: [
    { id: "area", label: "Area", unit: "ft²", type: "number", defaultValue: "400", min: 0 },
    {
      id: "rPerInch", label: "Foam Type", unit: "", type: "select",
      options: [
        { label: "EPS (R-3.8/in, white bead board)", value: "3.8" },
        { label: "XPS (R-5/in, blue/pink board)", value: "5.0" },
        { label: "Polyiso (R-6.5/in, foil face)", value: "6.5" },
      ],
      defaultValue: "5.0",
    },
    { id: "targetR", label: "Target R-Value", unit: "", type: "number", defaultValue: "10", min: 0 },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const rPerIn = parseFloat(inputs.rPerInch) || 5;
    const targetR = parseFloat(inputs.targetR) || 10;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const thickness = targetR / rPerIn;
    const stdThick = [1, 1.5, 2, 3, 4];
    let layers = 1;
    let thickPerLayer = thickness;
    for (const t of stdThick) {
      if (t >= thickness) { thickPerLayer = t; break; }
    }
    if (thickPerLayer > 4) { layers = Math.ceil(thickness / 4); thickPerLayer = 4; }
    const sheets = Math.ceil((area * waste * layers) / 32);
    return [
      { label: "Sheets (4×8)", value: sheets, unit: "sheets", highlight: true },
      { label: "Thickness per Layer", value: Math.round(thickPerLayer * 10) / 10, unit: "in" },
      { label: "Layers", value: layers, unit: "layers" },
      { label: "Total R-Value", value: Math.round(thickPerLayer * layers * rPerIn * 10) / 10, unit: "" },
    ];
  },
};
