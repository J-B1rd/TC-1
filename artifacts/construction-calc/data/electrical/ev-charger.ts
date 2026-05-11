import type { Calculator } from "../types";

export const evCharger: Calculator = {
  id: "ev-charger",
  name: "EV Charger Circuit (Level 2)",
  description: "Wire, breaker, and charge time for a home EV charger",
  inputs: [
    {
      id: "amperage", label: "EVSE Amperage", unit: "", type: "select",
      options: [
        { label: "16A (3.84 kW) — 240V", value: "16" },
        { label: "24A (5.76 kW) — 240V", value: "24" },
        { label: "32A (7.68 kW) — 240V — most common", value: "32" },
        { label: "40A (9.6 kW) — 240V", value: "40" },
        { label: "48A (11.52 kW) — 240V — max plug-in", value: "48" },
        { label: "60A (14.4 kW) — hardwired", value: "60" },
        { label: "80A (19.2 kW) — hardwired", value: "80" },
      ],
      defaultValue: "32",
    },
    { id: "runLength", label: "Wire Run Length", unit: "ft", type: "number", defaultValue: "50", min: 0 },
    { id: "batteryKwh", label: "EV Battery Size", unit: "kWh", type: "number", defaultValue: "82", min: 0 },
    { id: "percentEmpty", label: "Start Charge Level", unit: "% empty", type: "number", defaultValue: "80", min: 0 },
  ],
  calculate: (inputs) => {
    const amps = parseFloat(inputs.amperage) || 32;
    const kw = (amps * 240) / 1000;
    const battery = parseFloat(inputs.batteryKwh) || 82;
    const empty = parseFloat(inputs.percentEmpty) || 80;
    const breakerAmps = amps * 1.25;
    let wire = "8 AWG";
    if (breakerAmps <= 20) wire = "12 AWG";
    else if (breakerAmps <= 30) wire = "10 AWG";
    else if (breakerAmps <= 40) wire = "8 AWG";
    else if (breakerAmps <= 55) wire = "6 AWG";
    else if (breakerAmps <= 70) wire = "4 AWG";
    else if (breakerAmps <= 95) wire = "3 AWG";
    else if (breakerAmps <= 110) wire = "2 AWG";
    let breaker = 20;
    for (const b of [20,25,30,40,50,60,70,80,90,100]) { if (b >= breakerAmps) { breaker = b; break; } else { breaker = b; } }
    const kwhNeeded = battery * (empty / 100);
    const chargeHrs = kw > 0 ? kwhNeeded / kw : 0;
    const milesPerHr = kw * 3;
    return [
      { label: "Breaker Size", value: breaker, unit: "A (2-pole)", highlight: true },
      { label: "Wire Size (Cu THHN)", value: 0, unit: wire },
      { label: "Charge Rate", value: Math.round(kw * 10) / 10, unit: "kW" },
      { label: "Miles Added/Hour", value: Math.round(milesPerHr), unit: "mi/hr" },
      { label: "Time to Full Charge", value: Math.round(chargeHrs * 10) / 10, unit: "hrs" },
    ];
  },
};
