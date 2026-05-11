import type { Calculator } from "../types";

export const rebarQuantity: Calculator = {
  id: "rebar-quantity",
  name: "Rebar Quantity",
  description: "Linear feet of rebar for a slab grid",
  inputs: [
    { id: "length", label: "Slab Length", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    { id: "width", label: "Slab Width", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    { id: "spacing", label: "Spacing", unit: "in", type: "number", defaultValue: "12", min: 1 },
    { id: "overlap", label: "Lap Splice", unit: "in", type: "number", defaultValue: "18", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const w = parseFloat(inputs.width) || 0;
    const spacing = (parseFloat(inputs.spacing) || 12) / 12;
    const overlap = (parseFloat(inputs.overlap) || 0) / 12;
    const rowsLong = Math.floor(w / spacing) + 1;
    const rowsShort = Math.floor(l / spacing) + 1;
    const linearFt = (rowsLong * l) + (rowsShort * w);
    const bars20 = Math.ceil(linearFt / (20 - overlap));
    return [
      { label: "Linear Feet", value: Math.round(linearFt), unit: "ft", highlight: true },
      { label: "20 ft Bars", value: bars20, unit: "bars" },
      { label: "Rows (long way)", value: rowsLong, unit: "rows" },
      { label: "Rows (short way)", value: rowsShort, unit: "rows" },
    ];
  },
};
