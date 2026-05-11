import type { Calculator } from "../types";

export const dripEdge: Calculator = {
  id: "drip-edge",
  name: "Drip Edge & Fascia",
  description: "Linear feet of drip edge and fascia board",
  inputs: [
    { id: "length", label: "Building Length", unit: "ft", type: "number", defaultValue: "40", min: 0 },
    { id: "width", label: "Building Width", unit: "ft", type: "number", defaultValue: "30", min: 0 },
    { id: "overhang", label: "Eave Overhang", unit: "in", type: "number", defaultValue: "12", min: 0 },
    { id: "rise", label: "Roof Pitch (rise per 12\")", unit: "in", type: "number", defaultValue: "6", min: 0 },
    {
      id: "pieceLen", label: "Stock Length", unit: "", type: "select",
      options: [
        { label: "10 ft pieces", value: "10" },
        { label: "12 ft pieces", value: "12" },
      ],
      defaultValue: "10",
    },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const w = parseFloat(inputs.width) || 0;
    const overhang = (parseFloat(inputs.overhang) || 0) / 12;
    const stockLen = parseFloat(inputs.pieceLen) || 10;
    const pitch = parseFloat(inputs.rise) || 6;
    const slopeMult = Math.sqrt(pitch * pitch + 144) / 12;
    const rakeLF = (w / 2) * slopeMult * 2 * 2;
    const eaveLF = (l + overhang * 2) * 2;
    const totalDripEdge = rakeLF + eaveLF;
    const pieces = Math.ceil(totalDripEdge / stockLen * 1.05);
    return [
      { label: "Drip Edge Pieces", value: pieces, unit: `${stockLen}-ft pieces`, highlight: true },
      { label: "Total LF", value: Math.round(totalDripEdge), unit: "LF" },
      { label: "Eave LF", value: Math.round(eaveLF), unit: "LF" },
      { label: "Rake LF", value: Math.round(rakeLF), unit: "LF" },
    ];
  },
};
