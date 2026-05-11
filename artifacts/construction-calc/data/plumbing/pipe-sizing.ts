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
        { label: "Copper", value: "copper" },
        { label: "PEX", value: "pex" },
        { label: "CPVC", value: "cpvc" },
        { label: "PVC Schedule 40", value: "pvc" },
      ],
      defaultValue: "copper",
    },
  ],
  calculate: (inputs) => {
    const gpm = parseFloat(inputs.gpm) || 0;
    let size = "1\"";
    let velocity = 0;
    if (gpm <= 2) { size = "1/2\""; velocity = gpm / 0.0218; }
    else if (gpm <= 6) { size = "3/4\""; velocity = gpm / 0.0491; }
    else if (gpm <= 14) { size = "1\""; velocity = gpm / 0.0873; }
    else if (gpm <= 26) { size = "1-1/4\""; velocity = gpm / 0.1363; }
    else if (gpm <= 40) { size = "1-1/2\""; velocity = gpm / 0.1963; }
    else { size = "2\""; velocity = gpm / 0.3491; }
    return [
      { label: "Recommended Size", value: 0, unit: size, highlight: true },
      { label: "Flow Velocity", value: Math.round(velocity * 100) / 100, unit: "ft/min" },
      { label: "Flow Rate", value: gpm, unit: "GPM" },
    ];
  },
};
