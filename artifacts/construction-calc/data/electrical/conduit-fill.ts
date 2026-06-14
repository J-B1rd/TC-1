import type { Calculator } from "../types";

const WIRE_AREAS: Record<string, Record<string, number>> = {
  thhn: {
    "14": 0.0097,  "12": 0.0133,  "10": 0.0211,  "8": 0.0366,  "6": 0.0507,
    "4":  0.0824,  "3":  0.1041,  "2":  0.1158,  "1": 0.1562,  "1/0": 0.1855,
    "2/0": 0.2223, "3/0": 0.2679, "4/0": 0.3237, "250": 0.3970, "350": 0.5281, "500": 0.7542,
  },
  xhhw: {
    "14": 0.0135,  "12": 0.0172,  "10": 0.0242,  "8": 0.0437,  "6": 0.0590,
    "4":  0.0814,  "2":  0.1190,  "1":  0.1562,  "1/0": 0.1650, "2/0": 0.2024,
    "3/0": 0.2471, "4/0": 0.3076, "250": 0.3733, "350": 0.5243, "500": 0.7297,
  },
  rhh: {
    "14": 0.0209,  "12": 0.0260,  "10": 0.0333,  "8": 0.0556,  "6": 0.0726,
    "4":  0.1068,  "2":  0.1352,  "1":  0.1590,  "1/0": 0.2026, "2/0": 0.2463,
    "3/0": 0.2999, "4/0": 0.3718,
  },
};

const CONDUIT_AREAS: {
  label: string; value: string;
  emt: number; pvc40: number; pvc80: number; rmc: number;
}[] = [
  { label: '1/2"',   value: "half", emt: 0.122, pvc40: 0.122, pvc80: 0.092, rmc: 0.122 },
  { label: '3/4"',   value: "3q",   emt: 0.213, pvc40: 0.217, pvc80: 0.164, rmc: 0.213 },
  { label: '1"',     value: "1",    emt: 0.346, pvc40: 0.355, pvc80: 0.272, rmc: 0.346 },
  { label: '1-1/4"', value: "1q",   emt: 0.598, pvc40: 0.610, pvc80: 0.476, rmc: 0.598 },
  { label: '1-1/2"', value: "1h",   emt: 0.814, pvc40: 0.829, pvc80: 0.664, rmc: 0.814 },
  { label: '2"',     value: "2",    emt: 1.342, pvc40: 1.363, pvc80: 1.115, rmc: 1.342 },
  { label: '2-1/2"', value: "2h",   emt: 2.343, pvc40: 2.316, pvc80: 1.890, rmc: 2.343 },
  { label: '3"',     value: "3",    emt: 3.538, pvc40: 3.538, pvc80: 2.960, rmc: 3.538 },
  { label: '4"',     value: "4",    emt: 6.046, pvc40: 6.046, pvc80: 5.320, rmc: 6.046 },
];

const TYPE_LABEL: Record<string, string> = {
  emt: "EMT", pvc40: "PVC Sch 40", pvc80: "PVC Sch 80", rmc: "RMC",
};

function parseCF(inputs: Record<string, string>) {
  const count       = Math.max(Math.round(parseFloat(inputs.count) || 1), 1);
  const sizeRow     = CONDUIT_AREAS.find((c) => c.value === inputs.tradeSize) ?? CONDUIT_AREAS[1];
  const typeKey     = (inputs.conduitType || "emt") as "emt" | "pvc40" | "pvc80" | "rmc";
  const conduitArea = sizeRow[typeKey];
  const wireArea    = WIRE_AREAS[inputs.wireType]?.[inputs.wireSize] ?? 0;
  const totalWire   = wireArea * count;
  const fillPct     = conduitArea > 0 ? (totalWire / conduitArea) * 100 : 0;
  const necLimit    = count === 1 ? 53 : count === 2 ? 31 : 40;
  const maxCond     = conduitArea > 0 && wireArea > 0
    ? Math.floor((conduitArea * necLimit / 100) / wireArea) : 0;
  return { count, sizeRow, typeKey, conduitArea, wireArea, totalWire, fillPct, necLimit, maxCond };
}

