import type { Calculator } from "../types";

const WIRE_TABLE: { label: string; cu: number; al: number | null }[] = [
  { label: "14 AWG", cu: 3.14,   al: null   },
  { label: "12 AWG", cu: 1.98,   al: 3.18   },
  { label: "10 AWG", cu: 1.24,   al: 2.00   },
  { label: "8 AWG",  cu: 0.778,  al: 1.26   },
  { label: "6 AWG",  cu: 0.491,  al: 0.808  },
  { label: "4 AWG",  cu: 0.308,  al: 0.508  },
  { label: "3 AWG",  cu: 0.245,  al: null   },
  { label: "2 AWG",  cu: 0.194,  al: 0.319  },
  { label: "1 AWG",  cu: 0.154,  al: 0.253  },
  { label: "1/0 AWG",cu: 0.122,  al: 0.201  },
  { label: "2/0 AWG",cu: 0.0967, al: 0.159  },
  { label: "3/0 AWG",cu: 0.0766, al: 0.126  },
  { label: "4/0 AWG",cu: 0.0608, al: 0.100  },
  { label: "250 kcmil",cu:0.0515, al: 0.0847 },
  { label: "350 kcmil",cu:0.0367, al: 0.0605 },
  { label: "500 kcmil",cu:0.0258, al: 0.0424 },
];

export const voltageDrop: Calculator = {
  id: "voltage-drop",
  name: "Voltage Drop",
  description:
    "NEC Chapter 9 Table 9 AC resistance method (75 °C, in conduit). " +
    "NEC recommends ≤3 % for branch circuits and ≤5 % total (feeder + branch). " +
    "Three-phase formula uses √3 multiplier; single-phase uses 2× for round-trip.",
  inputs: [
    {
      id: "voltage", label: "System Voltage", unit: "", type: "select",
      options: [
        { label: "120 V", value: "120" },
        { label: "208 V", value: "208" },
        { label: "240 V", value: "240" },
        { label: "277 V", value: "277" },
        { label: "480 V", value: "480" },
      ],
      defaultValue: "120",
    },
    {
      id: "phase", label: "System Type", unit: "", type: "select",
      options: [
        { label: "Single-Phase (1φ)", value: "1" },
        { label: "Three-Phase (3φ)", value: "3" },
      ],
      defaultValue: "1",
    },
    {
      id: "material", label: "Wire Material", unit: "", type: "select",
      options: [
        { label: "Copper (Cu)", value: "cu" },
        { label: "Aluminum (Al)", value: "al" },
      ],
      defaultValue: "cu",
    },
    {
      id: "awg", label: "Wire Size", unit: "", type: "select",
      options: WIRE_TABLE.map((w) => ({ label: w.label, value: w.label })),
      defaultValue: "12 AWG",
    },
    { id: "amps",     label: "Load Current",         unit: "A",  type: "number", defaultValue: "20",  min: 0 },
    { id: "distance", label: "One-Way Distance",      unit: "ft", type: "number", defaultValue: "100", min: 0 },
  ],
  calculate: (inputs) => {
    const sysV   = parseFloat(inputs.voltage)  || 120;
    const phase  = parseInt(inputs.phase)      || 1;
    const isCu   = inputs.material !== "al";
    const amps   = Math.max(parseFloat(inputs.amps)     || 0, 0);
    const dist   = Math.max(parseFloat(inputs.distance) || 0, 0);

    const row = WIRE_TABLE.find((w) => w.label === inputs.awg) ?? WIRE_TABLE[1];
    const rRaw = isCu ? row.cu : (row.al ?? row.cu);

    const phaseMult = phase === 3 ? Math.sqrt(3) : 2;
    const vd    = (amps * rRaw * phaseMult * dist) / 1000;
    const vdPct = sysV > 0 ? (vd / sysV) * 100 : 0;
    const vAtLoad = sysV - vd;

    const branchLimit = 3;
    const totalLimit  = 5;
    const pass        = vdPct <= branchLimit;
    const statusText  = pass
      ? `\u2713 PASS  \u2014 ${vdPct.toFixed(2)}% (NEC \u22643% branch)`
      : `\u26A0 OVER  \u2014 ${vdPct.toFixed(2)}%  (limit: ${branchLimit}% branch / ${totalLimit}% total)`;

    let suggestion = "\u2713 Current size is within NEC limits";
    if (!pass) {
      for (const w of WIRE_TABLE) {
        const r2 = isCu ? w.cu : (w.al ?? w.cu);
        const pct2 = (amps * r2 * phaseMult * dist) / 1000 / sysV * 100;
        if (r2 < rRaw && pct2 <= branchLimit) {
          suggestion = `\u2191 Upsize to ${w.label} (${isCu ? "Cu" : "Al"}) \u2192 ${pct2.toFixed(2)}% drop`;
          break;
        }
      }
    }

    const formulaStr = phase === 3
      ? `VD = I \u00D7 \u221A3 \u00D7 R \u00D7 D \u00F7 1000`
      : `VD = I \u00D7 2 \u00D7 R \u00D7 D \u00F7 1000`;

    return [
      { label: "Voltage Drop",        value: Math.round(vd * 100) / 100,     unit: "V",    highlight: true },
      { label: "Drop Percentage",      value: Math.round(vdPct * 100) / 100,  unit: "%" },
      { label: "Voltage at Load",      value: Math.round(vAtLoad * 100) / 100,unit: "V" },
      { label: "Status",               value: 0, unit: statusText },
      { label: "Suggestion",           value: 0, unit: suggestion },
      { label: "Formula",              value: 0, unit: formulaStr },
      { label: `R (${isCu ? "Cu" : "Al"}, 75\u00B0C)`, value: rRaw, unit: "\u03A9/kft (NEC Ch.9 T.9)" },
    ];
  },
};
