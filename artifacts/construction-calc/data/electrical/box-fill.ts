import type { Calculator } from "../types";

const COMMON_BOXES: { label: string; volume: number }[] = [
  { label: 'Single-gang device box, 12.5 in\u00B3',      volume: 12.5  },
  { label: 'Single-gang device box, 18 in\u00B3',        volume: 18.0  },
  { label: '4" sq. 1-1/4" deep, 21 in\u00B3',           volume: 21.0  },
  { label: '4" sq. 1-1/2" deep, 29.5 in\u00B3',         volume: 29.5  },
  { label: '4" sq. 2-1/8" deep, 42 in\u00B3',           volume: 42.0  },
  { label: '4-11/16" sq. 2-1/8" deep, 60.75 in\u00B3',  volume: 60.75 },
];

function parseBox(inputs: Record<string, string>) {
  const vol     = parseFloat(inputs.awg)               || 2.25;
  const cond    = Math.max(parseFloat(inputs.conductors) || 0, 0);
  const grounds = Math.max(parseFloat(inputs.grounds)    || 0, 0);
  const clamps  = Math.max(parseFloat(inputs.clamps)     || 0, 0);
  const devices = Math.max(parseFloat(inputs.devices)    || 0, 0);

  const groundGroup = grounds > 0 ? 1 : 0;
  const clampGroup  = clamps  > 0 ? 1 : 0;

  const condVol   = cond          * vol;
  const deviceVol = (devices * 2) * vol;
  const clampVol  = clampGroup    * vol;
  const groundVol = groundGroup   * vol;
  const total     = condVol + deviceVol + clampVol + groundVol;

  return { vol, cond, grounds, clamps, devices, groundGroup, clampGroup,
           condVol, deviceVol, clampVol, groundVol, total };
}

function awgLabel(awg: string) {
  return awg === "2.00" ? "14 AWG" : awg === "2.25" ? "12 AWG"
       : awg === "2.50" ? "10 AWG" : awg === "3.00" ? "8 AWG" : "6 AWG";
}

