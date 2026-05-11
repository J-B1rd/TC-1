import type { Calculator } from "../types";

export const wireGauge: Calculator = {
  id: "wire-gauge",
  name: "Wire Ampacity",
  description: "Recommended wire gauge for a given load",
  inputs: [
    { id: "amps", label: "Circuit Amperage", unit: "A", type: "number", defaultValue: "20", min: 0 },
    {
      id: "type", label: "Wire Type", unit: "", type: "select",
      options: [
        { label: "Copper (NM-B / THHN)", value: "copper" },
        { label: "Aluminum (SE / AL)", value: "aluminum" },
      ],
      defaultValue: "copper",
    },
  ],
  calculate: (inputs) => {
    const amps = parseFloat(inputs.amps) || 0;
    const isAlum = inputs.type === "aluminum";
    let gauge = "4/0 AWG";
    let ampacity = 230;
    if (!isAlum) {
      if (amps <= 15) { gauge = "14 AWG"; ampacity = 15; }
      else if (amps <= 20) { gauge = "12 AWG"; ampacity = 20; }
      else if (amps <= 30) { gauge = "10 AWG"; ampacity = 30; }
      else if (amps <= 40) { gauge = "8 AWG"; ampacity = 40; }
      else if (amps <= 55) { gauge = "6 AWG"; ampacity = 55; }
      else if (amps <= 70) { gauge = "4 AWG"; ampacity = 70; }
      else if (amps <= 95) { gauge = "3 AWG"; ampacity = 95; }
      else if (amps <= 110) { gauge = "2 AWG"; ampacity = 110; }
      else if (amps <= 130) { gauge = "1 AWG"; ampacity = 130; }
      else if (amps <= 150) { gauge = "1/0 AWG"; ampacity = 150; }
      else if (amps <= 175) { gauge = "2/0 AWG"; ampacity = 175; }
      else if (amps <= 200) { gauge = "3/0 AWG"; ampacity = 200; }
      else { gauge = "4/0 AWG"; ampacity = 230; }
    } else {
      if (amps <= 15) { gauge = "12 AWG Al"; ampacity = 15; }
      else if (amps <= 20) { gauge = "10 AWG Al"; ampacity = 20; }
      else if (amps <= 30) { gauge = "8 AWG Al"; ampacity = 30; }
      else if (amps <= 40) { gauge = "6 AWG Al"; ampacity = 40; }
      else if (amps <= 55) { gauge = "4 AWG Al"; ampacity = 55; }
      else if (amps <= 75) { gauge = "2 AWG Al"; ampacity = 75; }
      else if (amps <= 100) { gauge = "1/0 AWG Al"; ampacity = 100; }
      else if (amps <= 130) { gauge = "2/0 AWG Al"; ampacity = 130; }
      else if (amps <= 155) { gauge = "3/0 AWG Al"; ampacity = 155; }
      else { gauge = "4/0 AWG Al"; ampacity = 200; }
    }
    const headroomPct = Math.round(((ampacity - amps) / ampacity) * 100);
    return [
      { label: "Recommended Gauge", value: parseFloat(gauge) || 0, unit: gauge, highlight: true },
      { label: "Rated Ampacity", value: ampacity, unit: "A" },
      { label: "Headroom", value: headroomPct, unit: "%" },
    ];
  },
};