export const conduitFill: Calculator = {
  id: "conduit-fill",
  name: "Conduit Fill",
  description:
    "NEC Chapter\u20099 fill limits: 1 wire = 53%, 2 wires = 31%, 3+ wires = 40%. " +
    "Wire areas from NEC Table\u20095. Supports EMT, PVC Sch\u200940/80, and RMC.",
  category: "NEC Compliance",
  difficulty: "basic",
  formula: "Fill\u202F% = (Total Wire Area \u00F7 Conduit Internal Area) \u00D7 100",
  calculationSteps: [
    "1. Find wire cross-sectional area from NEC Ch.\u20099 Table\u20095 (varies by wire type and gauge)",
    "2. Multiply single-wire area by number of conductors",
    "3. Find conduit internal area from NEC Ch.\u20099 Table\u20094 (varies by type and trade size)",
    "4. Divide total wire area by conduit area, multiply by 100 for percent",
    "5. Compare to NEC fill limit: 53% (1 wire), 31% (2 wires), 40% (3+ wires)",
    "6. Maximum conductors = floor(conduit area \u00D7 fill limit \u00F7 single-wire area)",
  ],
  warnings: [
    "PVC Schedule\u200980 has significantly less internal area than EMT or Sch\u200940 \u2014 do not substitute without recalculating",
    "NEC 310.15(B)(3)(a) requires ampacity derating when 4+ current-carrying conductors share a raceway",
    "Derate to 80% for 4\u20136 conductors, 70% for 7\u20139, 50% for 10+",
    "XHHW-2 conductors are larger in OD than THHN \u2014 always use the actual wire type for accurate fill",
    "Pulling lubricant is required above ~35% fill to prevent insulation damage",
  ],
  references: [
    "NEC Chapter\u20099, Table\u20091 \u2014 conduit fill percentages",
    "NEC Chapter\u20099, Table\u20094 \u2014 conduit internal dimensions",
    "NEC Chapter\u20099, Table\u20095 \u2014 conductor cross-sectional areas",
    "NEC 310.15(B)(3)(a) \u2014 adjustment factors for more than 3 current-carrying conductors",
  ],
  tips: [
    "When close to the limit, upsize one conduit size \u2014 cost difference is small vs. a failed pull",
    "Leave spare capacity in long conduit runs for future circuit additions",
    "Spring-loaded cable tuggers work best at 35\u201338% fill or less",
    "Always calculate fill for the conduit body, not just the straight run \u2014 fittings reduce pull-ability",
  ],
  inputs: [
    {
      id: "conduitType", label: "Conduit Type", unit: "", type: "select",
      options: [
        { label: "EMT",              value: "emt"   },
        { label: "PVC Schedule 40",  value: "pvc40" },
        { label: "PVC Schedule 80",  value: "pvc80" },
        { label: "RMC (Rigid Metal)",value: "rmc"   },
      ],
      defaultValue: "emt",
    },
    {
      id: "tradeSize", label: "Trade Size", unit: "", type: "select",
      options: CONDUIT_AREAS.map((c) => ({ label: c.label, value: c.value })),
      defaultValue: "3q",
    },
    {
      id: "wireType", label: "Wire Type", unit: "", type: "select",
      options: [
        { label: "THHN / THWN-2", value: "thhn" },
        { label: "XHHW-2",        value: "xhhw" },
        { label: "RHH / RHW-2",   value: "rhh"  },
      ],
      defaultValue: "thhn",
    },
    {
      id: "wireSize", label: "Wire Gauge", unit: "", type: "select",
      options: [
        { label: "14 AWG", value: "14"  }, { label: "12 AWG", value: "12"  },
        { label: "10 AWG", value: "10"  }, { label: "8 AWG",  value: "8"   },
        { label: "6 AWG",  value: "6"   }, { label: "4 AWG",  value: "4"   },
        { label: "3 AWG",  value: "3"   }, { label: "2 AWG",  value: "2"   },
        { label: "1 AWG",  value: "1"   }, { label: "1/0 AWG",value: "1/0" },
        { label: "2/0 AWG",value: "2/0" }, { label: "3/0 AWG",value: "3/0" },
        { label: "4/0 AWG",value: "4/0" }, { label: "250 kcmil",value:"250"},
        { label: "350 kcmil",value:"350"}, { label: "500 kcmil",value:"500"},
      ],
      defaultValue: "12",
    },
    {
      id: "count", label: "Number of Conductors", unit: "conductors",
      type: "number", defaultValue: "3", min: 1, max: 200, integer: true,
    },
  ],

  calculate: (inputs) => {
    const { count, sizeRow, typeKey, conduitArea, wireArea, totalWire, fillPct, necLimit, maxCond } = parseCF(inputs);
    const pass = fillPct <= necLimit;

    return [
      { label: "Fill Percentage",       value: Math.round(fillPct * 10) / 10, unit: "%", highlight: true },
      { label: "NEC Limit",             value: necLimit, unit: "%" },
      { label: "Status",                value: 0, unit: pass
          ? `\u2713 PASS \u2014 ${fillPct.toFixed(1)}% \u2264 ${necLimit}%`
          : `\u2717 OVER LIMIT \u2014 ${fillPct.toFixed(1)}% > ${necLimit}%` },
      { label: `Max conductors (${inputs.wireSize} AWG ${inputs.wireType.toUpperCase()})`,
        value: maxCond, unit: `in ${sizeRow.label} ${TYPE_LABEL[typeKey]}` },
      { label: "Total Wire Area",       value: Math.round(totalWire * 10000) / 10000, unit: "in\u00B2" },
      { label: "Conduit Internal Area", value: conduitArea,
        unit: `in\u00B2 (${sizeRow.label} ${TYPE_LABEL[typeKey]})` },
    ];
  },

  computeSteps: (inputs) => {
    const { count, sizeRow, typeKey, conduitArea, wireArea, totalWire, fillPct, necLimit, maxCond } = parseCF(inputs);
    const wLabel = `${inputs.wireSize} AWG ${inputs.wireType.toUpperCase()}`;
    const cLabel = `${sizeRow.label} ${TYPE_LABEL[typeKey]}`;
    const limitReason = count === 1 ? "1 conductor \u2192 53% max" : count === 2 ? "2 conductors \u2192 31% max" : "3+ conductors \u2192 40% max";
    const pass = fillPct <= necLimit;
    return [
      `Wire area (${wLabel}) = ${wireArea} in\u00B2  (NEC Ch.\u20099 Table\u20095)`,
      `Total wire area: ${count} conductors \u00D7 ${wireArea} in\u00B2 = ${totalWire.toFixed(5)} in\u00B2`,
      `Conduit area (${cLabel}) = ${conduitArea} in\u00B2  (NEC Ch.\u20099 Table\u20094)`,
      `Fill % = ${totalWire.toFixed(5)} \u00F7 ${conduitArea} \u00D7 100 = ${fillPct.toFixed(2)}%`,
      `NEC fill limit: ${limitReason}`,
      `${fillPct.toFixed(2)}% ${pass ? "\u2264" : ">"} ${necLimit}%  \u2192  ${pass ? "\u2713 PASS" : "\u2717 OVER"}`,
      `Max conductors: \u230A${conduitArea} \u00D7 ${necLimit / 100} \u00F7 ${wireArea}\u230B = ${maxCond} conductors`,
    ];
  },
};
