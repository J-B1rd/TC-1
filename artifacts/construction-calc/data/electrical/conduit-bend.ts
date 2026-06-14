import type { Calculator } from "../types";

const GAIN: Record<string, number> = {
  half: 5, "3q": 6, "1": 8, "1q": 9, "1h": 10, "2": 11,
};
const SIZE_LABEL: Record<string, string> = {
  half: '1/2"', "3q": '3/4"', "1": '1"', "1q": '1-1/4"', "1h": '1-1/2"', "2": '2"',
};
const OFFSET_TABLE: { label: string; value: string; mult: number; shrink: number }[] = [
  { label: "10\u00B0",   value: "10",   mult: 5.76,  shrink: 0.087 },
  { label: "22.5\u00B0", value: "22.5", mult: 2.613, shrink: 0.213 },
  { label: "30\u00B0",   value: "30",   mult: 2.000, shrink: 0.267 },
  { label: "45\u00B0",   value: "45",   mult: 1.414, shrink: 0.414 },
  { label: "60\u00B0",   value: "60",   mult: 1.155, shrink: 0.577 },
];

function parseBend(inputs: Record<string, string>) {
  const bendType   = inputs.bendType    || "stub90";
  const sizeKey    = inputs.conduitSize || "3q";
  const dimA       = Math.max(parseFloat(inputs.dimA) || 0, 0);
  const dimB       = Math.max(parseFloat(inputs.dimB) || 0, 0);
  const angleRow   = OFFSET_TABLE.find((o) => o.value === inputs.angle) ?? OFFSET_TABLE[3];
  const gain       = GAIN[sizeKey] ?? 6;
  const sizeStr    = SIZE_LABEL[sizeKey] ?? '3/4"';
  return { bendType, sizeKey, dimA, dimB, angleRow, gain, sizeStr };
}

