import type { Calculator } from "../types";

export const pipeInsulationCalc: Calculator = {
  id: "pipe-insulation",
  name: "Pipe Insulation",
  description: "Linear feet of foam pipe insulation sleeves",
  inputs: [
    { id: "hotLF", label: "Hot Water Pipe Run", unit: "LF", type: "number", defaultValue: "60", min: 0 },
    { id: "coldLF", label: "Cold / Supply Pipe Run", unit: "LF", type: "number", defaultValue: "40", min: 0 },
    {
      id: "pipeDia", label: "Pipe Diameter", unit: "", type: "select",
      options: [
        { label: "1/2\"", value: "0.5" },
        { label: "3/4\"", value: "0.75" },
        { label: "1\"", value: "1.0" },
        { label: "1-1/4\"", value: "1.25" },
        { label: "1-1/2\"", value: "1.5" },
        { label: "2\"", value: "2.0" },
      ],
      defaultValue: "0.75",
    },
    { id: "sleeveLen", label: "Sleeve Length", unit: "ft", type: "number", defaultValue: "6", min: 1 },
  ],
  calculate: (inputs) => {
    const hot = parseFloat(inputs.hotLF) || 0;
    const cold = parseFloat(inputs.coldLF) || 0;
    const sleeveLen = parseFloat(inputs.sleeveLen) || 6;
    const total = hot + cold;
    const pieces = Math.ceil(total / sleeveLen);
    const waste = Math.ceil(pieces * 0.1);
    return [
      { label: "Pieces Needed", value: pieces + waste, unit: `${sleeveLen}-ft sleeves`, highlight: true },
      { label: "Total Linear Feet", value: Math.round(total), unit: "LF" },
      { label: "Hot Water Pipes", value: hot, unit: "LF" },
      { label: "Cold / Supply Pipes", value: cold, unit: "LF" },
    ];
  },
};
