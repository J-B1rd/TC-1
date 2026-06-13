import type { Calculator } from "../types";

const COMMON_BOXES: { label: string; volume: number }[] = [
  { label: '2x4 device box (single-gang, 12.5 in\u00B3)',   volume: 12.5  },
  { label: '2x4 device box (single-gang, 18 in\u00B3)',     volume: 18.0  },
  { label: '4" sq. 1-1/4" deep (21 in\u00B3)',              volume: 21.0  },
  { label: '4" sq. 1-1/2" deep (29.5 in\u00B3)',            volume: 29.5  },
  { label: '4" sq. 2-1/8" deep (42 in\u00B3)',              volume: 42.0  },
  { label: '4-11/16" sq. 2-1/8" deep (60.75 in\u00B3)',    volume: 60.75 },
];

export const boxFill: Calculator = {
  id: "box-fill",
  name: "Box Fill (NEC 314.16)",
  description:
    "Per NEC 314.16(B): each current-carrying conductor = 1 allowance; " +
    "all ground conductors together = 1 allowance; all internal clamps together = 1 allowance; " +
    "each device (switch/outlet) = 2 allowances. Volume per allowance = gauge of largest conductor.",
  inputs: [
    {
      id: "awg", label: "Largest Wire Gauge", unit: "", type: "select",
      options: [
        { label: "14 AWG  (2.00 in\u00B3 each)", value: "2.00" },
        { label: "12 AWG  (2.25 in\u00B3 each)", value: "2.25" },
        { label: "10 AWG  (2.50 in\u00B3 each)", value: "2.50" },
        { label: "8 AWG   (3.00 in\u00B3 each)", value: "3.00" },
        { label: "6 AWG   (5.00 in\u00B3 each)", value: "5.00" },
      ],
      defaultValue: "2.25",
    },
    { id: "conductors", label: "Current-Carrying Conductors",    unit: "ea", type: "number", defaultValue: "4", min: 0 },
    { id: "grounds",    label: "Ground Wires",                   unit: "ea", type: "number", defaultValue: "2", min: 0 },
    { id: "clamps",     label: "Internal Cable Clamps (if any)", unit: "ea", type: "number", defaultValue: "1", min: 0 },
    { id: "devices",    label: "Devices (switches / outlets)",   unit: "ea", type: "number", defaultValue: "1", min: 0 },
  ],
  calculate: (inputs) => {
    const vol        = parseFloat(inputs.awg)        || 2.25;
    const cond       = Math.max(parseFloat(inputs.conductors) || 0, 0);
    const grounds    = Math.max(parseFloat(inputs.grounds)    || 0, 0);
    const clamps     = Math.max(parseFloat(inputs.clamps)     || 0, 0);
    const devices    = Math.max(parseFloat(inputs.devices)    || 0, 0);

    const groundAllowance = grounds > 0 ? 1 : 0;
    const clampAllowance  = clamps  > 0 ? 1 : 0;

    const condVol    = cond            * vol;
    const deviceVol  = (devices * 2)   * vol;
    const clampVol   = clampAllowance  * vol;
    const groundVol  = groundAllowance * vol;
    const total      = condVol + deviceVol + clampVol + groundVol;

    const fit = COMMON_BOXES.find((b) => b.volume >= total);
    const boxLabel = fit
      ? `\u2713 Fits: ${fit.label}`
      : `\u26A0 Exceeds 60.75 in\u00B3 \u2014 use extension ring or larger enclosure`;

    const awgLabel = inputs.awg === "2.00" ? "14 AWG" : inputs.awg === "2.25" ? "12 AWG"
      : inputs.awg === "2.50" ? "10 AWG" : inputs.awg === "3.00" ? "8 AWG" : "6 AWG";

    return [
      { label: "Min Box Volume Required",  value: Math.round(total * 100) / 100, unit: "in\u00B3", highlight: true },
      { label: "Smallest Box That Fits",   value: 0,    unit: boxLabel },
      { label: `Conductors (${cond} \u00D7 1 allow.)`, value: Math.round(condVol * 100) / 100, unit: `in\u00B3  (${awgLabel}, ${vol} in\u00B3 ea)` },
      { label: `Devices (${devices} \u00D7 2 allow.)`,  value: Math.round(deviceVol * 100) / 100, unit: "in\u00B3" },
      { label: "Grounds (all = 1 allow.)",  value: groundAllowance > 0 ? Math.round(groundVol * 100) / 100 : 0, unit: groundAllowance > 0 ? `in\u00B3  (${grounds} wires = 1 allowance)` : "0  (no grounds)" },
      { label: "Clamps (all = 1 allow.)",   value: clampAllowance > 0 ? Math.round(clampVol * 100) / 100 : 0, unit: clampAllowance > 0 ? `in\u00B3  (${clamps} clamps = 1 allowance)` : "0  (no clamps)" },
    ];
  },
};