export const conduitBend: Calculator = {
  id: "conduit-bend",
  name: "Conduit Bend",
  description:
    "Field bending for 90\u00B0 stubs, offsets, 3-point, and 4-point saddles. " +
    "All dimensions in inches. Gain values are typical for Ideal and Greenlee hand benders \u2014 verify with your specific bender.",
  category: "Field Techniques",
  difficulty: "intermediate",
  formula:
    "Offset: D = Rise \u00F7 sin(\u03B8) | Shrink = Rise \u00D7 shrink-factor | 90\u00B0: Mark = Stub \u2212 Gain",
  calculationSteps: [
    "90\u00B0 stub: Mark location = desired stub height \u2212 bender gain for that conduit size",
    "Offset: Distance between marks = offset rise \u00F7 sin(bend angle)",
    "Offset shrink: subtract (rise \u00D7 shrink factor) from total measured run",
    "3-pt saddle (45\u00B0/22.5\u00B0): Spread = obstacle height \u00D7 2.5; Shrink = obstacle \u00D7 3\u20448\"",
    "4-pt saddle: each segment = obstacle height \u00F7 sin(angle); add obstacle width between the two pairs",
  ],
  warnings: [
    "Gain/deduct values vary by bender brand and head size \u2014 always confirm with your specific bender\u2019s chart",
    "Bend on a flat surface and keep the conduit level for consistent angles",
    "Hot-bending PVC requires even heat \u2014 cold spots cause kinks, not smooth arcs",
    "Conduit 1-1/4\" and larger typically needs a mechanical or hydraulic bender",
    "Verify 90\u00B0 angles with a speed square \u2014 the naked eye can be off by 2\u20133\u00B0",
  ],
  references: [
    "IBEW/NJATC Conduit Bending and Fabrication (textbook)",
    "Ideal Industries \u2014 conduit bender head deduct charts",
    "Greenlee \u2014 conduit bender instruction manuals",
    "NEC Chapter\u20093 \u2014 wiring methods (conduit use and installation requirements)",
  ],
  tips: [
    "For offsets, make both bends with the same arrow orientation to prevent conduit twist",
    "Mark your conduit with a pencil \u2014 felt-tip can smear during bending",
    "Kick the conduit into position before marking a 3-pt saddle so marks don\u2019t shift",
    "Shrink rule of thumb: 3\u20448\" per inch of rise at 22.5\u00B0, 1\u20444\" at 30\u00B0, 3\u20448\" at 45\u00B0",
    "For 4-pt saddles, use 22.5\u00B0 bends for shallower obstacles; 30\u00B0 for taller ones",
  ],
  inputs: [
    {
      id: "bendType", label: "Bend Type", unit: "", type: "select",
      options: [
        { label: "90\u00B0 Stub-Up",                   value: "stub90"  },
        { label: "Offset Bend",                        value: "offset"  },
        { label: "3-Point Saddle (45\u00B0 / 22.5\u00B0)", value: "saddle3" },
        { label: "4-Point Saddle (box offset)",        value: "saddle4" },
      ],
      defaultValue: "stub90",
    },
    {
      id: "conduitSize", label: "Conduit Size", unit: "", type: "select",
      options: Object.entries(SIZE_LABEL).map(([v, l]) => ({ label: l, value: v })),
      defaultValue: "3q",
    },
    {
      id: "dimA", label: "Dim A: Stub / Offset Height", unit: "in",
      type: "number", defaultValue: "12", min: 0, max: 360,
      hint: "Stub-up: finished stub height. Offset / Saddle: obstacle height.",
    },
    {
      id: "angle", label: "Offset Bend Angle", unit: "", type: "select",
      options: OFFSET_TABLE.map((o) => ({ label: o.label, value: o.value })),
      defaultValue: "45",
      hint: "Used for Offset and 4-Point Saddle bends.",
    },
    {
      id: "dimB", label: "Dim B: Obstacle Width (4-pt only)", unit: "in",
      type: "number", defaultValue: "6", min: 0, max: 360,
      hint: "Width of the obstacle to straddle \u2014 4-point saddle only.",
    },
  ],

  calculate: (inputs) => {
    const { bendType, dimA, dimB, angleRow, gain, sizeStr } = parseBend(inputs);

    if (bendType === "stub90") {
      const mark = Math.max(dimA - gain, 0);
      return [
        { label: "Mark Location (from end)", value: Math.round(mark * 100) / 100, unit: "in", highlight: true },
        { label: "Gain / Deduct",            value: gain, unit: `in (${sizeStr})` },
        { label: "Finished Stub",            value: dimA, unit: "in" },
        { label: "Step 1", value: 0, unit: `Measure ${mark.toFixed(3)}" from conduit end` },
        { label: "Step 2", value: 0, unit: `Place bender arrow on mark; bend to 90\u00B0` },
        { label: "Step 3", value: 0, unit: `Check: stub should measure ${dimA}" from floor` },
      ];
    }
    if (bendType === "offset") {
      const between = dimA * angleRow.mult;
      const shrink  = dimA * angleRow.shrink;
      return [
        { label: "Distance Between Marks", value: Math.round(between * 100) / 100, unit: "in", highlight: true },
        { label: "Shrink",                 value: Math.round(shrink * 100) / 100,  unit: "in (reduce total run)" },
        { label: "Bend Angle",             value: parseFloat(angleRow.value), unit: "\u00B0 per bend" },
        { label: "Step 1", value: 0, unit: "Make 1st mark at your reference point" },
        { label: "Step 2", value: 0, unit: `Make 2nd mark ${between.toFixed(3)}" forward` },
        { label: "Step 3", value: 0, unit: `Bend ${angleRow.value}\u00B0 at 1st mark (arrow toward end)` },
        { label: "Step 4", value: 0, unit: `Roll 180\u00B0; bend ${angleRow.value}\u00B0 at 2nd mark` },
        { label: "Shrink Note", value: 0, unit: `Shorten overall run by ${shrink.toFixed(3)}"` },
      ];
    }
    if (bendType === "saddle3") {
      const spread = Math.round(dimA * 2.5    * 100) / 100;
      const half   = Math.round(spread / 2    * 100) / 100;
      const shrink = Math.round(dimA * 0.1875 * 100) / 100;
      return [
        { label: "Spread (outer to outer)", value: spread, unit: "in", highlight: true },
        { label: "Center to each outer",    value: half,   unit: "in" },
        { label: "Shrink",                  value: shrink, unit: "in" },
        { label: "Step 1", value: 0, unit: "Mark center of obstacle on conduit" },
        { label: "Step 2", value: 0, unit: `Mark ${half.toFixed(3)}" back \u2192 Mark A` },
        { label: "Step 3", value: 0, unit: `Mark ${half.toFixed(3)}" forward \u2192 Mark B` },
        { label: "Step 4", value: 0, unit: "Bend 22.5\u00B0 at A, 45\u00B0 at center, 22.5\u00B0 at B" },
        { label: "Step 5", value: 0, unit: `Subtract ${shrink.toFixed(3)}" shrink from run` },
      ];
    }
    if (bendType === "saddle4") {
      const segLen    = Math.round(dimA * angleRow.mult        * 100) / 100;
      const shrink    = Math.round(dimA * angleRow.shrink * 2  * 100) / 100;
      const totalSpan = Math.round((segLen * 2 + dimB)         * 100) / 100;
      return [
        { label: "Total Span (A \u2192 D)", value: totalSpan, unit: "in", highlight: true },
        { label: "Segment (each side)",    value: segLen,    unit: `in at ${angleRow.value}\u00B0` },
        { label: "Obstacle Width",         value: dimB,      unit: "in" },
        { label: "Shrink",                 value: shrink,    unit: "in" },
        { label: "Step 1", value: 0, unit: `Mark A at start; Mark B at ${segLen.toFixed(3)}"` },
        { label: "Step 2", value: 0, unit: `Mark C at ${(segLen + dimB).toFixed(3)}"; Mark D at ${totalSpan.toFixed(3)}"` },
        { label: "Step 3", value: 0, unit: `Bend ${angleRow.value}\u00B0 at A; reverse ${angleRow.value}\u00B0 at B` },
        { label: "Step 4", value: 0, unit: `Bend reverse ${angleRow.value}\u00B0 at C; ${angleRow.value}\u00B0 at D` },
        { label: "Shrink Note", value: 0, unit: `Reduce run by ${shrink.toFixed(3)}"` },
      ];
    }
    return [{ label: "Select a bend type", value: 0, unit: "" }];
  },

  computeSteps: (inputs) => {
    const { bendType, dimA, dimB, angleRow, gain, sizeStr } = parseBend(inputs);

    if (bendType === "stub90") {
      const mark = Math.max(dimA - gain, 0);
      return [
        `Stub height wanted: ${dimA}"`,
        `Bender gain (${sizeStr} conduit) = ${gain}"  (Ideal/Greenlee standard)`,
        `Mark location = ${dimA}" \u2212 ${gain}" = ${mark.toFixed(3)}" from the end`,
        `Place bender arrow at ${mark.toFixed(3)}" \u2192 bend to 90\u00B0 \u2192 finished stub = ${dimA}"`,
      ];
    }
    if (bendType === "offset") {
      const between = dimA * angleRow.mult;
      const shrink  = dimA * angleRow.shrink;
      return [
        `Offset rise: ${dimA}"`,
        `Bend angle: ${angleRow.value}\u00B0, multiplier = ${angleRow.mult}`,
        `Distance between marks = ${dimA}" \u00D7 ${angleRow.mult} = ${between.toFixed(3)}"`,
        `Shrink factor for ${angleRow.value}\u00B0 = ${angleRow.shrink}`,
        `Shrink = ${dimA}" \u00D7 ${angleRow.shrink} = ${shrink.toFixed(3)}"`,
        `Reduce total conduit run by ${shrink.toFixed(3)}"`,
      ];
    }
    if (bendType === "saddle3") {
      const spread = dimA * 2.5;
      const half   = spread / 2;
      const shrink = dimA * 0.1875;
      return [
        `Obstacle height: ${dimA}"`,
        `Spread = obstacle \u00D7 2.5 = ${dimA}" \u00D7 2.5 = ${spread.toFixed(3)}"`,
        `Center to each outer mark = ${spread.toFixed(3)}" \u00F7 2 = ${half.toFixed(3)}"`,
        `Shrink factor (3-pt saddle) \u2248 3/16" per inch of rise`,
        `Shrink = ${dimA}" \u00D7 0.1875 = ${shrink.toFixed(3)}"`,
        `Bend sequence: 22.5\u00B0 at Mark A \u2192 45\u00B0 at center \u2192 22.5\u00B0 at Mark B`,
      ];
    }
    if (bendType === "saddle4") {
      const segLen    = dimA * angleRow.mult;
      const shrink    = dimA * angleRow.shrink * 2;
      const totalSpan = segLen * 2 + dimB;
      return [
        `Obstacle height: ${dimA}", width: ${dimB}", bend angle: ${angleRow.value}\u00B0`,
        `Multiplier for ${angleRow.value}\u00B0 = ${angleRow.mult}`,
        `Each segment = ${dimA}" \u00D7 ${angleRow.mult} = ${segLen.toFixed(3)}"`,
        `Total span = ${segLen.toFixed(3)}" + ${dimB}" + ${segLen.toFixed(3)}" = ${totalSpan.toFixed(3)}"`,
        `Shrink per side = ${dimA}" \u00D7 ${angleRow.shrink} = ${(dimA * angleRow.shrink).toFixed(3)}"`,
        `Total shrink (both sides) = ${shrink.toFixed(3)}"`,
      ];
    }
    return [];
  },
};
