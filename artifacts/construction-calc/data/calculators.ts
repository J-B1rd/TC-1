export type InputType = "number" | "select";

export type SelectOption = {
  label: string;
  value: string;
};

export type CalculatorInput = {
  id: string;
  label: string;
  unit: string;
  type: InputType;
  options?: SelectOption[];
  defaultValue?: string;
  hint?: string;
  min?: number;
  step?: number;
};

export type CalculatorResult = {
  label: string;
  value: number;
  unit: string;
  highlight?: boolean;
};

export type Calculator = {
  id: string;
  name: string;
  description: string;
  inputs: CalculatorInput[];
  calculate: (inputs: Record<string, string>) => CalculatorResult[];
};

export type Trade = {
  id: string;
  name: string;
  color: string;
  icon: string;
  calculators: Calculator[];
};

// ─── CONCRETE ────────────────────────────────────────────────────────────────

const concreteSlab: Calculator = {
  id: "concrete-slab",
  name: "Concrete Slab",
  description: "Volume and bag count for a concrete slab",
  inputs: [
    { id: "length", label: "Length", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    { id: "width", label: "Width", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    { id: "thickness", label: "Thickness", unit: "in", type: "number", defaultValue: "4", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const w = parseFloat(inputs.width) || 0;
    const t = (parseFloat(inputs.thickness) || 0) / 12;
    const cubicFt = l * w * t;
    const cubicYards = cubicFt / 27;
    const bags80 = Math.ceil(cubicFt / 0.45);
    const bags60 = Math.ceil(cubicFt / 0.3);
    return [
      { label: "Cubic Yards", value: Math.round(cubicYards * 100) / 100, unit: "yd³", highlight: true },
      { label: "Cubic Feet", value: Math.round(cubicFt * 10) / 10, unit: "ft³" },
      { label: "80 lb Bags", value: bags80, unit: "bags" },
      { label: "60 lb Bags", value: bags60, unit: "bags" },
    ];
  },
};

const concreteFooting: Calculator = {
  id: "concrete-footing",
  name: "Footing / Column",
  description: "Volume for footings and columns",
  inputs: [
    { id: "length", label: "Length / Height", unit: "ft", type: "number", defaultValue: "10", min: 0 },
    { id: "width", label: "Width", unit: "in", type: "number", defaultValue: "12", min: 0 },
    { id: "depth", label: "Depth / Diameter", unit: "in", type: "number", defaultValue: "12", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const w = (parseFloat(inputs.width) || 0) / 12;
    const d = (parseFloat(inputs.depth) || 0) / 12;
    const cubicFt = l * w * d;
    const cubicYards = cubicFt / 27;
    const bags80 = Math.ceil(cubicFt / 0.45);
    return [
      { label: "Cubic Yards", value: Math.round(cubicYards * 100) / 100, unit: "yd³", highlight: true },
      { label: "Cubic Feet", value: Math.round(cubicFt * 10) / 10, unit: "ft³" },
      { label: "80 lb Bags", value: bags80, unit: "bags" },
    ];
  },
};

const rebarQuantity: Calculator = {
  id: "rebar-quantity",
  name: "Rebar Quantity",
  description: "Linear feet of rebar for a slab grid",
  inputs: [
    { id: "length", label: "Slab Length", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    { id: "width", label: "Slab Width", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    { id: "spacing", label: "Spacing", unit: "in", type: "number", defaultValue: "12", min: 1 },
    { id: "overlap", label: "Lap Splice", unit: "in", type: "number", defaultValue: "18", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const w = parseFloat(inputs.width) || 0;
    const spacing = (parseFloat(inputs.spacing) || 12) / 12;
    const overlap = (parseFloat(inputs.overlap) || 0) / 12;
    const rowsLong = Math.floor(w / spacing) + 1;
    const rowsShort = Math.floor(l / spacing) + 1;
    const linearFt = (rowsLong * l) + (rowsShort * w);
    const bars20 = Math.ceil(linearFt / (20 - overlap));
    return [
      { label: "Linear Feet", value: Math.round(linearFt), unit: "ft", highlight: true },
      { label: "20 ft Bars", value: bars20, unit: "bars" },
      { label: "Rows (long way)", value: rowsLong, unit: "rows" },
      { label: "Rows (short way)", value: rowsShort, unit: "rows" },
    ];
  },
};

const cmuCount: Calculator = {
  id: "cmu-count",
  name: "CMU Block Count",
  description: "Number of concrete masonry units for a wall",
  inputs: [
    { id: "length", label: "Wall Length", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    { id: "height", label: "Wall Height", unit: "ft", type: "number", defaultValue: "8", min: 0 },
    {
      id: "size", label: "Block Size", unit: "", type: "select",
      options: [
        { label: "8×8×16", value: "0.89" },
        { label: "4×8×16", value: "0.89" },
        { label: "6×8×16", value: "0.89" },
        { label: "12×8×16", value: "0.89" },
      ],
      defaultValue: "0.89",
    },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "5", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const h = parseFloat(inputs.height) || 0;
    const area = l * h;
    const blocksPerSqFt = 1.125;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const blocks = Math.ceil(area * blocksPerSqFt * waste);
    const mortar = Math.ceil(blocks / 30);
    return [
      { label: "Block Count", value: blocks, unit: "blocks", highlight: true },
      { label: "Wall Area", value: Math.round(area), unit: "ft²" },
      { label: "Mortar Bags (70lb)", value: mortar, unit: "bags" },
    ];
  },
};

// ─── FRAMING / LUMBER ─────────────────────────────────────────────────────────

const studCount: Calculator = {
  id: "stud-count",
  name: "Stud Count",
  description: "Number of studs for a wall",
  inputs: [
    { id: "length", label: "Wall Length", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    {
      id: "spacing", label: "Stud Spacing", unit: "", type: "select",
      options: [
        { label: "12\" O.C.", value: "12" },
        { label: "16\" O.C.", value: "16" },
        { label: "24\" O.C.", value: "24" },
      ],
      defaultValue: "16",
    },
    { id: "extra", label: "Extra (corners/openings)", unit: "studs", type: "number", defaultValue: "4", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const spacing = parseFloat(inputs.spacing) || 16;
    const extra = parseFloat(inputs.extra) || 0;
    const field = Math.ceil((l * 12) / spacing) + 1;
    const total = field + extra;
    return [
      { label: "Total Studs", value: total, unit: "studs", highlight: true },
      { label: "Field Studs", value: field, unit: "studs" },
      { label: "Extra (corners/headers)", value: extra, unit: "studs" },
    ];
  },
};

const boardFeet: Calculator = {
  id: "board-feet",
  name: "Board Feet",
  description: "Calculate board feet of lumber",
  inputs: [
    { id: "thickness", label: "Thickness", unit: "in", type: "number", defaultValue: "2", min: 0 },
    { id: "width", label: "Width", unit: "in", type: "number", defaultValue: "6", min: 0 },
    { id: "length", label: "Length", unit: "ft", type: "number", defaultValue: "8", min: 0 },
    { id: "quantity", label: "Quantity", unit: "pcs", type: "number", defaultValue: "10", min: 1 },
  ],
  calculate: (inputs) => {
    const t = parseFloat(inputs.thickness) || 0;
    const w = parseFloat(inputs.width) || 0;
    const l = parseFloat(inputs.length) || 0;
    const qty = parseFloat(inputs.quantity) || 1;
    const bdFtEach = (t * w * l) / 12;
    const total = bdFtEach * qty;
    return [
      { label: "Total Board Feet", value: Math.round(total * 10) / 10, unit: "BF", highlight: true },
      { label: "Board Feet Each", value: Math.round(bdFtEach * 10) / 10, unit: "BF" },
    ];
  },
};

const sheathingSheets: Calculator = {
  id: "sheathing-sheets",
  name: "Plywood / OSB Sheets",
  description: "Sheet count for floors, walls, or roofs",
  inputs: [
    { id: "area", label: "Total Area", unit: "ft²", type: "number", defaultValue: "400", min: 0 },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const sheetArea = 32;
    const sheets = Math.ceil((area * waste) / sheetArea);
    return [
      { label: "Sheets Needed", value: sheets, unit: "sheets", highlight: true },
      { label: "Net Area", value: Math.round(area), unit: "ft²" },
      { label: "With Waste", value: Math.round(area * waste), unit: "ft²" },
    ];
  },
};

const joistCount: Calculator = {
  id: "joist-count",
  name: "Joist / Rafter Count",
  description: "Number of joists or rafters for a span",
  inputs: [
    { id: "span", label: "Span Length", unit: "ft", type: "number", defaultValue: "16", min: 0 },
    {
      id: "spacing", label: "Spacing", unit: "", type: "select",
      options: [
        { label: "12\" O.C.", value: "12" },
        { label: "16\" O.C.", value: "16" },
        { label: "19.2\" O.C.", value: "19.2" },
        { label: "24\" O.C.", value: "24" },
      ],
      defaultValue: "16",
    },
  ],
  calculate: (inputs) => {
    const span = parseFloat(inputs.span) || 0;
    const spacing = parseFloat(inputs.spacing) || 16;
    const count = Math.ceil((span * 12) / spacing) + 1;
    return [
      { label: "Joist / Rafter Count", value: count, unit: "pcs", highlight: true },
      { label: "Span", value: span, unit: "ft" },
    ];
  },
};

// ─── ELECTRICAL ───────────────────────────────────────────────────────────────

const circuitLoad: Calculator = {
  id: "circuit-load",
  name: "Circuit Load",
  description: "Amps from watts at a given voltage",
  inputs: [
    { id: "watts", label: "Total Watts", unit: "W", type: "number", defaultValue: "1800", min: 0 },
    {
      id: "voltage", label: "Voltage", unit: "", type: "select",
      options: [
        { label: "120V", value: "120" },
        { label: "240V", value: "240" },
        { label: "208V", value: "208" },
        { label: "277V", value: "277" },
      ],
      defaultValue: "120",
    },
    { id: "pf", label: "Power Factor", unit: "", type: "number", defaultValue: "1.0", min: 0.1, step: 0.1 },
  ],
  calculate: (inputs) => {
    const w = parseFloat(inputs.watts) || 0;
    const v = parseFloat(inputs.voltage) || 120;
    const pf = parseFloat(inputs.pf) || 1;
    const amps = w / (v * pf);
    let breaker = 15;
    if (amps > 12) breaker = 20;
    if (amps > 16) breaker = 20;
    if (amps > 20) breaker = 30;
    if (amps > 24) breaker = 30;
    if (amps > 30) breaker = 40;
    if (amps > 40) breaker = 50;
    if (amps > 50) breaker = 60;
    if (amps > 60) breaker = 70;
    if (amps > 70) breaker = 80;
    if (amps > 80) breaker = 100;
    return [
      { label: "Amps", value: Math.round(amps * 100) / 100, unit: "A", highlight: true },
      { label: "Recommended Breaker", value: breaker, unit: "A" },
      { label: "Load at 80%", value: Math.round(amps * 0.8 * 100) / 100, unit: "A" },
    ];
  },
};

const voltageDrop: Calculator = {
  id: "voltage-drop",
  name: "Voltage Drop",
  description: "Voltage drop over a wire run",
  inputs: [
    { id: "amps", label: "Load", unit: "A", type: "number", defaultValue: "20", min: 0 },
    { id: "distance", label: "One-Way Distance", unit: "ft", type: "number", defaultValue: "100", min: 0 },
    {
      id: "awg", label: "Wire Gauge", unit: "", type: "select",
      options: [
        { label: "14 AWG", value: "2.525" },
        { label: "12 AWG", value: "1.588" },
        { label: "10 AWG", value: "0.999" },
        { label: "8 AWG", value: "0.628" },
        { label: "6 AWG", value: "0.395" },
        { label: "4 AWG", value: "0.249" },
        { label: "2 AWG", value: "0.156" },
        { label: "1/0 AWG", value: "0.098" },
        { label: "2/0 AWG", value: "0.078" },
        { label: "3/0 AWG", value: "0.062" },
        { label: "4/0 AWG", value: "0.049" },
      ],
      defaultValue: "1.588",
    },
    {
      id: "voltage", label: "System Voltage", unit: "", type: "select",
      options: [
        { label: "120V", value: "120" },
        { label: "240V", value: "240" },
      ],
      defaultValue: "120",
    },
  ],
  calculate: (inputs) => {
    const amps = parseFloat(inputs.amps) || 0;
    const dist = parseFloat(inputs.distance) || 0;
    const ohmsPerKft = parseFloat(inputs.awg) || 1.588;
    const voltage = parseFloat(inputs.voltage) || 120;
    const totalLength = dist * 2;
    const drop = (amps * ohmsPerKft * totalLength) / 1000;
    const dropPct = (drop / voltage) * 100;
    return [
      { label: "Voltage Drop", value: Math.round(drop * 100) / 100, unit: "V", highlight: true },
      { label: "Drop %", value: Math.round(dropPct * 100) / 100, unit: "%" },
      { label: "Voltage at Load", value: Math.round((voltage - drop) * 100) / 100, unit: "V" },
    ];
  },
};

const wireGauge: Calculator = {
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

const conduitFill: Calculator = {
  id: "conduit-fill",
  name: "Conduit Fill",
  description: "Wire fill percentage in conduit",
  inputs: [
    {
      id: "awg", label: "Wire Gauge", unit: "", type: "select",
      options: [
        { label: "14 AWG THHN", value: "0.0097" },
        { label: "12 AWG THHN", value: "0.0133" },
        { label: "10 AWG THHN", value: "0.0211" },
        { label: "8 AWG THHN", value: "0.0366" },
        { label: "6 AWG THHN", value: "0.0507" },
        { label: "4 AWG THHN", value: "0.0824" },
        { label: "2 AWG THHN", value: "0.1158" },
      ],
      defaultValue: "0.0133",
    },
    { id: "count", label: "Number of Wires", unit: "wires", type: "number", defaultValue: "3", min: 1 },
    {
      id: "conduit", label: "Conduit Trade Size", unit: "", type: "select",
      options: [
        { label: "1/2\" EMT (0.122 in²)", value: "0.122" },
        { label: "3/4\" EMT (0.213 in²)", value: "0.213" },
        { label: "1\" EMT (0.346 in²)", value: "0.346" },
        { label: "1-1/4\" EMT (0.598 in²)", value: "0.598" },
        { label: "1-1/2\" EMT (0.814 in²)", value: "0.814" },
        { label: "2\" EMT (1.342 in²)", value: "1.342" },
        { label: "2-1/2\" EMT (2.343 in²)", value: "2.343" },
        { label: "3\" EMT (3.538 in²)", value: "3.538" },
      ],
      defaultValue: "0.213",
    },
  ],
  calculate: (inputs) => {
    const wireArea = parseFloat(inputs.awg) || 0;
    const count = parseFloat(inputs.count) || 1;
    const conduitArea = parseFloat(inputs.conduit) || 1;
    const totalWireArea = wireArea * count;
    const fillPct = (totalWireArea / conduitArea) * 100;
    const limit = count === 1 ? 53 : count === 2 ? 31 : 40;
    const ok = fillPct <= limit;
    return [
      { label: "Fill Percentage", value: Math.round(fillPct * 10) / 10, unit: "%", highlight: true },
      { label: "NEC Limit", value: limit, unit: "%" },
      { label: "Status (0=OK, 1=Over)", value: ok ? 0 : 1, unit: ok ? "PASS" : "OVER" },
      { label: "Total Wire Area", value: Math.round(totalWireArea * 10000) / 10000, unit: "in²" },
    ];
  },
};

// ─── PLUMBING ─────────────────────────────────────────────────────────────────

const drainSlope: Calculator = {
  id: "drain-slope",
  name: "Drain Slope",
  description: "Calculate slope and drop for drain lines",
  inputs: [
    { id: "length", label: "Pipe Run", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    {
      id: "slope", label: "Slope", unit: "", type: "select",
      options: [
        { label: "1/8\" per foot", value: "0.125" },
        { label: "1/4\" per foot", value: "0.25" },
        { label: "1/2\" per foot", value: "0.5" },
      ],
      defaultValue: "0.25",
    },
  ],
  calculate: (inputs) => {
    const length = parseFloat(inputs.length) || 0;
    const slopePerFt = parseFloat(inputs.slope) || 0.25;
    const totalDrop = length * slopePerFt;
    const slopePct = (slopePerFt / 12) * 100;
    return [
      { label: "Total Drop", value: Math.round(totalDrop * 100) / 100, unit: "in", highlight: true },
      { label: "Total Drop", value: Math.round((totalDrop / 12) * 100) / 100, unit: "ft" },
      { label: "Slope %", value: Math.round(slopePct * 100) / 100, unit: "%" },
    ];
  },
};

const pipeSizing: Calculator = {
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

const fixtureUnits: Calculator = {
  id: "fixture-units",
  name: "Fixture Units (DFU)",
  description: "Total drainage fixture units for a system",
  inputs: [
    { id: "toilets", label: "Toilets / Water Closets", unit: "ea", type: "number", defaultValue: "2", min: 0 },
    { id: "sinks", label: "Lavatories / Sinks", unit: "ea", type: "number", defaultValue: "2", min: 0 },
    { id: "bathtubs", label: "Bathtubs / Showers", unit: "ea", type: "number", defaultValue: "1", min: 0 },
    { id: "dishwasher", label: "Dishwashers", unit: "ea", type: "number", defaultValue: "1", min: 0 },
    { id: "washingMachine", label: "Washing Machines", unit: "ea", type: "number", defaultValue: "1", min: 0 },
    { id: "floorDrains", label: "Floor Drains", unit: "ea", type: "number", defaultValue: "0", min: 0 },
  ],
  calculate: (inputs) => {
    const toilets = parseFloat(inputs.toilets) || 0;
    const sinks = parseFloat(inputs.sinks) || 0;
    const bathtubs = parseFloat(inputs.bathtubs) || 0;
    const dw = parseFloat(inputs.dishwasher) || 0;
    const wm = parseFloat(inputs.washingMachine) || 0;
    const fd = parseFloat(inputs.floorDrains) || 0;
    const total = (toilets * 4) + (sinks * 1) + (bathtubs * 2) + (dw * 2) + (wm * 3) + (fd * 2);
    let minBranchSize = "2\"";
    if (total > 8) minBranchSize = "3\"";
    if (total > 20) minBranchSize = "4\"";
    return [
      { label: "Total DFUs", value: total, unit: "DFU", highlight: true },
      { label: "Min Branch Drain Size", value: 0, unit: minBranchSize },
    ];
  },
};

const pressureLoss: Calculator = {
  id: "pressure-loss",
  name: "Water Pressure Loss",
  description: "Pressure drop through a pipe run",
  inputs: [
    { id: "gpm", label: "Flow Rate", unit: "GPM", type: "number", defaultValue: "10", min: 0 },
    { id: "length", label: "Pipe Length", unit: "ft", type: "number", defaultValue: "100", min: 0 },
    {
      id: "diameter", label: "Pipe Diameter", unit: "", type: "select",
      options: [
        { label: "1/2\"", value: "0.5" },
        { label: "3/4\"", value: "0.75" },
        { label: "1\"", value: "1.0" },
        { label: "1-1/4\"", value: "1.25" },
        { label: "1-1/2\"", value: "1.5" },
        { label: "2\"", value: "2.0" },
      ],
      defaultValue: "0.75",
    },
  ],
  calculate: (inputs) => {
    const gpm = parseFloat(inputs.gpm) || 0;
    const length = parseFloat(inputs.length) || 0;
    const d = parseFloat(inputs.diameter) || 0.75;
    const velocity = gpm / (0.7854 * d * d * 0.0408);
    const headLoss = (0.2083 * Math.pow(100 / 100, 1.852) * Math.pow(gpm, 1.852) * length) / (Math.pow(d, 4.8655));
    const psiLoss = headLoss * 0.4335;
    return [
      { label: "Pressure Loss", value: Math.round(psiLoss * 100) / 100, unit: "psi", highlight: true },
      { label: "Head Loss", value: Math.round(headLoss * 100) / 100, unit: "ft" },
      { label: "Flow Velocity", value: Math.round(velocity * 100) / 100, unit: "ft/s" },
    ];
  },
};

// ─── HVAC ─────────────────────────────────────────────────────────────────────

const btuLoad: Calculator = {
  id: "btu-load",
  name: "BTU Load Estimator",
  description: "Heating and cooling load for a space",
  inputs: [
    { id: "area", label: "Room Area", unit: "ft²", type: "number", defaultValue: "500", min: 0 },
    { id: "height", label: "Ceiling Height", unit: "ft", type: "number", defaultValue: "9", min: 0 },
    {
      id: "climate", label: "Climate Zone", unit: "", type: "select",
      options: [
        { label: "Hot / Southern", value: "25" },
        { label: "Moderate / Mid-US", value: "20" },
        { label: "Cool / Northern", value: "15" },
      ],
      defaultValue: "20",
    },
    { id: "windows", label: "Windows", unit: "ea", type: "number", defaultValue: "2", min: 0 },
    { id: "occupants", label: "Occupants", unit: "people", type: "number", defaultValue: "2", min: 0 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const height = parseFloat(inputs.height) || 9;
    const factor = parseFloat(inputs.climate) || 20;
    const windows = parseFloat(inputs.windows) || 0;
    const occupants = parseFloat(inputs.occupants) || 0;
    const base = area * factor;
    const windowBtus = windows * 1000;
    const occupantBtus = occupants * 600;
    const total = base + windowBtus + occupantBtus;
    const tons = total / 12000;
    return [
      { label: "Cooling BTU/hr", value: Math.round(total), unit: "BTU/hr", highlight: true },
      { label: "Tons of Cooling", value: Math.round(tons * 10) / 10, unit: "tons" },
      { label: "Heating BTU/hr (est.)", value: Math.round(total * 1.2), unit: "BTU/hr" },
      { label: "Volume", value: Math.round(area * height), unit: "ft³" },
    ];
  },
};

const ductSizing: Calculator = {
  id: "duct-sizing",
  name: "Duct Sizing",
  description: "Round duct diameter from CFM and velocity",
  inputs: [
    { id: "cfm", label: "Airflow", unit: "CFM", type: "number", defaultValue: "400", min: 0 },
    {
      id: "velocity", label: "Target Velocity", unit: "", type: "select",
      options: [
        { label: "600 FPM (Low velocity)", value: "600" },
        { label: "800 FPM (Residential)", value: "800" },
        { label: "1000 FPM (Commercial)", value: "1000" },
        { label: "1200 FPM (High velocity)", value: "1200" },
      ],
      defaultValue: "800",
    },
  ],
  calculate: (inputs) => {
    const cfm = parseFloat(inputs.cfm) || 0;
    const fpm = parseFloat(inputs.velocity) || 800;
    const sqFt = cfm / fpm;
    const sqIn = sqFt * 144;
    const diameter = Math.sqrt((4 * sqIn) / Math.PI);
    const rectW = Math.ceil(Math.sqrt(sqIn) * 1.2);
    const rectH = Math.ceil(sqIn / rectW);
    return [
      { label: "Round Duct Diameter", value: Math.round(diameter * 10) / 10, unit: "in", highlight: true },
      { label: "Rectangular (approx)", value: 0, unit: `${rectW}\" × ${rectH}\"` },
      { label: "Cross-Sectional Area", value: Math.round(sqIn * 10) / 10, unit: "in²" },
      { label: "Actual Velocity", value: Math.round(fpm), unit: "FPM" },
    ];
  },
};

const cfmPerRoom: Calculator = {
  id: "cfm-per-room",
  name: "CFM Per Room",
  description: "Required airflow for a room by area",
  inputs: [
    { id: "area", label: "Room Area", unit: "ft²", type: "number", defaultValue: "200", min: 0 },
    { id: "height", label: "Ceiling Height", unit: "ft", type: "number", defaultValue: "9", min: 0 },
    {
      id: "ach", label: "Air Changes / Hour", unit: "", type: "select",
      options: [
        { label: "4 ACH (Bedroom)", value: "4" },
        { label: "6 ACH (Living Room)", value: "6" },
        { label: "8 ACH (Kitchen)", value: "8" },
        { label: "10 ACH (Bathroom)", value: "10" },
        { label: "15 ACH (Commercial)", value: "15" },
      ],
      defaultValue: "6",
    },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const height = parseFloat(inputs.height) || 9;
    const ach = parseFloat(inputs.ach) || 6;
    const volume = area * height;
    const cfm = (volume * ach) / 60;
    return [
      { label: "Required CFM", value: Math.round(cfm), unit: "CFM", highlight: true },
      { label: "Room Volume", value: Math.round(volume), unit: "ft³" },
      { label: "Air Changes/hr", value: ach, unit: "ACH" },
    ];
  },
};

// ─── ROOFING ──────────────────────────────────────────────────────────────────

const roofPitch: Calculator = {
  id: "roof-pitch",
  name: "Roof Pitch",
  description: "Pitch angle and multiplier from rise and run",
  inputs: [
    { id: "rise", label: "Rise", unit: "in", type: "number", defaultValue: "6", min: 0 },
    { id: "run", label: "Run", unit: "in", type: "number", defaultValue: "12", min: 1 },
  ],
  calculate: (inputs) => {
    const rise = parseFloat(inputs.rise) || 0;
    const run = parseFloat(inputs.run) || 12;
    const angle = Math.atan(rise / run) * (180 / Math.PI);
    const multiplier = Math.sqrt(rise * rise + run * run) / run;
    return [
      { label: "Pitch", value: 0, unit: `${rise}:${run}`, highlight: true },
      { label: "Angle", value: Math.round(angle * 10) / 10, unit: "°" },
      { label: "Area Multiplier", value: Math.round(multiplier * 1000) / 1000, unit: "×" },
    ];
  },
};

const roofingArea: Calculator = {
  id: "roofing-area",
  name: "Roof Area",
  description: "Actual roof area from footprint and pitch",
  inputs: [
    { id: "footprint", label: "Footprint Area", unit: "ft²", type: "number", defaultValue: "1500", min: 0 },
    { id: "rise", label: "Rise (per 12\" run)", unit: "in", type: "number", defaultValue: "6", min: 0 },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const footprint = parseFloat(inputs.footprint) || 0;
    const rise = parseFloat(inputs.rise) || 0;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const multiplier = Math.sqrt(rise * rise + 144) / 12;
    const roofArea = footprint * multiplier;
    const withWaste = roofArea * waste;
    const squares = Math.ceil(withWaste / 100);
    return [
      { label: "Roof Area", value: Math.round(roofArea), unit: "ft²", highlight: true },
      { label: "With Waste", value: Math.round(withWaste), unit: "ft²" },
      { label: "Squares", value: squares, unit: "squares" },
      { label: "Pitch Multiplier", value: Math.round(multiplier * 1000) / 1000, unit: "×" },
    ];
  },
};

const shingleCount: Calculator = {
  id: "shingle-count",
  name: "Shingles",
  description: "Bundles and squares of shingles needed",
  inputs: [
    { id: "area", label: "Roof Area", unit: "ft²", type: "number", defaultValue: "1800", min: 0 },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
    { id: "hip", label: "Hip / Ridge (linear)", unit: "ft", type: "number", defaultValue: "40", min: 0 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const hip = parseFloat(inputs.hip) || 0;
    const totalArea = area * waste;
    const squares = Math.ceil(totalArea / 100);
    const bundles = Math.ceil(squares * 3);
    const ridgeBundles = Math.ceil(hip / 35);
    return [
      { label: "Squares", value: squares, unit: "sq", highlight: true },
      { label: "Bundles (3-tab)", value: bundles, unit: "bundles" },
      { label: "Ridge Cap Bundles", value: ridgeBundles, unit: "bundles" },
      { label: "Total Area", value: Math.round(totalArea), unit: "ft²" },
    ];
  },
};

// ─── MASONRY ──────────────────────────────────────────────────────────────────

const brickCount: Calculator = {
  id: "brick-count",
  name: "Brick Count",
  description: "Bricks and mortar for a wall",
  inputs: [
    { id: "length", label: "Wall Length", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    { id: "height", label: "Wall Height", unit: "ft", type: "number", defaultValue: "8", min: 0 },
    {
      id: "size", label: "Brick Size", unit: "", type: "select",
      options: [
        { label: "Standard (7 per ft²)", value: "7" },
        { label: "Queen (6.5 per ft²)", value: "6.5" },
        { label: "King (5.1 per ft²)", value: "5.1" },
        { label: "Modular (6.75 per ft²)", value: "6.75" },
      ],
      defaultValue: "7",
    },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "5", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const h = parseFloat(inputs.height) || 0;
    const bricksPerSqFt = parseFloat(inputs.size) || 7;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const area = l * h;
    const bricks = Math.ceil(area * bricksPerSqFt * waste);
    const mortarBags = Math.ceil(bricks / 45);
    return [
      { label: "Brick Count", value: bricks, unit: "bricks", highlight: true },
      { label: "Wall Area", value: Math.round(area), unit: "ft²" },
      { label: "Mortar Bags (60lb)", value: mortarBags, unit: "bags" },
    ];
  },
};

const groutVolume: Calculator = {
  id: "grout-volume",
  name: "Grout Volume",
  description: "Grout needed for tile joints",
  inputs: [
    { id: "area", label: "Tile Area", unit: "ft²", type: "number", defaultValue: "100", min: 0 },
    { id: "tileW", label: "Tile Width", unit: "in", type: "number", defaultValue: "12", min: 0 },
    { id: "tileH", label: "Tile Height", unit: "in", type: "number", defaultValue: "12", min: 0 },
    { id: "joint", label: "Joint Width", unit: "in", type: "number", defaultValue: "0.125", min: 0, step: 0.0625 },
    { id: "depth", label: "Joint Depth", unit: "in", type: "number", defaultValue: "0.375", min: 0, step: 0.0625 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const tw = parseFloat(inputs.tileW) || 12;
    const th = parseFloat(inputs.tileH) || 12;
    const jw = parseFloat(inputs.joint) || 0.125;
    const jd = parseFloat(inputs.depth) || 0.375;
    const lftPerSqFt = (12 / tw) * (12 / th) * (tw + th);
    const cubicInPerSqFt = lftPerSqFt * jw * jd;
    const totalCubicIn = area * cubicInPerSqFt;
    const groutLbs = (totalCubicIn / 231) * 100;
    const bags = Math.ceil(groutLbs / 25);
    return [
      { label: "25 lb Grout Bags", value: bags, unit: "bags", highlight: true },
      { label: "Grout Weight", value: Math.round(groutLbs), unit: "lbs" },
      { label: "Coverage Area", value: Math.round(area), unit: "ft²" },
    ];
  },
};

const mortarMix: Calculator = {
  id: "mortar-mix",
  name: "Mortar Mix",
  description: "Cement, sand and water for mortar",
  inputs: [
    { id: "volume", label: "Mortar Volume Needed", unit: "ft³", type: "number", defaultValue: "5", min: 0 },
    {
      id: "ratio", label: "Mix Ratio (cement:sand)", unit: "", type: "select",
      options: [
        { label: "Type S (1:4)", value: "4" },
        { label: "Type N (1:5)", value: "5" },
        { label: "Type M (1:3)", value: "3" },
      ],
      defaultValue: "4",
    },
  ],
  calculate: (inputs) => {
    const volume = parseFloat(inputs.volume) || 0;
    const ratio = parseFloat(inputs.ratio) || 4;
    const cementParts = 1;
    const sandParts = ratio;
    const totalParts = cementParts + sandParts + 0.5;
    const cementCuFt = (volume * cementParts) / totalParts;
    const sandCuFt = (volume * sandParts) / totalParts;
    const cementBags = Math.ceil(cementCuFt / 0.45);
    const sandLbs = Math.round(sandCuFt * 100);
    return [
      { label: "Cement Bags (94lb)", value: cementBags, unit: "bags", highlight: true },
      { label: "Sand", value: sandLbs, unit: "lbs" },
      { label: "Cement Volume", value: Math.round(cementCuFt * 100) / 100, unit: "ft³" },
    ];
  },
};

// ─── PAINTING ─────────────────────────────────────────────────────────────────

const paintCoverage: Calculator = {
  id: "paint-coverage",
  name: "Paint Coverage",
  description: "Gallons needed for a room",
  inputs: [
    { id: "length", label: "Room Length", unit: "ft", type: "number", defaultValue: "15", min: 0 },
    { id: "width", label: "Room Width", unit: "ft", type: "number", defaultValue: "12", min: 0 },
    { id: "height", label: "Ceiling Height", unit: "ft", type: "number", defaultValue: "9", min: 0 },
    { id: "doors", label: "Doors", unit: "ea", type: "number", defaultValue: "1", min: 0 },
    { id: "windows", label: "Windows", unit: "ea", type: "number", defaultValue: "2", min: 0 },
    { id: "coats", label: "Coats", unit: "coats", type: "number", defaultValue: "2", min: 1 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const w = parseFloat(inputs.width) || 0;
    const h = parseFloat(inputs.height) || 0;
    const doors = parseFloat(inputs.doors) || 0;
    const windows = parseFloat(inputs.windows) || 0;
    const coats = parseFloat(inputs.coats) || 2;
    const wallArea = 2 * (l + w) * h;
    const openings = (doors * 21) + (windows * 15);
    const netArea = wallArea - openings;
    const gallons = Math.ceil((netArea * coats) / 400 * 10) / 10;
    return [
      { label: "Gallons (walls)", value: gallons, unit: "gal", highlight: true },
      { label: "Net Wall Area", value: Math.round(netArea), unit: "ft²" },
      { label: "Ceiling Gallons", value: Math.ceil((l * w * coats) / 400 * 10) / 10, unit: "gal" },
    ];
  },
};

const wallArea: Calculator = {
  id: "wall-area",
  name: "Wall Area",
  description: "Net paintable wall area minus openings",
  inputs: [
    { id: "perimeter", label: "Perimeter", unit: "ft", type: "number", defaultValue: "54", min: 0 },
    { id: "height", label: "Wall Height", unit: "ft", type: "number", defaultValue: "9", min: 0 },
    { id: "doors", label: "Doors", unit: "ea", type: "number", defaultValue: "1", min: 0 },
    { id: "windows", label: "Windows", unit: "ea", type: "number", defaultValue: "2", min: 0 },
  ],
  calculate: (inputs) => {
    const p = parseFloat(inputs.perimeter) || 0;
    const h = parseFloat(inputs.height) || 0;
    const doors = parseFloat(inputs.doors) || 0;
    const windows = parseFloat(inputs.windows) || 0;
    const gross = p * h;
    const deductions = (doors * 21) + (windows * 15);
    const net = gross - deductions;
    return [
      { label: "Net Wall Area", value: Math.round(net), unit: "ft²", highlight: true },
      { label: "Gross Area", value: Math.round(gross), unit: "ft²" },
      { label: "Deductions", value: Math.round(deductions), unit: "ft²" },
    ];
  },
};

// ─── FLOORING ─────────────────────────────────────────────────────────────────

const tileLayout: Calculator = {
  id: "tile-layout",
  name: "Tile Layout",
  description: "Tile count and boxes for a floor or wall",
  inputs: [
    { id: "area", label: "Room Area", unit: "ft²", type: "number", defaultValue: "200", min: 0 },
    { id: "tileW", label: "Tile Width", unit: "in", type: "number", defaultValue: "12", min: 0 },
    { id: "tileH", label: "Tile Height", unit: "in", type: "number", defaultValue: "12", min: 0 },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
    { id: "perBox", label: "Tiles Per Box", unit: "tiles", type: "number", defaultValue: "10", min: 1 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const tw = parseFloat(inputs.tileW) || 12;
    const th = parseFloat(inputs.tileH) || 12;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const perBox = parseFloat(inputs.perBox) || 10;
    const tileArea = (tw * th) / 144;
    const tiles = Math.ceil((area / tileArea) * waste);
    const boxes = Math.ceil(tiles / perBox);
    return [
      { label: "Tiles Needed", value: tiles, unit: "tiles", highlight: true },
      { label: "Boxes", value: boxes, unit: "boxes" },
      { label: "Area with Waste", value: Math.round(area * waste), unit: "ft²" },
      { label: "Tile Area", value: Math.round(tileArea * 100) / 100, unit: "ft²/tile" },
    ];
  },
};

const hardwoodFlooring: Calculator = {
  id: "hardwood-flooring",
  name: "Hardwood / LVP",
  description: "Square footage and boxes of hardwood or LVP",
  inputs: [
    { id: "area", label: "Room Area", unit: "ft²", type: "number", defaultValue: "300", min: 0 },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
    { id: "boxSqFt", label: "Coverage Per Box", unit: "ft²", type: "number", defaultValue: "20", min: 1 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const boxSqFt = parseFloat(inputs.boxSqFt) || 20;
    const totalArea = area * waste;
    const boxes = Math.ceil(totalArea / boxSqFt);
    return [
      { label: "Boxes Needed", value: boxes, unit: "boxes", highlight: true },
      { label: "Total ft² to Order", value: Math.round(totalArea), unit: "ft²" },
      { label: "Room Area", value: Math.round(area), unit: "ft²" },
    ];
  },
};

const carpetYards: Calculator = {
  id: "carpet-yards",
  name: "Carpet",
  description: "Square yards of carpet for a room",
  inputs: [
    { id: "length", label: "Room Length", unit: "ft", type: "number", defaultValue: "15", min: 0 },
    { id: "width", label: "Room Width", unit: "ft", type: "number", defaultValue: "12", min: 0 },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const w = parseFloat(inputs.width) || 0;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const sqFt = l * w * waste;
    const sqYards = sqFt / 9;
    return [
      { label: "Square Yards", value: Math.ceil(sqYards * 10) / 10, unit: "yd²", highlight: true },
      { label: "Square Feet (w/ waste)", value: Math.round(sqFt), unit: "ft²" },
    ];
  },
};

// ─── EXCAVATION ───────────────────────────────────────────────────────────────

const cutFill: Calculator = {
  id: "cut-fill",
  name: "Cut & Fill Volume",
  description: "Cubic yards of earth to remove or fill",
  inputs: [
    { id: "length", label: "Length", unit: "ft", type: "number", defaultValue: "50", min: 0 },
    { id: "width", label: "Width", unit: "ft", type: "number", defaultValue: "30", min: 0 },
    { id: "depth", label: "Depth / Height", unit: "ft", type: "number", defaultValue: "2", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const w = parseFloat(inputs.width) || 0;
    const d = parseFloat(inputs.depth) || 0;
    const cubicFt = l * w * d;
    const cubicYards = cubicFt / 27;
    return [
      { label: "Cubic Yards", value: Math.round(cubicYards * 100) / 100, unit: "yd³", highlight: true },
      { label: "Cubic Feet", value: Math.round(cubicFt), unit: "ft³" },
      { label: "Tons (loose soil ~1.35)", value: Math.round(cubicYards * 1.35 * 10) / 10, unit: "tons" },
    ];
  },
};

const swellFactor: Calculator = {
  id: "swell-factor",
  name: "Swell / Shrink Factor",
  description: "Convert bank, loose, and compacted volumes",
  inputs: [
    { id: "volume", label: "Bank Cubic Yards", unit: "BCY", type: "number", defaultValue: "100", min: 0 },
    {
      id: "material", label: "Material", unit: "", type: "select",
      options: [
        { label: "Common Earth (+25% swell)", value: "1.25" },
        { label: "Clay (+40% swell)", value: "1.40" },
        { label: "Sand (+12% swell)", value: "1.12" },
        { label: "Gravel (+12% swell)", value: "1.12" },
        { label: "Rock (+50% swell)", value: "1.50" },
      ],
      defaultValue: "1.25",
    },
    { id: "compaction", label: "Compaction Factor", unit: "", type: "number", defaultValue: "0.85", min: 0, step: 0.01 },
  ],
  calculate: (inputs) => {
    const bcy = parseFloat(inputs.volume) || 0;
    const swell = parseFloat(inputs.material) || 1.25;
    const comp = parseFloat(inputs.compaction) || 0.85;
    const lcy = bcy * swell;
    const ccy = bcy * comp;
    return [
      { label: "Loose CY (LCY)", value: Math.round(lcy * 10) / 10, unit: "LCY", highlight: true },
      { label: "Bank CY (BCY)", value: Math.round(bcy * 10) / 10, unit: "BCY" },
      { label: "Compacted CY (CCY)", value: Math.round(ccy * 10) / 10, unit: "CCY" },
    ];
  },
};

const haulLoads: Calculator = {
  id: "haul-loads",
  name: "Haul Truck Loads",
  description: "Number of truck trips for earthwork",
  inputs: [
    { id: "totalCY", label: "Total Cubic Yards", unit: "yd³", type: "number", defaultValue: "200", min: 0 },
    {
      id: "truckSize", label: "Truck Capacity", unit: "", type: "select",
      options: [
        { label: "Small Dump (8 CY)", value: "8" },
        { label: "Standard Dump (10 CY)", value: "10" },
        { label: "Tandem (14 CY)", value: "14" },
        { label: "Super Dump (20 CY)", value: "20" },
        { label: "Semi-End Dump (25 CY)", value: "25" },
      ],
      defaultValue: "10",
    },
  ],
  calculate: (inputs) => {
    const total = parseFloat(inputs.totalCY) || 0;
    const cap = parseFloat(inputs.truckSize) || 10;
    const loads = Math.ceil(total / cap);
    return [
      { label: "Truck Loads", value: loads, unit: "loads", highlight: true },
      { label: "Truck Capacity", value: cap, unit: "yd³" },
      { label: "Total Volume", value: Math.round(total), unit: "yd³" },
    ];
  },
};

const trenchVolume: Calculator = {
  id: "trench-volume",
  name: "Trench Volume",
  description: "Volume of a trench for pipe or utilities",
  inputs: [
    { id: "length", label: "Trench Length", unit: "ft", type: "number", defaultValue: "100", min: 0 },
    { id: "width", label: "Trench Width", unit: "in", type: "number", defaultValue: "24", min: 0 },
    { id: "depth", label: "Trench Depth", unit: "ft", type: "number", defaultValue: "4", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const w = (parseFloat(inputs.width) || 0) / 12;
    const d = parseFloat(inputs.depth) || 0;
    const cubicFt = l * w * d;
    const cubicYards = cubicFt / 27;
    const tons = cubicYards * 1.35;
    return [
      { label: "Cubic Yards", value: Math.round(cubicYards * 100) / 100, unit: "yd³", highlight: true },
      { label: "Cubic Feet", value: Math.round(cubicFt), unit: "ft³" },
      { label: "Approx Tons", value: Math.round(tons * 10) / 10, unit: "tons" },
    ];
  },
};

// ─── TRADES ───────────────────────────────────────────────────────────────────

export const trades: Trade[] = [
  {
    id: "concrete",
    name: "Concrete",
    color: "#6B7280",
    icon: "layers",
    calculators: [concreteSlab, concreteFooting, rebarQuantity, cmuCount],
  },
  {
    id: "framing",
    name: "Framing",
    color: "#92400E",
    icon: "box",
    calculators: [studCount, boardFeet, sheathingSheets, joistCount],
  },
  {
    id: "electrical",
    name: "Electrical",
    color: "#D97706",
    icon: "zap",
    calculators: [circuitLoad, voltageDrop, wireGauge, conduitFill],
  },
  {
    id: "plumbing",
    name: "Plumbing",
    color: "#1D4ED8",
    icon: "droplet",
    calculators: [drainSlope, pipeSizing, fixtureUnits, pressureLoss],
  },
  {
    id: "hvac",
    name: "HVAC",
    color: "#065F46",
    icon: "wind",
    calculators: [btuLoad, ductSizing, cfmPerRoom],
  },
  {
    id: "roofing",
    name: "Roofing",
    color: "#991B1B",
    icon: "home",
    calculators: [roofPitch, roofingArea, shingleCount],
  },
  {
    id: "masonry",
    name: "Masonry",
    color: "#78350F",
    icon: "grid",
    calculators: [brickCount, cmuCount, groutVolume, mortarMix],
  },
  {
    id: "painting",
    name: "Painting",
    color: "#5B21B6",
    icon: "edit-3",
    calculators: [paintCoverage, wallArea],
  },
  {
    id: "flooring",
    name: "Flooring",
    color: "#B45309",
    icon: "square",
    calculators: [tileLayout, hardwoodFlooring, carpetYards],
  },
  {
    id: "excavation",
    name: "Excavation",
    color: "#713F12",
    icon: "truck",
    calculators: [cutFill, swellFactor, haulLoads, trenchVolume],
  },
];

export function getTradeById(id: string): Trade | undefined {
  return trades.find((t) => t.id === id);
}

export function getCalculatorById(tradeId: string, calcId: string): Calculator | undefined {
  const trade = getTradeById(tradeId);
  return trade?.calculators.find((c) => c.id === calcId);
}
