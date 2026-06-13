import type { Calculator } from "../types";

const GAIN_BY_SIZE: Record<string, number> = {
  "half": 5, "3q": 6, "1": 8, "1q": 9, "1h": 10, "2": 11,
};
const SIZE_LABEL: Record<string, string> = {
  "half": '1/2"', "3q": '3/4"', "1": '1"', "1q": '1-1/4"', "1h": '1-1/2"', "2": '2"',
};
const OFFSET_TABLE: { label: string; value: string; mult: number; shrink: number }[] = [
  { label: "10°", value: "10", mult: 5.76, shrink: 0.087 },
  { label: "22.5°", value: "22.5", mult: 2.613, shrink: 0.213 },
  { label: "30°", value: "30", mult: 2.000, shrink: 0.267 },
  { label: "45°", value: "45", mult: 1.414, shrink: 0.414 },
  { label: "60°", value: "60", mult: 1.155, shrink: 0.577 },
];

export const conduitBend: Calculator = {
  id: "conduit-bend",
  name: "Conduit Bend",
  description:
    "Field bending calculations for 90° stubs, offsets, and saddles. " +
    "Enter dimensions in inches. Gain/deduct values are typical for Ideal and Greenlee benders. " +
    "Always verify marks with your bender's specific deduct chart.",
  inputs: [
    {
      id: "bendType", label: "Bend Type", unit: "", type: "select",
      options: [
        { label: "90° Stub-Up", value: "stub90" },
        { label: "Offset Bend", value: "offset" },
        { label: "3-Point Saddle (45° / 22.5°)", value: "saddle3" },
        { label: "4-Point Saddle (box offset)", value: "saddle4" },
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
      type: "number", defaultValue: "12", min: 0,
      hint: "Stub-up: finished stub height. Offset/Saddle: obstacle height.",
    },
    {
      id: "angle", label: "Offset Bend Angle", unit: "", type: "select",
      options: OFFSET_TABLE.map((o) => ({ label: o.label, value: o.value })),
      defaultValue: "45",
      hint: "Only used for Offset bends.",
    },
    {
      id: "dimB", label: "Dim B: Obstacle Width (4-pt saddle only)", unit: "in",
      type: "number", defaultValue: "6", min: 0,
      hint: "Width of the obstacle to straddle (4-point saddle only).",
    },
  ],
  calculate: (inputs) => {
    const bendType = inputs.bendType || "stub90";
    const sizeKey  = inputs.conduitSize || "3q";
    const dimA     = Math.max(parseFloat(inputs.dimA) || 0, 0);
    const dimB     = Math.max(parseFloat(inputs.dimB) || 0, 0);
    const angleRow = OFFSET_TABLE.find((o) => o.value === inputs.angle) ?? OFFSET_TABLE[3];
    const gain     = GAIN_BY_SIZE[sizeKey] ?? 6;
    const sizeStr  = SIZE_LABEL[sizeKey] ?? '3/4"';

    if (bendType === "stub90") {
      const mark = Math.max(dimA - gain, 0);
      return [
        { label: "Mark Location (from end)", value: Math.round(mark * 100) / 100, unit: "in", highlight: true },
        { label: "Gain / Deduct",            value: gain,   unit: `in  (${sizeStr} conduit)` },
        { label: "Finished Stub Height",     value: dimA,   unit: "in" },
        { label: "Step 1", value: 0, unit: `Measure ${mark.toFixed(2)}" from the end of the conduit` },
        { label: "Step 2", value: 0, unit: `Place bender arrow on the mark, bend to 90\u00B0` },
        { label: "Step 3", value: 0, unit: `Stub should measure ${dimA}" from floor to end` },
      ];
    }

    if (bendType === "offset") {
      const between = dimA * angleRow.mult;
      const shrink  = dimA * angleRow.shrink;
      return [
        { label: "Distance Between Marks", value: Math.round(between * 100) / 100, unit: "in", highlight: true },
        { label: "Shrink",                 value: Math.round(shrink * 100) / 100, unit: "in  (reduce overall run by this amount)" },
        { label: "Angle",                  value: parseFloat(angleRow.value), unit: "\u00B0  per bend" },
        { label: "Step 1", value: 0, unit: `Make 1st mark at your reference point` },
        { label: "Step 2", value: 0, unit: `Make 2nd mark ${between.toFixed(2)}" forward of 1st mark` },
        { label: "Step 3", value: 0, unit: `Bend ${angleRow.value}\u00B0 at 1st mark (arrow toward end)` },
        { label: "Step 4", value: 0, unit: `Roll conduit 180\u00B0, bend ${angleRow.value}\u00B0 at 2nd mark` },
        { label: "Shrink Note", value: 0, unit: `Reduce your overall measured run by ${shrink.toFixed(2)}"` },
      ];
    }

    if (bendType === "saddle3") {
      const spread  = Math.round(dimA * 2.5 * 100) / 100;
      const half    = Math.round(spread / 2 * 100) / 100;
      const shrink  = Math.round(dimA * 0.1875 * 100) / 100;
      return [
        { label: "Spread (outer mark to outer mark)", value: spread, unit: "in", highlight: true },
        { label: "Center-to-outer mark spacing",      value: half,   unit: "in" },
        { label: "Shrink",  value: shrink, unit: "in  (reduce overall run)" },
        { label: "Obstacle height",                   value: dimA,   unit: "in" },
        { label: "Step 1", value: 0, unit: `Mark center of obstacle on conduit` },
        { label: "Step 2", value: 0, unit: `Mark ${half.toFixed(2)}" back (toward start) \u2192 Mark A` },
        { label: "Step 3", value: 0, unit: `Mark ${half.toFixed(2)}" forward (past center) \u2192 Mark B` },
        { label: "Step 4", value: 0, unit: `Bend 22.5\u00B0 at A, 45\u00B0 at center, 22.5\u00B0 at B` },
        { label: "Step 5", value: 0, unit: `Subtract ${shrink.toFixed(2)}" shrink from overall run` },
      ];
    }

    if (bendType === "saddle4") {
      const segLen  = Math.round(dimA * angleRow.mult * 100) / 100;
      const shrink  = Math.round(dimA * angleRow.shrink * 2 * 100) / 100;
      const totalSpan = Math.round((segLen * 2 + dimB) * 100) / 100;
      return [
        { label: "Total Span (mark A to mark D)", value: totalSpan, unit: "in", highlight: true },
        { label: "Segment length (each side)",    value: segLen,    unit: `in  (at ${angleRow.value}\u00B0)` },
        { label: "Obstacle Width",                value: dimB,      unit: "in" },
        { label: "Shrink",  value: shrink, unit: "in" },
        { label: "Step 1", value: 0, unit: `Mark A at 0" (start point)` },
        { label: "Step 2", value: 0, unit: `Mark B at ${segLen.toFixed(2)}" from A` },
        { label: "Step 3", value: 0, unit: `Mark C at ${(segLen + dimB).toFixed(2)}" from A (B + obstacle width)` },
        { label: "Step 4", value: 0, unit: `Mark D at ${totalSpan.toFixed(2)}" from A` },
        { label: "Step 5", value: 0, unit: `Bend ${angleRow.value}\u00B0 at A, ${angleRow.value}\u00B0 opposite at B, same at C & D` },
        { label: "Shrink Note", value: 0, unit: `Reduce run by ${shrink.toFixed(2)}" total` },
      ];
    }

    return [{ label: "Select a bend type above", value: 0, unit: "", highlight: true }];
  },
};
