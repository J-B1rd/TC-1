import type { Calculator } from "../types";

const WIRE_TABLE: { label: string; cu: number; al: number | null }[] = [
  { label: "14 AWG",     cu: 3.14,   al: null   },
  { label: "12 AWG",     cu: 1.98,   al: 3.18   },
  { label: "10 AWG",     cu: 1.24,   al: 2.00   },
  { label: "8 AWG",      cu: 0.778,  al: 1.26   },
  { label: "6 AWG",      cu: 0.491,  al: 0.808  },
  { label: "4 AWG",      cu: 0.308,  al: 0.508  },
  { label: "3 AWG",      cu: 0.245,  al: null   },
  { label: "2 AWG",      cu: 0.194,  al: 0.319  },
  { label: "1 AWG",      cu: 0.154,  al: 0.253  },
  { label: "1/0 AWG",    cu: 0.122,  al: 0.201  },
  { label: "2/0 AWG",    cu: 0.0967, al: 0.159  },
  { label: "3/0 AWG",    cu: 0.0766, al: 0.126  },
  { label: "4/0 AWG",    cu: 0.0608, al: 0.100  },
  { label: "250 kcmil",  cu: 0.0515, al: 0.0847 },
  { label: "350 kcmil",  cu: 0.0367, al: 0.0605 },
  { label: "500 kcmil",  cu: 0.0258, al: 0.0424 },
];

export const voltageDrop: Calculator = {
  id: "voltage-drop",
  name: "Voltage Drop",
  description:
    "NEC Chapter 9 Table 9 AC resistance method at 75\u00B0C in conduit. " +
    "NEC recommends \u22643\u202F% for branch circuits and \u22645\u202F% total (feeder + branch).",
  category: "NEC Compliance",
  difficulty: "intermediate",
  formula: "1\u03C6: VD = I \u00D7 2 \u00D7 R \u00D7 D \u00F7 1000   |   3\u03C6: VD = I \u00D7 \u221A3 \u00D7 R \u00D7 D \u00F7 1000",
  calculationSteps: [
    "1. Look up AC resistance R from NEC Ch.\u20099 Table\u20099 (ohms/kft, 75\u00B0C, in conduit)",
    "2. Single-phase uses a 2\u00D7 multiplier (round-trip current path)",
    "3. Three-phase uses \u221A3 (1.732) multiplier",
    "4. Multiply: I \u00D7 phase-multiplier \u00D7 R \u00D7 one-way-distance",
    "5. Divide by 1,000 to convert ohm-feet \u2192 volts",
    "6. Divide voltage drop by system voltage \u2192 percentage",
    "7. Compare to 3\u202F% branch-circuit limit and 5\u202F% total limit",
  ],
  warnings: [
    "NEC recommends \u22643\u202F% on any single branch circuit",
    "NEC recommends \u22645\u202F% combined feeder + branch (NEC 210.19 Informational Note)",
    "14\u202FAWG aluminum is not permitted for 15\u202FA / 20\u202FA branch circuits (NEC 310.14)",
    "Excessive voltage drop causes motors to overheat and trip sensitive electronics",
    "High drop on long feeder runs also affects all downstream branch circuits",
  ],
  references: [
    "NEC 210.19(A) \u2014 branch-circuit conductor sizing",
    "NEC Chapter\u20099, Table\u20099 \u2014 AC resistance of conductors (75\u00B0C, in conduit)",
    "NEC 310.15(B) \u2014 conductor ampacity tables",
    "ANSI C84.1 \u2014 voltage tolerance limits for utilization equipment",
  ],
  tips: [
    "On long runs voltage drop often governs over ampacity \u2014 check both",
    "Doubling the wire size roughly halves the voltage drop",
    "On 480\u202FV 3\u03C6 systems the same load over the same run has 4\u00D7 less % drop than on 120\u202FV",
    "For feeder runs over 200\u202Fft, always model the drop before sizing conduit",
    "Running a larger feeder is much cheaper than re-pulling after the job is done",
  ],
  inputs: [
    {
      id: "voltage", label: "System Voltage", unit: "", type: "select",
      options: [
        { label: "120 V", value: "120" }, { label: "208 V", value: "208" },
        { label: "240 V", value: "240" }, { label: "277 V", value: "277" },
        { label: "480 V", value: "480" },
      ],
      defaultValue: "120",
    },
    {
      id: "phase", label: "System Type", unit: "", type: "select",
      options: [
        { label: "Single-Phase (1\u03C6)", value: "1" },
        { label: "Three-Phase (3\u03C6)", value: "3" },
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
    { id: "amps",     label: "Load Current",    unit: "A",  type: "number", defaultValue: "20",  min: 0, max: 6000 },
    { id: "distance", label: "One-Way Distance", unit: "ft", type: "number", defaultValue: "100", min: 0, max: 10000 },
  ],
  calculate: (inputs) => {
    const sysV  = parseFloat(inputs.voltage)  || 120;
    const phase = parseInt(inputs.phase)      || 1;
    const isCu  = inputs.material !== "al";
    const amps  = Math.max(parseFloat(inputs.amps)     || 0, 0);
    const dist  = Math.max(parseFloat(inputs.distance) || 0, 0);

    const row  = WIRE_TABLE.find((w) => w.label === inputs.awg) ?? WIRE_TABLE[1];
    const rRaw = isCu ? row.cu : (row.al ?? row.cu);
    const phaseMult = phase === 3 ? Math.sqrt(3) : 2;
    const vd    = (amps * rRaw * phaseMult * dist) / 1000;
    const vdPct = sysV > 0 ? (vd / sysV) * 100 : 0;

    const pass = vdPct <= 3;
    const statusText = pass
      ? `\u2713 PASS \u2014 ${vdPct.toFixed(2)}% (NEC \u22643% branch)`
      : `\u26A0 OVER \u2014 ${vdPct.toFixed(2)}% (limit: 3% branch / 5% total)`;

    let suggestion = "\u2713 Current wire size is within NEC limits";
    if (!pass) {
      for (const w of WIRE_TABLE) {
        const r2 = isCu ? w.cu : (w.al ?? w.cu);
        if (r2 >= rRaw) continue;
        const pct2 = (amps * r2 * phaseMult * dist) / 1000 / sysV * 100;
        if (pct2 <= 3) {
          suggestion = `\u2191 Upsize to ${w.label} ${isCu ? "Cu" : "Al"} \u2192 ${pct2.toFixed(2)}% drop`;
          break;
        }
      }
    }

    return [
      { label: "Voltage Drop",      value: Math.round(vd * 100) / 100,      unit: "V",   highlight: true },
      { label: "Drop Percentage",   value: Math.round(vdPct * 100) / 100,   unit: "%" },
      { label: "Voltage at Load",   value: Math.round((sysV - vd) * 100) / 100, unit: "V" },
      { label: "Status",            value: 0, unit: statusText },
      { label: "Suggestion",        value: 0, unit: suggestion },
      { label: `R (${isCu ? "Cu" : "Al"}, 75\u00B0C)`, value: rRaw, unit: "\u03A9/kft" },
      { label: phase === 3 ? "Multiplier (\u221A3)" : "Multiplier (round-trip)", value: Math.round(phaseMult * 1000) / 1000, unit: "\u00D7" },
    ];
  },
};
