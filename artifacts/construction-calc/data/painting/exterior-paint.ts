import type { Calculator } from "../types";

export const exteriorPaint: Calculator = {
  id: "exterior-paint",
  name: "Exterior Paint",
  description: "Gallons needed for house exterior siding",
  inputs: [
    { id: "perimeter", label: "Building Perimeter", unit: "ft", type: "number", defaultValue: "120", min: 0 },
    { id: "height", label: "Wall Height (eave)", unit: "ft", type: "number", defaultValue: "10", min: 0 },
    { id: "gableArea", label: "Gable Area (total)", unit: "ft²", type: "number", defaultValue: "100", min: 0 },
    { id: "windows", label: "Windows / Doors", unit: "ea", type: "number", defaultValue: "8", min: 0 },
    { id: "coats", label: "Coats", unit: "coats", type: "number", defaultValue: "2", min: 1 },
    {
      id: "surface", label: "Surface Type", unit: "", type: "select",
      options: [
        { label: "Smooth (400 ft²/gal)", value: "400" },
        { label: "Lap / Clapboard (350 ft²/gal)", value: "350" },
        { label: "Rough Wood / T1-11 (200 ft²/gal)", value: "200" },
        { label: "Masonry / Stucco (150 ft²/gal)", value: "150" },
      ],
      defaultValue: "350",
    },
  ],
  calculate: (inputs) => {
    const p = parseFloat(inputs.perimeter) || 0;
    const h = parseFloat(inputs.height) || 0;
    const gable = parseFloat(inputs.gableArea) || 0;
    const openings = (parseFloat(inputs.windows) || 0) * 15;
    const coats = parseFloat(inputs.coats) || 2;
    const sqftPerGal = parseFloat(inputs.surface) || 350;
    const gross = p * h + gable;
    const net = gross - openings;
    const gallons = Math.ceil((net * coats) / sqftPerGal * 10) / 10;
    const trimmGallons = Math.ceil(openings * coats / 400 * 10) / 10;
    return [
      { label: "Body Paint (gal)", value: gallons, unit: "gal", highlight: true },
      { label: "Trim Paint (est.)", value: trimmGallons, unit: "gal" },
      { label: "Net Surface Area", value: Math.round(net), unit: "ft²" },
      { label: "Gross Area", value: Math.round(gross), unit: "ft²" },
    ];
  },
};
