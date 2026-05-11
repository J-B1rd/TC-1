import type { Calculator } from "../types";

export const paintCoverage: Calculator = {
  id: "paint-coverage",
  name: "Paint Coverage",
  description: "Gallons of paint for a room",
  inputs: [
    { id: "area", label: "Total Surface Area", unit: "ft²", type: "number", defaultValue: "500", min: 0 },
    { id: "coats", label: "Number of Coats", unit: "coats", type: "number", defaultValue: "2", min: 1 },
    {
      id: "surface", label: "Surface Type", unit: "", type: "select",
      options: [
        { label: "Smooth (400 ft²/gal)", value: "400" },
        { label: "Semi-Smooth (350 ft²/gal)", value: "350" },
        { label: "Textured / Knockdown (250 ft²/gal)", value: "250" },
        { label: "Rough / Masonry (150 ft²/gal)", value: "150" },
      ],
      defaultValue: "400",
    },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const coats = parseFloat(inputs.coats) || 1;
    const sqftPerGal = parseFloat(inputs.surface) || 400;
    const gallons = Math.ceil((area * coats) / sqftPerGal * 10) / 10;
    const quarts = Math.ceil(gallons * 4);
    return [
      { label: "Gallons Needed", value: gallons, unit: "gal", highlight: true },
      { label: "Quarts", value: quarts, unit: "qt" },
      { label: "Surface Area", value: Math.round(area), unit: "ft²" },
    ];
  },
};