export const boxFill: Calculator = {
  id: "box-fill",
  name: "Box Fill (NEC 314.16)",
  description:
    "Required box volume from conductor, device, clamp, and ground counts. " +
    "All volume allowances are based on the largest conductor gauge.",
  category: "NEC Compliance",
  difficulty: "basic",
  formula: "Total = (conductors + devices\u00D72 + clamp-group + ground-group) \u00D7 vol-per-allowance",
  calculationSteps: [
    "1. Each current-carrying conductor entering the box = 1 allowance",
    "2. All ground conductors together (regardless of count) = 1 allowance total",
    "3. All internal cable clamps together (regardless of count) = 1 allowance total",
    "4. Each device (switch, outlet, GFCI, dimmer) = 2 allowances",
    "5. Multiply total allowances by volume-per-allowance from NEC Table 314.16(B)",
    "6. Compare calculated volume to the cubic-inch rating stamped inside the box",
  ],
  warnings: [
    "Do NOT count equipment grounding conductors individually \u2014 all grounds = 1 allowance",
    "Do NOT count luminaire fixture wires that originate and stay entirely within the box",
    "The box volume is stamped on the inside \u2014 never assume; always verify",
    "Oversized fill risks insulation damage, arcing, and failed inspection",
    "Combination devices (e.g. GFCI/switch combos) still count as 2 allowances",
  ],
  references: [
    "NEC 314.16 \u2014 outlet, device, and junction box fill",
    "NEC Table 314.16(B) \u2014 volume allowances per conductor gauge",
    "NEC 314.16(B)(4) \u2014 device fill allowance (2\u00D7 largest conductor volume)",
    "NEC 314.16(B)(2) \u2014 clamp allowance",
    "NEC 314.16(B)(3) \u2014 support fittings allowance",
  ],
  tips: [
    "When close to the limit, switch to a 4\" sq. box with mud ring \u2014 far more volume at little extra cost",
    "4\" sq. 2-1/8\" deep boxes (42\u202Fin\u00B3) handle most 2-device installs with 12 AWG comfortably",
    "Old work boxes often have lower cubic-inch ratings than new work boxes of the same size \u2014 always check",
    "Adding a box extender is allowed by NEC and can save a call-back",
  ],
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
    { id: "conductors", label: "Current-Carrying Conductors",    unit: "ea", type: "number", defaultValue: "4", min: 0, max: 100, integer: true },
    { id: "grounds",    label: "Ground Wires",                   unit: "ea", type: "number", defaultValue: "2", min: 0, max: 100, integer: true },
    { id: "clamps",     label: "Internal Cable Clamps (if any)", unit: "ea", type: "number", defaultValue: "1", min: 0, max: 20,  integer: true },
    { id: "devices",    label: "Devices (switches / outlets)",   unit: "ea", type: "number", defaultValue: "1", min: 0, max: 20,  integer: true },
  ],

  calculate: (inputs) => {
    const { vol, cond, grounds, clamps, devices, groundGroup, clampGroup,
            condVol, deviceVol, clampVol, groundVol, total } = parseBox(inputs);

    const fit = COMMON_BOXES.find((b) => b.volume >= total);
    const boxLabel = fit
      ? `\u2713 Fits: ${fit.label}`
      : `\u26A0 Exceeds 60.75 in\u00B3 \u2014 use extension ring or larger enclosure`;

    return [
      { label: "Min Box Volume Required", value: Math.round(total * 100) / 100, unit: "in\u00B3", highlight: true },
      { label: "Smallest Box That Fits",  value: 0, unit: boxLabel },
      { label: `Conductors (${cond} \u00D7 1)`,     value: Math.round(condVol * 100) / 100,   unit: `in\u00B3  (${awgLabel(inputs.awg)}, ${vol}\u202Fin\u00B3 each)` },
      { label: `Devices (${devices} \u00D7 2)`,     value: Math.round(deviceVol * 100) / 100, unit: "in\u00B3" },
      { label: "Grounds (group of 1)",    value: groundGroup > 0 ? Math.round(groundVol * 100) / 100 : 0,
        unit: groundGroup > 0 ? `in\u00B3 (${grounds} wires \u2192 1 allowance)` : "(no grounds)" },
      { label: "Clamps (group of 1)",     value: clampGroup > 0 ? Math.round(clampVol * 100) / 100 : 0,
        unit: clampGroup > 0 ? `in\u00B3 (${clamps} clamps \u2192 1 allowance)` : "(no clamps)" },
    ];
  },

  computeSteps: (inputs) => {
    const { vol, cond, grounds, clamps, devices, groundGroup, clampGroup,
            condVol, deviceVol, clampVol, groundVol, total } = parseBox(inputs);
    const gauge = awgLabel(inputs.awg);
    const fit = COMMON_BOXES.find((b) => b.volume >= total);
    const allowances = cond + devices * 2 + clampGroup + groundGroup;
    return [
      `Volume per allowance (${gauge}) = ${vol} in\u00B3  (NEC Table 314.16(B))`,
      `Conductors:  ${cond} \u00D7 1 allowance \u00D7 ${vol} in\u00B3 = ${condVol.toFixed(2)} in\u00B3`,
      `Devices:     ${devices} \u00D7 2 allowances \u00D7 ${vol} in\u00B3 = ${deviceVol.toFixed(2)} in\u00B3`,
      `Grounds:     ${grounds} wire${grounds !== 1 ? "s" : ""} \u2192 ${groundGroup} group \u00D7 ${vol} in\u00B3 = ${groundVol.toFixed(2)} in\u00B3`,
      `Clamps:      ${clamps} clamp${clamps !== 1 ? "s" : ""} \u2192 ${clampGroup} group \u00D7 ${vol} in\u00B3 = ${clampVol.toFixed(2)} in\u00B3`,
      `Total allowances: ${allowances}  (conductors + devices\u00D72 + ground-group + clamp-group)`,
      `Total volume: ${condVol.toFixed(2)} + ${deviceVol.toFixed(2)} + ${groundVol.toFixed(2)} + ${clampVol.toFixed(2)} = ${total.toFixed(2)} in\u00B3`,
      fit ? `\u2713 Smallest box that fits: ${fit.label}` : `\u26A0 Exceeds largest standard box \u2014 use extension ring`,
    ];
  },
};
