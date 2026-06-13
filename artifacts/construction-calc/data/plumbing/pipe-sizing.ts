import type { Calculator } from "../types";

export const pipeSizing: Calculator = {
  id: "pipe-sizing",
  name: "Pipe Sizing",
  description: "Recommended pipe diameter for water supply",
  inputs: [
    { id: "gpm", label: "Flow Rate", unit: "GPM", type: "number", defaultValue: "10", min: 0 },
    {
      id: "material", label: "Pipe Material", unit: "", type: "select",
      options: [
        { label: "Copper (max 8 fps)", value: "8" },
        { label: "PEX (max 5 fps)", value: "5" },
        { label: "CPVC (max 5 fps)", value: "5" },
        { label: "PVC Schedule 40 (max 10 fps cold only)", value: "10" },
      ],
      defaultValue: "8",
    },
  ],
  calculate: (inputs) => {
    const gpm = Math.max(parseFloat(inputs.gpm) || 0, 0);
    const maxFps = parseFloat(inputs.material) || 8;
    const sizes: [string, number][] = [
      ["1/2\"",   0.622],
      ["3/4\"",   0.824],
      ["1\"",     1.049],
      ["1-1/4\"", 1.380],
      ["1-1/2\"", 1.610],
      ["2\"",     2.067],
      ["2-1/2\"", 2.469],
      ["3\"",     3.068],
    ];
    let selectedSize = sizes[sizes.length - 1][0];
    let selectedVelocity = 0;
    for (const [label, id] of sizes) {
      const areaSqIn = Math.PI * (id / 2) ** 2;
      const areaSqFt = areaSqIn / 144;
      const fps = gpm / (areaSqFt * 7.48 * 60);
      if (fps <= maxFps) {
        selectedSize = label;
        selectedVelocity = fps;
        break;
      }
      selectedVelocity = fps;
    }
    return [
      { label: "Recommended Size", value: 0, unit: selectedSize, highlight: true },
      { label: "Flow Velocity", value: Math.round(selectedVelocity * 100) / 100, unit: "fps" },
      { label: "Max Velocity (material)", value: maxFps, unit: "fps" },
      { label: "Flow Rate", value: gpm, unit: "GPM" },
    ];
  },
};
