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

// ─── ELECTRICAL (EXPANDED) ───────────────────────────────────────────────────

const motorAmpacity: Calculator = {
  id: "motor-ampacity",
  name: "Motor Ampacity (NEC 430)",
  description: "Full-load amps, wire size, and breaker for motors",
  inputs: [
    { id: "hp", label: "Motor HP", unit: "HP", type: "number", defaultValue: "5", min: 0 },
    {
      id: "phase", label: "Phase", unit: "", type: "select",
      options: [
        { label: "Single Phase (1Ø)", value: "single" },
        { label: "Three Phase (3Ø)", value: "three" },
      ],
      defaultValue: "three",
    },
    {
      id: "voltage", label: "Voltage", unit: "", type: "select",
      options: [
        { label: "115V (1Ø)", value: "115" },
        { label: "208V", value: "208" },
        { label: "230V", value: "230" },
        { label: "460V (3Ø)", value: "460" },
        { label: "480V (3Ø)", value: "480" },
        { label: "575V (3Ø)", value: "575" },
      ],
      defaultValue: "460",
    },
  ],
  calculate: (inputs) => {
    const hp = parseFloat(inputs.hp) || 0;
    const isThree = inputs.phase === "three";
    const v = parseFloat(inputs.voltage) || 460;
    // NEC Table 430.248 (1Ø) and 430.250 (3Ø) — approximate FLA per HP at voltage
    const efficiency = 0.85;
    const pf = 0.85;
    let fla: number;
    if (isThree) {
      fla = (hp * 746) / (Math.sqrt(3) * v * efficiency * pf);
    } else {
      fla = (hp * 746) / (v * efficiency * pf);
    }
    // NEC 430.22: branch circuit conductor = 125% of FLA
    const conductorAmps = fla * 1.25;
    // NEC 430.52: inverse-time breaker = 250% of FLA (max)
    const breakerAmps = fla * 2.5;
    // Wire size (simplified copper THHN)
    let wireGauge = "4/0 AWG";
    if (conductorAmps <= 15) wireGauge = "14 AWG";
    else if (conductorAmps <= 20) wireGauge = "12 AWG";
    else if (conductorAmps <= 30) wireGauge = "10 AWG";
    else if (conductorAmps <= 40) wireGauge = "8 AWG";
    else if (conductorAmps <= 55) wireGauge = "6 AWG";
    else if (conductorAmps <= 70) wireGauge = "4 AWG";
    else if (conductorAmps <= 95) wireGauge = "3 AWG";
    else if (conductorAmps <= 110) wireGauge = "2 AWG";
    else if (conductorAmps <= 130) wireGauge = "1 AWG";
    else if (conductorAmps <= 150) wireGauge = "1/0 AWG";
    else if (conductorAmps <= 175) wireGauge = "2/0 AWG";
    else if (conductorAmps <= 200) wireGauge = "3/0 AWG";
    // Standard breaker sizes
    let breaker = 15;
    const bSizes = [15,20,25,30,35,40,45,50,60,70,80,90,100,110,125,150,175,200,225,250,300,350,400];
    for (const b of bSizes) { if (b >= breakerAmps) { breaker = b; break; } else { breaker = b; } }
    return [
      { label: "Full-Load Amps (FLA)", value: Math.round(fla * 100) / 100, unit: "A", highlight: true },
      { label: "Min Conductor (125%)", value: Math.round(conductorAmps * 10) / 10, unit: "A" },
      { label: "Conductor Size (Cu)", value: 0, unit: wireGauge },
      { label: "Max Breaker (250%)", value: breaker, unit: "A" },
    ];
  },
};

const threePhasePower: Calculator = {
  id: "three-phase-power",
  name: "3-Phase Power",
  description: "Convert between kW, kVA, and amps for 3-phase systems",
  inputs: [
    {
      id: "known", label: "Known Value", unit: "", type: "select",
      options: [
        { label: "Amps → kW & kVA", value: "amps" },
        { label: "kW → Amps & kVA", value: "kw" },
        { label: "kVA → Amps & kW", value: "kva" },
      ],
      defaultValue: "amps",
    },
    { id: "value", label: "Value", unit: "A / kW / kVA", type: "number", defaultValue: "100", min: 0 },
    {
      id: "voltage", label: "Line Voltage", unit: "", type: "select",
      options: [
        { label: "208V", value: "208" },
        { label: "240V", value: "240" },
        { label: "277/480V", value: "480" },
        { label: "600V", value: "600" },
      ],
      defaultValue: "480",
    },
    { id: "pf", label: "Power Factor", unit: "", type: "number", defaultValue: "0.85", min: 0.1, step: 0.05 },
  ],
  calculate: (inputs) => {
    const v = parseFloat(inputs.voltage) || 480;
    const pf = parseFloat(inputs.pf) || 0.85;
    const val = parseFloat(inputs.value) || 0;
    const sqr3 = Math.sqrt(3);
    let amps = 0, kw = 0, kva = 0;
    if (inputs.known === "amps") {
      amps = val;
      kva = (sqr3 * v * amps) / 1000;
      kw = kva * pf;
    } else if (inputs.known === "kw") {
      kw = val;
      kva = kw / pf;
      amps = (kva * 1000) / (sqr3 * v);
    } else {
      kva = val;
      kw = kva * pf;
      amps = (kva * 1000) / (sqr3 * v);
    }
    return [
      { label: "Amps (A)", value: Math.round(amps * 100) / 100, unit: "A", highlight: true },
      { label: "Apparent Power (kVA)", value: Math.round(kva * 100) / 100, unit: "kVA" },
      { label: "Real Power (kW)", value: Math.round(kw * 100) / 100, unit: "kW" },
      { label: "Watts", value: Math.round(kw * 1000), unit: "W" },
    ];
  },
};

const boxFill: Calculator = {
  id: "box-fill",
  name: "Box Fill (NEC 314.16)",
  description: "Minimum box volume from conductor and device count",
  inputs: [
    {
      id: "awg", label: "Largest Wire Gauge", unit: "", type: "select",
      options: [
        { label: "14 AWG (2.00 in³ each)", value: "2.00" },
        { label: "12 AWG (2.25 in³ each)", value: "2.25" },
        { label: "10 AWG (2.50 in³ each)", value: "2.50" },
        { label: "8 AWG (3.00 in³ each)", value: "3.00" },
        { label: "6 AWG (5.00 in³ each)", value: "5.00" },
      ],
      defaultValue: "2.25",
    },
    { id: "conductors", label: "Conductors (each wire counts 1)", unit: "ea", type: "number", defaultValue: "4", min: 0 },
    { id: "devices", label: "Devices / Switches / Outlets", unit: "ea", type: "number", defaultValue: "1", min: 0 },
    { id: "clamps", label: "Internal Cable Clamps", unit: "ea", type: "number", defaultValue: "1", min: 0 },
    { id: "grounds", label: "Ground Wires (all count as 1)", unit: "ea", type: "number", defaultValue: "2", min: 0 },
  ],
  calculate: (inputs) => {
    const vol = parseFloat(inputs.awg) || 2.25;
    const cond = parseFloat(inputs.conductors) || 0;
    const devices = parseFloat(inputs.devices) || 0;
    const clamps = parseFloat(inputs.clamps) || 0;
    const grounds = parseFloat(inputs.grounds) || 0;
    const hasGrounds = grounds > 0 ? 1 : 0;
    const hasClamps = clamps > 0 ? 1 : 0;
    const total = (cond + (devices * 2) + hasClamps + hasGrounds) * vol;
    return [
      { label: "Min Box Volume", value: Math.round(total * 100) / 100, unit: "in³", highlight: true },
      { label: "Volume Per Wire", value: vol, unit: "in³" },
      { label: "Conductor Count", value: cond, unit: "conductors" },
      { label: "Device Allowance", value: devices * 2, unit: "equiv. conductors" },
    ];
  },
};

const serviceLoad: Calculator = {
  id: "service-load",
  name: "Dwelling Service Load (NEC 220)",
  description: "Minimum service ampacity for a residential unit",
  inputs: [
    { id: "sqft", label: "Living Area", unit: "ft²", type: "number", defaultValue: "2000", min: 0 },
    { id: "smallAppliance", label: "Small Appliance Circuits", unit: "ea", type: "number", defaultValue: "2", min: 2 },
    { id: "laundry", label: "Laundry Circuits", unit: "ea", type: "number", defaultValue: "1", min: 0 },
    { id: "range", label: "Electric Range", unit: "kW", type: "number", defaultValue: "12", min: 0 },
    { id: "dryer", label: "Electric Dryer", unit: "kW", type: "number", defaultValue: "5", min: 0 },
    { id: "hvac", label: "A/C / Heat (largest)", unit: "kW", type: "number", defaultValue: "5", min: 0 },
    { id: "waterHeater", label: "Water Heater", unit: "kW", type: "number", defaultValue: "4.5", min: 0 },
    {
      id: "voltage", label: "Service Voltage", unit: "", type: "select",
      options: [
        { label: "120/240V Single Phase", value: "240" },
        { label: "208Y/120V Three Phase", value: "208" },
      ],
      defaultValue: "240",
    },
  ],
  calculate: (inputs) => {
    const sqft = parseFloat(inputs.sqft) || 0;
    const sa = parseFloat(inputs.smallAppliance) || 2;
    const laundry = parseFloat(inputs.laundry) || 1;
    const range = (parseFloat(inputs.range) || 0) * 1000;
    const dryer = (parseFloat(inputs.dryer) || 0) * 1000;
    const hvac = (parseFloat(inputs.hvac) || 0) * 1000;
    const wh = (parseFloat(inputs.waterHeater) || 0) * 1000;
    const v = parseFloat(inputs.voltage) || 240;
    // General lighting: 3 VA/sqft
    const lighting = sqft * 3;
    // Small appliance: 1500 VA each
    const saLoad = sa * 1500;
    // Laundry: 1500 VA each
    const laundryLoad = laundry * 1500;
    const totalGeneral = lighting + saLoad + laundryLoad;
    // Apply demand factor: first 3000 VA at 100%, remainder at 35%
    const demandGeneral = totalGeneral <= 3000 ? totalGeneral : 3000 + (totalGeneral - 3000) * 0.35;
    // Range demand (NEC 220.55 — simplified): use 80% for single range
    const rangeDemand = range * 0.8;
    // Dryer: 5000W or nameplate, whichever is larger
    const dryerDemand = Math.max(dryer, 5000);
    const fixedAppliances = wh;
    const totalVA = demandGeneral + rangeDemand + dryerDemand + fixedAppliances + hvac;
    const amps = totalVA / v;
    let serviceSize = 100;
    for (const s of [100, 150, 200, 225, 320, 400]) {
      if (s >= amps) { serviceSize = s; break; } else { serviceSize = s; }
    }
    return [
      { label: "Calculated Load", value: Math.round(amps), unit: "A", highlight: true },
      { label: "Recommended Service", value: serviceSize, unit: "A" },
      { label: "Total VA Demand", value: Math.round(totalVA), unit: "VA" },
      { label: "General Load (demand)", value: Math.round(demandGeneral), unit: "VA" },
    ];
  },
};

const generatorSizing: Calculator = {
  id: "generator-sizing",
  name: "Generator Sizing",
  description: "kW generator needed for your loads",
  inputs: [
    { id: "lights", label: "Lighting Load", unit: "W", type: "number", defaultValue: "2000", min: 0 },
    { id: "hvac", label: "A/C or Heat Pump", unit: "W", type: "number", defaultValue: "5000", min: 0 },
    { id: "motorStart", label: "Largest Motor Start (HP)", unit: "HP", type: "number", defaultValue: "5", min: 0 },
    { id: "outlets", label: "Receptacle / Misc Loads", unit: "W", type: "number", defaultValue: "3000", min: 0 },
    { id: "wellPump", label: "Well / Water Pump", unit: "W", type: "number", defaultValue: "0", min: 0 },
    { id: "safetyFactor", label: "Safety Factor", unit: "%", type: "number", defaultValue: "25", min: 0 },
  ],
  calculate: (inputs) => {
    const lights = parseFloat(inputs.lights) || 0;
    const hvac = parseFloat(inputs.hvac) || 0;
    const motorHp = parseFloat(inputs.motorStart) || 0;
    const outlets = parseFloat(inputs.outlets) || 0;
    const well = parseFloat(inputs.wellPump) || 0;
    const safety = 1 + (parseFloat(inputs.safetyFactor) || 25) / 100;
    // Motor starting surge: ~3× running watts
    const motorStartW = motorHp * 746 * 3;
    const runningW = lights + hvac + (motorHp * 746) + outlets + well;
    const startingW = lights + motorStartW + (hvac * 0.5) + outlets + well;
    const requiredKw = (Math.max(runningW, startingW) * safety) / 1000;
    let genSize = 5;
    for (const s of [3.5, 5, 7, 10, 12, 15, 17.5, 20, 22, 25, 30, 35, 40, 45, 50, 60, 75, 100]) {
      if (s >= requiredKw) { genSize = s; break; } else { genSize = s; }
    }
    return [
      { label: "Recommended Generator", value: genSize, unit: "kW", highlight: true },
      { label: "Running Load", value: Math.round(runningW / 100) / 10, unit: "kW" },
      { label: "Starting Load (surge)", value: Math.round(startingW / 100) / 10, unit: "kW" },
      { label: "With Safety Factor", value: Math.round(requiredKw * 10) / 10, unit: "kW" },
    ];
  },
};

const transformerKva: Calculator = {
  id: "transformer-kva",
  name: "Transformer KVA",
  description: "Select transformer KVA from load and voltage",
  inputs: [
    { id: "amps", label: "Full-Load Amps", unit: "A", type: "number", defaultValue: "100", min: 0 },
    {
      id: "voltage", label: "Secondary Voltage", unit: "", type: "select",
      options: [
        { label: "120/240V (1Ø)", value: "240" },
        { label: "120/208V (3Ø)", value: "208" },
        { label: "277/480V (3Ø)", value: "480" },
        { label: "600V (3Ø)", value: "600" },
      ],
      defaultValue: "480",
    },
    {
      id: "phase", label: "Phase", unit: "", type: "select",
      options: [
        { label: "Single Phase (1Ø)", value: "single" },
        { label: "Three Phase (3Ø)", value: "three" },
      ],
      defaultValue: "three",
    },
    { id: "demandFactor", label: "Demand Factor", unit: "%", type: "number", defaultValue: "80", min: 1 },
  ],
  calculate: (inputs) => {
    const amps = parseFloat(inputs.amps) || 0;
    const v = parseFloat(inputs.voltage) || 480;
    const pf = (parseFloat(inputs.demandFactor) || 80) / 100;
    const isThree = inputs.phase === "three";
    const kva = isThree
      ? (Math.sqrt(3) * v * amps) / 1000
      : (v * amps) / 1000;
    const required = kva / pf;
    // Standard KVA sizes
    const kvaStd = [1, 1.5, 2, 3, 5, 7.5, 10, 15, 25, 37.5, 45, 50, 75, 100, 112.5, 150, 167, 200, 225, 300, 333, 500, 750, 1000];
    let selected = kvaStd[kvaStd.length - 1];
    for (const k of kvaStd) { if (k >= required) { selected = k; break; } }
    return [
      { label: "Required KVA", value: Math.round(required * 10) / 10, unit: "kVA", highlight: true },
      { label: "Standard Size", value: selected, unit: "kVA" },
      { label: "Apparent Power", value: Math.round(kva * 10) / 10, unit: "kVA" },
    ];
  },
};

const groundingConductor: Calculator = {
  id: "grounding-conductor",
  name: "Grounding Conductor (NEC 250.66)",
  description: "Service grounding electrode conductor size",
  inputs: [
    {
      id: "serviceAmps", label: "Service Size", unit: "", type: "select",
      options: [
        { label: "Up to 100A (2 AWG Cu / 0 AWG Al)", value: "100" },
        { label: "Over 100A to 200A (4 AWG Cu / 2 AWG Al)", value: "200" },
        { label: "Over 200A to 300A (2 AWG Cu / 0 AWG Al)", value: "300" },
        { label: "Over 300A to 400A (1/0 AWG Cu / 3/0 AWG Al)", value: "400" },
        { label: "Over 400A to 600A (2/0 AWG Cu / 4/0 AWG Al)", value: "600" },
        { label: "Over 600A to 800A (3/0 AWG Cu / 250 kcmil Al)", value: "800" },
        { label: "Over 800A to 1000A (1/2 in² Cu / 350 kcmil Al)", value: "1000" },
        { label: "Over 1000A to 1200A (1/2 in² Cu / 400 kcmil Al)", value: "1200" },
      ],
      defaultValue: "200",
    },
    {
      id: "electrode", label: "Electrode Type", unit: "", type: "select",
      options: [
        { label: "Ground Rod / Plate", value: "rod" },
        { label: "Concrete-Encased (Ufer)", value: "ufer" },
        { label: "Water Pipe / Structural", value: "water" },
      ],
      defaultValue: "rod",
    },
  ],
  calculate: (inputs) => {
    const a = parseInt(inputs.serviceAmps) || 200;
    const electrode = inputs.electrode;
    let cu = "2 AWG", al = "0 AWG";
    if (a <= 100) { cu = "8 AWG"; al = "6 AWG"; }
    else if (a <= 200) { cu = "6 AWG"; al = "4 AWG"; }
    else if (a <= 300) { cu = "4 AWG"; al = "2 AWG"; }
    else if (a <= 400) { cu = "2 AWG"; al = "0 AWG"; }
    else if (a <= 600) { cu = "1/0 AWG"; al = "3/0 AWG"; }
    else if (a <= 800) { cu = "2/0 AWG"; al = "4/0 AWG"; }
    else if (a <= 1000) { cu = "3/0 AWG"; al = "250 kcmil"; }
    else { cu = "3/0 AWG"; al = "350 kcmil"; }
    // Ground rod cap per NEC 250.66(A)
    if (electrode === "rod" && ["1/0 AWG","2/0 AWG","3/0 AWG"].includes(cu)) cu = "6 AWG";
    if (electrode === "ufer" && ["2/0 AWG","3/0 AWG"].includes(cu)) cu = "4 AWG";
    return [
      { label: "GEC — Copper", value: 0, unit: cu, highlight: true },
      { label: "GEC — Aluminum", value: 0, unit: al },
      { label: "Service Size", value: a, unit: "A" },
    ];
  },
};

const demandFactor: Calculator = {
  id: "demand-factor",
  name: "Demand Factor",
  description: "Applied demand load from connected load (NEC 220)",
  inputs: [
    { id: "connectedLoad", label: "Connected Load", unit: "VA", type: "number", defaultValue: "50000", min: 0 },
    {
      id: "loadType", label: "Load Type", unit: "", type: "select",
      options: [
        { label: "Lighting — Dwelling (first 3 kVA)", value: "lighting_res" },
        { label: "Lighting — Commercial / Office", value: "lighting_com" },
        { label: "Receptacles (>10 kVA at 50%)", value: "receptacles" },
        { label: "Fixed Appliances (4+ at 75%)", value: "appliances" },
        { label: "Electric Dryers (5+ units NEC 220.54)", value: "dryers" },
        { label: "Ranges (NEC 220.55 — 3+ units)", value: "ranges" },
      ],
      defaultValue: "lighting_com",
    },
    { id: "count", label: "Number of Units / Circuits", unit: "ea", type: "number", defaultValue: "1", min: 1 },
  ],
  calculate: (inputs) => {
    const load = parseFloat(inputs.connectedLoad) || 0;
    const count = parseFloat(inputs.count) || 1;
    let demandPct = 100;
    let demandVA = load;
    if (inputs.loadType === "lighting_res") {
      // First 3000 VA @ 100%, remainder @ 35%
      demandVA = load <= 3000 ? load : 3000 + (load - 3000) * 0.35;
      demandPct = (demandVA / load) * 100;
    } else if (inputs.loadType === "lighting_com") {
      // Commercial lighting 100%
      demandVA = load; demandPct = 100;
    } else if (inputs.loadType === "receptacles") {
      // First 10 kVA @ 100%, remainder @ 50%
      demandVA = load <= 10000 ? load : 10000 + (load - 10000) * 0.50;
      demandPct = (demandVA / load) * 100;
    } else if (inputs.loadType === "appliances") {
      demandPct = count >= 4 ? 75 : 100;
      demandVA = load * (demandPct / 100);
    } else if (inputs.loadType === "dryers") {
      // NEC 220.54 demand factors
      let pct = 100;
      if (count >= 4 && count <= 5) pct = 85;
      else if (count >= 6 && count <= 7) pct = 75;
      else if (count >= 8 && count <= 9) pct = 70;
      else if (count >= 10 && count <= 12) pct = 65;
      else if (count >= 13 && count <= 15) pct = 60;
      else if (count >= 16 && count <= 19) pct = 55;
      else if (count >= 20 && count <= 24) pct = 50;
      else if (count >= 25 && count <= 29) pct = 45;
      else if (count >= 30) pct = 35;
      demandPct = pct; demandVA = load * (pct / 100);
    } else if (inputs.loadType === "ranges") {
      // NEC 220.55 table simplified for column C
      let demand = load;
      if (count === 1) demand = Math.max(load * 0.8, 8000);
      else if (count === 2) demand = Math.max(load * 0.75, 11000);
      else if (count === 3) demand = Math.max(load * 0.7, 14000);
      else if (count <= 5) demand = Math.max(load * 0.6, count * 3000);
      else if (count <= 8) demand = load * 0.55;
      else demand = load * 0.4;
      demandVA = demand; demandPct = (demand / load) * 100;
    }
    return [
      { label: "Demand Load", value: Math.round(demandVA), unit: "VA", highlight: true },
      { label: "Demand Factor", value: Math.round(demandPct * 10) / 10, unit: "%" },
      { label: "Connected Load", value: Math.round(load), unit: "VA" },
      { label: "Reduction", value: Math.round(load - demandVA), unit: "VA saved" },
    ];
  },
};

const shortCircuitCurrent: Calculator = {
  id: "short-circuit-current",
  name: "Short Circuit / Fault Current",
  description: "Available fault current at end of a conductor run",
  inputs: [
    { id: "isc", label: "Available Fault Current at Source", unit: "A", type: "number", defaultValue: "10000", min: 0 },
    { id: "length", label: "One-Way Conductor Length", unit: "ft", type: "number", defaultValue: "100", min: 0 },
    {
      id: "awg", label: "Conductor Size", unit: "", type: "select",
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
        { label: "250 kcmil", value: "0.041" },
        { label: "350 kcmil", value: "0.030" },
        { label: "500 kcmil", value: "0.021" },
      ],
      defaultValue: "0.156",
    },
    {
      id: "voltage", label: "System Voltage", unit: "", type: "select",
      options: [
        { label: "120V (1Ø)", value: "120" },
        { label: "240V (1Ø)", value: "240" },
        { label: "208V (3Ø)", value: "208" },
        { label: "480V (3Ø)", value: "480" },
      ],
      defaultValue: "480",
    },
  ],
  calculate: (inputs) => {
    const isc = parseFloat(inputs.isc) || 0;
    const length = parseFloat(inputs.length) || 0;
    const ohmsPerKft = parseFloat(inputs.awg) || 0.156;
    const v = parseFloat(inputs.voltage) || 480;
    // Impedance of conductor (2× length for loop)
    const Zc = (ohmsPerKft * length * 2) / 1000;
    // Source impedance
    const Zs = v / (Math.sqrt(3) * isc);
    const totalZ = Zs + Zc;
    const iAvail = v / (Math.sqrt(3) * totalZ);
    return [
      { label: "Available Fault Current", value: Math.round(iAvail), unit: "A", highlight: true },
      { label: "At Source", value: Math.round(isc), unit: "A" },
      { label: "Conductor Impedance", value: Math.round(Zc * 10000) / 10000, unit: "Ω" },
      { label: "Reduction", value: Math.round(((isc - iAvail) / isc) * 100), unit: "%" },
    ];
  },
};

// ─── CONCRETE (EXPANDED) ─────────────────────────────────────────────────────

const circularSlab: Calculator = {
  id: "circular-slab",
  name: "Circular / Round Slab",
  description: "Concrete volume for a round pad or column",
  inputs: [
    { id: "diameter", label: "Diameter", unit: "ft", type: "number", defaultValue: "10", min: 0 },
    { id: "thickness", label: "Thickness", unit: "in", type: "number", defaultValue: "4", min: 0 },
  ],
  calculate: (inputs) => {
    const d = parseFloat(inputs.diameter) || 0;
    const t = (parseFloat(inputs.thickness) || 0) / 12;
    const cubicFt = Math.PI * (d / 2) ** 2 * t;
    const cy = cubicFt / 27;
    const bags80 = Math.ceil(cubicFt / 0.45);
    return [
      { label: "Cubic Yards", value: Math.round(cy * 100) / 100, unit: "yd³", highlight: true },
      { label: "Cubic Feet", value: Math.round(cubicFt * 10) / 10, unit: "ft³" },
      { label: "80 lb Bags", value: bags80, unit: "bags" },
    ];
  },
};

const postHole: Calculator = {
  id: "post-hole",
  name: "Post Hole",
  description: "Concrete for post holes (Sakrete / Quikrete)",
  inputs: [
    { id: "count", label: "Number of Holes", unit: "ea", type: "number", defaultValue: "4", min: 1 },
    { id: "diameter", label: "Hole Diameter", unit: "in", type: "number", defaultValue: "10", min: 0 },
    { id: "depth", label: "Hole Depth", unit: "ft", type: "number", defaultValue: "3.5", min: 0 },
    { id: "postSize", label: "Post Size (square)", unit: "in", type: "number", defaultValue: "4", min: 0 },
  ],
  calculate: (inputs) => {
    const count = parseFloat(inputs.count) || 1;
    const dHole = (parseFloat(inputs.diameter) || 0) / 12;
    const depth = parseFloat(inputs.depth) || 0;
    const post = (parseFloat(inputs.postSize) || 0) / 12;
    const holeVol = Math.PI * (dHole / 2) ** 2 * depth;
    const postVol = post * post * depth;
    const netVol = Math.max(holeVol - postVol, 0);
    const totalCF = netVol * count;
    const totalCY = totalCF / 27;
    const bags80 = Math.ceil(totalCF / 0.45);
    const bags50 = Math.ceil(totalCF / 0.375);
    return [
      { label: "Total Cubic Yards", value: Math.round(totalCY * 1000) / 1000, unit: "yd³", highlight: true },
      { label: "80 lb Bags (total)", value: bags80, unit: "bags" },
      { label: "50 lb Bags (total)", value: bags50, unit: "bags" },
      { label: "Bags Per Hole (80lb)", value: Math.ceil(bags80 / count), unit: "bags" },
    ];
  },
};

const stepConcrete: Calculator = {
  id: "step-concrete",
  name: "Concrete Steps",
  description: "Concrete volume for exterior or interior steps",
  inputs: [
    { id: "steps", label: "Number of Steps", unit: "ea", type: "number", defaultValue: "3", min: 1 },
    { id: "width", label: "Stair Width", unit: "ft", type: "number", defaultValue: "4", min: 0 },
    { id: "rise", label: "Rise (each step)", unit: "in", type: "number", defaultValue: "7", min: 0 },
    { id: "run", label: "Run (tread depth)", unit: "in", type: "number", defaultValue: "11", min: 0 },
  ],
  calculate: (inputs) => {
    const steps = parseFloat(inputs.steps) || 1;
    const w = parseFloat(inputs.width) || 0;
    const rise = (parseFloat(inputs.rise) || 0) / 12;
    const run = (parseFloat(inputs.run) || 0) / 12;
    // Staircase solid volume = triangle × width = (steps × rise × steps × run / 2) × width
    const totalRise = steps * rise;
    const totalRun = steps * run;
    const triangleVol = (totalRise * totalRun / 2) * w;
    const cy = triangleVol / 27;
    const bags80 = Math.ceil(triangleVol / 0.45);
    return [
      { label: "Cubic Yards", value: Math.round(cy * 100) / 100, unit: "yd³", highlight: true },
      { label: "Cubic Feet", value: Math.round(triangleVol * 10) / 10, unit: "ft³" },
      { label: "80 lb Bags", value: bags80, unit: "bags" },
      { label: "Total Rise", value: Math.round(totalRise * 12), unit: "in" },
    ];
  },
};

// ─── FRAMING (EXPANDED) ───────────────────────────────────────────────────────

const rafterLength: Calculator = {
  id: "rafter-length",
  name: "Rafter Length",
  description: "Common rafter length from span and pitch",
  inputs: [
    { id: "span", label: "Building Span (outside to outside)", unit: "ft", type: "number", defaultValue: "28", min: 0 },
    { id: "overhang", label: "Eave Overhang", unit: "in", type: "number", defaultValue: "12", min: 0 },
    { id: "rise", label: "Rise (in per 12\" run)", unit: "in", type: "number", defaultValue: "6", min: 0 },
    { id: "ridgeBoard", label: "Ridge Board Thickness", unit: "in", type: "number", defaultValue: "1.5", min: 0 },
  ],
  calculate: (inputs) => {
    const span = parseFloat(inputs.span) || 0;
    const overhang = (parseFloat(inputs.overhang) || 0) / 12;
    const rise = parseFloat(inputs.rise) || 0;
    const ridge = (parseFloat(inputs.ridgeBoard) || 0) / 12;
    const run = span / 2 - ridge / 2;
    const multiplier = Math.sqrt(rise * rise + 144) / 12;
    const rafterLen = run * multiplier;
    const totalLen = rafterLen + overhang * multiplier;
    return [
      { label: "Rafter Length (to ridge)", value: Math.round(rafterLen * 100) / 100, unit: "ft", highlight: true },
      { label: "Total w/ Overhang", value: Math.round(totalLen * 100) / 100, unit: "ft" },
      { label: "Run", value: Math.round(run * 100) / 100, unit: "ft" },
      { label: "Pitch Multiplier", value: Math.round(multiplier * 1000) / 1000, unit: "×" },
    ];
  },
};

const wallFramingList: Calculator = {
  id: "wall-framing-list",
  name: "Wall Material List",
  description: "Complete lumber list for a framed wall",
  inputs: [
    { id: "length", label: "Wall Length", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    { id: "height", label: "Wall Height (plate to plate)", unit: "ft", type: "number", defaultValue: "9", min: 0 },
    {
      id: "spacing", label: "Stud Spacing", unit: "", type: "select",
      options: [
        { label: "12\" O.C.", value: "12" },
        { label: "16\" O.C.", value: "16" },
        { label: "24\" O.C.", value: "24" },
      ],
      defaultValue: "16",
    },
    { id: "doors", label: "Doors (3/0 × 6/8)", unit: "ea", type: "number", defaultValue: "1", min: 0 },
    { id: "windows", label: "Windows", unit: "ea", type: "number", defaultValue: "1", min: 0 },
  ],
  calculate: (inputs) => {
    const length = parseFloat(inputs.length) || 0;
    const height = parseFloat(inputs.height) || 0;
    const spacing = parseFloat(inputs.spacing) || 16;
    const doors = parseFloat(inputs.doors) || 0;
    const windows = parseFloat(inputs.windows) || 0;
    // Studs
    const fieldStuds = Math.ceil((length * 12) / spacing) + 1;
    const extraStuds = doors * 3 + windows * 4 + 4; // king + jack + trimmers
    const totalStuds = fieldStuds + extraStuds;
    // Plates: 3 plates (2 bottom, 1 double top)
    const plateLF = length * 3;
    const studLF = totalStuds * height;
    return [
      { label: "Total Studs", value: totalStuds, unit: "ea", highlight: true },
      { label: "Plate Linear Feet", value: Math.ceil(plateLF), unit: "LF" },
      { label: "Stud Linear Feet", value: Math.ceil(studLF), unit: "LF" },
      { label: "Field Studs", value: fieldStuds, unit: "ea" },
    ];
  },
};

// ─── PLUMBING (EXPANDED) ─────────────────────────────────────────────────────

const gasPipeSizing: Calculator = {
  id: "gas-pipe-sizing",
  name: "Gas Pipe Sizing",
  description: "Pipe diameter for natural gas or propane supply",
  inputs: [
    { id: "btu", label: "Total BTU/hr Load", unit: "BTU/hr", type: "number", defaultValue: "200000", min: 0 },
    { id: "length", label: "Pipe Length", unit: "ft", type: "number", defaultValue: "50", min: 0 },
    {
      id: "gas", label: "Gas Type", unit: "", type: "select",
      options: [
        { label: "Natural Gas (1000 BTU/ft³)", value: "1000" },
        { label: "Propane LP (2500 BTU/ft³)", value: "2500" },
      ],
      defaultValue: "1000",
    },
    {
      id: "pressure", label: "Supply Pressure", unit: "", type: "select",
      options: [
        { label: "Low Pressure (< 2 PSI)", value: "low" },
        { label: "Medium (2–5 PSI)", value: "med" },
        { label: "High (> 5 PSI)", value: "high" },
      ],
      defaultValue: "low",
    },
  ],
  calculate: (inputs) => {
    const btu = parseFloat(inputs.btu) || 0;
    const length = parseFloat(inputs.length) || 0;
    const heatVal = parseFloat(inputs.gas) || 1000;
    const cfh = btu / heatVal; // cubic feet per hour
    // Simplified pipe capacity table (low pressure NG, CFH at 50 ft run)
    // Based on NFPA 54 Appendix C
    const cfhCapacity: [string, number][] = [
      ["1/2\" CSST / SCH 40", 40],
      ["3/4\" CSST / SCH 40", 90],
      ["1\" SCH 40", 190],
      ["1-1/4\" SCH 40", 370],
      ["1-1/2\" SCH 40", 590],
      ["2\" SCH 40", 1130],
      ["2-1/2\" SCH 40", 1900],
      ["3\" SCH 40", 3600],
    ];
    // Adjust for length: capacity scales roughly as 1/√(length/50)
    const lengthFactor = Math.sqrt(50 / Math.max(length, 1));
    let selectedSize = cfhCapacity[cfhCapacity.length - 1][0];
    for (const [size, cap] of cfhCapacity) {
      if (cap * lengthFactor >= cfh) { selectedSize = size; break; }
    }
    return [
      { label: "Recommended Pipe", value: 0, unit: selectedSize, highlight: true },
      { label: "Flow Rate Required", value: Math.round(cfh * 10) / 10, unit: "CFH" },
      { label: "Total BTU/hr", value: Math.round(btu), unit: "BTU/hr" },
    ];
  },
};

const waterHeaterSizing: Calculator = {
  id: "water-heater-sizing",
  name: "Water Heater Sizing",
  description: "Tank size and BTU for your household demand",
  inputs: [
    { id: "people", label: "Number of People", unit: "people", type: "number", defaultValue: "4", min: 1 },
    { id: "showers", label: "Peak Showers at Once", unit: "showers", type: "number", defaultValue: "2", min: 0 },
    {
      id: "type", label: "Heater Type", unit: "", type: "select",
      options: [
        { label: "Standard Tank (Gas)", value: "gas_tank" },
        { label: "Standard Tank (Electric)", value: "elec_tank" },
        { label: "Tankless / On-Demand", value: "tankless" },
      ],
      defaultValue: "gas_tank",
    },
  ],
  calculate: (inputs) => {
    const people = parseFloat(inputs.people) || 1;
    const showers = parseFloat(inputs.showers) || 1;
    // Peak demand: 20 gal/shower, 15 gal/additional person activity
    const peakGPH = (showers * 20) + ((people - showers) * 5);
    // First Hour Rating needed
    const firstHour = Math.ceil(peakGPH);
    // Tank size recommendation: 20-25 gal per person for gas
    const tankSize = inputs.type === "elec_tank"
      ? Math.ceil(people * 18 / 10) * 10
      : Math.ceil(people * 15 / 10) * 10;
    // Tankless GPM needed: shower ~2 GPM, dish ~1.5 GPM
    const tanklessGpm = showers * 2 + 1.5;
    return [
      { label: inputs.type === "tankless" ? "Required GPM" : "Recommended Tank", value: inputs.type === "tankless" ? Math.ceil(tanklessGpm * 10) / 10 : tankSize, unit: inputs.type === "tankless" ? "GPM" : "gal", highlight: true },
      { label: "First Hour Rating", value: firstHour, unit: "gal" },
      { label: "People", value: people, unit: "occupants" },
    ];
  },
};

// ─── HVAC (EXPANDED) ─────────────────────────────────────────────────────────

const refrigerantLineSizing: Calculator = {
  id: "refrigerant-line-sizing",
  name: "Refrigerant Line Set",
  description: "Suction and liquid line sizes by tonnage",
  inputs: [
    { id: "tons", label: "System Tonnage", unit: "tons", type: "number", defaultValue: "3", min: 0.5, step: 0.5 },
    {
      id: "refrigerant", label: "Refrigerant", unit: "", type: "select",
      options: [
        { label: "R-410A", value: "r410" },
        { label: "R-22 (legacy)", value: "r22" },
        { label: "R-32", value: "r32" },
        { label: "R-454B (Puron Advance)", value: "r454" },
      ],
      defaultValue: "r410",
    },
    { id: "lineLength", label: "Line Set Length", unit: "ft", type: "number", defaultValue: "25", min: 0 },
  ],
  calculate: (inputs) => {
    const tons = parseFloat(inputs.tons) || 3;
    const length = parseFloat(inputs.lineLength) || 25;
    // Typical line sizes for R-410A (AHRI/manufacturer standard)
    let suction = "3/4\"", liquid = "3/8\"";
    if (tons <= 1.5) { suction = "5/8\""; liquid = "3/8\""; }
    else if (tons <= 2.5) { suction = "3/4\""; liquid = "3/8\""; }
    else if (tons <= 3.5) { suction = "7/8\""; liquid = "3/8\""; }
    else if (tons <= 5) { suction = "1-1/8\""; liquid = "1/2\""; }
    else if (tons <= 7.5) { suction = "1-3/8\""; liquid = "1/2\""; }
    else { suction = "1-5/8\""; liquid = "5/8\""; }
    // Long line derating: over 50 ft may need one size up on suction
    const needsUpsize = length > 50 && tons >= 2;
    return [
      { label: "Suction Line OD", value: 0, unit: suction + (needsUpsize ? " (upsize)*" : ""), highlight: true },
      { label: "Liquid Line OD", value: 0, unit: liquid },
      { label: "System Capacity", value: tons * 12000, unit: "BTU/hr" },
      { label: "Long Line Note", value: 0, unit: length > 50 ? "> 50 ft: verify w/ mfr" : "Line length OK" },
    ];
  },
};

const ventilationRate: Calculator = {
  id: "ventilation-rate",
  name: "Ventilation Rate (ASHRAE 62.2)",
  description: "Required fresh air CFM for a dwelling",
  inputs: [
    { id: "sqft", label: "Floor Area", unit: "ft²", type: "number", defaultValue: "2000", min: 0 },
    { id: "bedrooms", label: "Bedrooms", unit: "ea", type: "number", defaultValue: "3", min: 0 },
  ],
  calculate: (inputs) => {
    const sqft = parseFloat(inputs.sqft) || 0;
    const bedrooms = parseFloat(inputs.bedrooms) || 0;
    const occupants = bedrooms + 1;
    // ASHRAE 62.2-2016: Qfan = 0.01 × Afloor + 7.5 × (Nbr + 1)
    const cfm = 0.01 * sqft + 7.5 * occupants;
    const ach = (cfm * 60) / (sqft * 9); // assuming 9 ft ceilings
    return [
      { label: "Required Ventilation", value: Math.ceil(cfm), unit: "CFM", highlight: true },
      { label: "Estimated ACH", value: Math.round(ach * 100) / 100, unit: "ACH" },
      { label: "Design Occupants", value: occupants, unit: "people" },
    ];
  },
};

// ─── ROOFING (EXPANDED) ──────────────────────────────────────────────────────

const underlaymentRolls: Calculator = {
  id: "underlayment-rolls",
  name: "Underlayment / Felt",
  description: "Rolls of roofing felt or synthetic underlayment needed",
  inputs: [
    { id: "area", label: "Roof Area", unit: "ft²", type: "number", defaultValue: "2000", min: 0 },
    { id: "overlap", label: "Row Overlap", unit: "in", type: "number", defaultValue: "4", min: 0 },
    {
      id: "rollType", label: "Product", unit: "", type: "select",
      options: [
        { label: "#15 Felt (4 sq / roll)", value: "400" },
        { label: "#30 Felt (2 sq / roll)", value: "200" },
        { label: "Synthetic (10 sq / roll)", value: "1000" },
        { label: "Ice & Water Shield (1 sq / roll)", value: "100" },
      ],
      defaultValue: "400",
    },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const sqPerRoll = parseFloat(inputs.rollType) || 400;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const overlapFactor = 1 + (parseFloat(inputs.overlap) || 0) / 12 * 0.05;
    const totalArea = area * waste * overlapFactor;
    const rolls = Math.ceil(totalArea / sqPerRoll);
    const squares = Math.ceil(totalArea / 100);
    return [
      { label: "Rolls Needed", value: rolls, unit: "rolls", highlight: true },
      { label: "Squares to Cover", value: squares, unit: "squares" },
      { label: "Total Area (w/ waste)", value: Math.round(totalArea), unit: "ft²" },
    ];
  },
};

const valleyLength: Calculator = {
  id: "valley-length",
  name: "Valley / Hip Length",
  description: "Length of hip or valley rafters",
  inputs: [
    { id: "run", label: "Common Rafter Run", unit: "ft", type: "number", defaultValue: "12", min: 0 },
    { id: "rise", label: "Rise (in per 12\" run)", unit: "in", type: "number", defaultValue: "6", min: 0 },
  ],
  calculate: (inputs) => {
    const run = parseFloat(inputs.run) || 0;
    const rise = parseFloat(inputs.rise) || 0;
    // Hip/valley run = common run × √2
    const hvRun = run * Math.sqrt(2);
    // Unit rise for hip/valley stays the same (rise per 12" common run)
    const hvMultiplier = Math.sqrt(rise * rise + 288) / Math.sqrt(144 + 0); // simplified
    // Actual: hip length = √(run² + run² + totalRise²)
    const totalRise = (run * rise) / 12;
    const hipLength = Math.sqrt(run * run + run * run + totalRise * totalRise);
    const commonLength = Math.sqrt(run * run + totalRise * totalRise);
    return [
      { label: "Hip / Valley Length", value: Math.round(hipLength * 100) / 100, unit: "ft", highlight: true },
      { label: "Common Rafter Length", value: Math.round(commonLength * 100) / 100, unit: "ft" },
      { label: "Total Rise", value: Math.round(totalRise * 12), unit: "in" },
    ];
  },
};

// ─── MASONRY (EXPANDED) ───────────────────────────────────────────────────────

const stoneVeneer: Calculator = {
  id: "stone-veneer",
  name: "Stone Veneer Coverage",
  description: "Coverage for natural or manufactured stone veneer",
  inputs: [
    { id: "area", label: "Wall Area", unit: "ft²", type: "number", defaultValue: "200", min: 0 },
    {
      id: "type", label: "Stone Type", unit: "", type: "select",
      options: [
        { label: "Manufactured Flat (1 ft² / each)", value: "1.0" },
        { label: "Corner Pieces (1 LF covers ~0.75 ft²)", value: "0.75" },
        { label: "Fieldstone / Rubble (1.1 ft²)", value: "1.1" },
        { label: "Ledgestone Panel (varies, ~6 SF/box)", value: "6.0" },
      ],
      defaultValue: "1.0",
    },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
    { id: "corners", label: "Corner Linear Feet", unit: "LF", type: "number", defaultValue: "0", min: 0 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const coverage = parseFloat(inputs.type) || 1.0;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const corners = parseFloat(inputs.corners) || 0;
    const flatArea = area * waste;
    const flatPieces = Math.ceil(flatArea / coverage);
    const cornerPieces = Math.ceil(corners);
    // Scratch coat mortar: ~0.5 bags per 25 sqft
    const mortarBags = Math.ceil(area / 25 * 0.5);
    return [
      { label: "Flat Stone Needed", value: flatPieces, unit: "pieces / ft²", highlight: true },
      { label: "Corner Pieces", value: cornerPieces, unit: "LF" },
      { label: "Scratch Coat Mortar", value: mortarBags, unit: "bags (Type S)" },
      { label: "Total Area", value: Math.round(area), unit: "ft²" },
    ];
  },
};

const tuckpointing: Calculator = {
  id: "tuckpointing",
  name: "Tuckpointing Mortar",
  description: "Mortar needed to repoint an existing brick wall",
  inputs: [
    { id: "area", label: "Wall Area", unit: "ft²", type: "number", defaultValue: "100", min: 0 },
    { id: "joint", label: "Joint Width", unit: "in", type: "number", defaultValue: "0.375", min: 0, step: 0.0625 },
    { id: "depth", label: "Rake-Out Depth", unit: "in", type: "number", defaultValue: "0.75", min: 0 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const jw = parseFloat(inputs.joint) || 0.375;
    const jd = parseFloat(inputs.depth) || 0.75;
    // ~4.5 LF joints per sqft of standard brick
    const jointLF = area * 4.5;
    const cubicIn = jointLF * 12 * jw * jd;
    const cubicFt = cubicIn / 1728;
    // ~0.25 bags per cubic foot of mortar void
    const bags = Math.ceil(cubicFt / 0.25);
    return [
      { label: "Mortar Bags (60lb)", value: bags, unit: "bags", highlight: true },
      { label: "Joint Linear Feet", value: Math.round(jointLF), unit: "LF" },
      { label: "Mortar Volume", value: Math.round(cubicFt * 100) / 100, unit: "ft³" },
    ];
  },
};

// ─── PAINTING (EXPANDED) ─────────────────────────────────────────────────────

const exteriorPaint: Calculator = {
  id: "exterior-paint",
  name: "Exterior Paint",
  description: "Gallons needed for house exterior siding",
  inputs: [
    { id: "perimeter", label: "Building Perimeter", unit: "ft", type: "number", defaultValue: "120", min: 0 },
    { id: "height", label: "Wall Height (eave)", unit: "ft", type: "number", defaultValue: "10", min: 0 },
    { id: "gableArea", label: "Gable Area (total)", unit: "ft²", type: "number", defaultValue: "100", min: 0 },
    { id: "windows", label: "Windows / Doors", unit: "ea", type: "number", defaultValue: "8", min: 0 },
    { id: "coats", label: "Coats", unit: "coats", type: "number", defaultValue: "2", min: 1 },
    {
      id: "surface", label: "Surface Type", unit: "", type: "select",
      options: [
        { label: "Smooth (400 ft²/gal)", value: "400" },
        { label: "Lap / Clapboard (350 ft²/gal)", value: "350" },
        { label: "Rough Wood / T1-11 (200 ft²/gal)", value: "200" },
        { label: "Masonry / Stucco (150 ft²/gal)", value: "150" },
      ],
      defaultValue: "350",
    },
  ],
  calculate: (inputs) => {
    const p = parseFloat(inputs.perimeter) || 0;
    const h = parseFloat(inputs.height) || 0;
    const gable = parseFloat(inputs.gableArea) || 0;
    const openings = (parseFloat(inputs.windows) || 0) * 15;
    const coats = parseFloat(inputs.coats) || 2;
    const sqftPerGal = parseFloat(inputs.surface) || 350;
    const gross = p * h + gable;
    const net = gross - openings;
    const gallons = Math.ceil((net * coats) / sqftPerGal * 10) / 10;
    const trimmGallons = Math.ceil(openings * coats / 400 * 10) / 10;
    return [
      { label: "Body Paint (gal)", value: gallons, unit: "gal", highlight: true },
      { label: "Trim Paint (est.)", value: trimmGallons, unit: "gal" },
      { label: "Net Surface Area", value: Math.round(net), unit: "ft²" },
      { label: "Gross Area", value: Math.round(gross), unit: "ft²" },
    ];
  },
};

// ─── FLOORING (EXPANDED) ─────────────────────────────────────────────────────

const subflooring: Calculator = {
  id: "subflooring",
  name: "Subfloor Sheathing",
  description: "OSB or plywood sheets for a subfloor",
  inputs: [
    { id: "length", label: "Room Length", unit: "ft", type: "number", defaultValue: "24", min: 0 },
    { id: "width", label: "Room Width", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
    {
      id: "thickness", label: "Panel Thickness", unit: "", type: "select",
      options: [
        { label: "19/32\" (5/8\") T&G OSB", value: "0.59" },
        { label: "23/32\" (3/4\") T&G OSB", value: "0.72" },
        { label: "3/4\" Plywood", value: "0.75" },
      ],
      defaultValue: "0.72",
    },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const w = parseFloat(inputs.width) || 0;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const area = l * w;
    const sheets = Math.ceil((area * waste) / 32);
    const nails = Math.ceil(sheets * 80); // approx nails per sheet
    return [
      { label: "4×8 Sheets", value: sheets, unit: "sheets", highlight: true },
      { label: "Floor Area", value: Math.round(area), unit: "ft²" },
      { label: "Area with Waste", value: Math.round(area * waste), unit: "ft²" },
      { label: "Screws / Nails (est.)", value: nails, unit: "ea" },
    ];
  },
};

const floorLeveling: Calculator = {
  id: "floor-leveling",
  name: "Self-Leveling Concrete",
  description: "Bags of self-leveler for floor prep",
  inputs: [
    { id: "area", label: "Floor Area", unit: "ft²", type: "number", defaultValue: "200", min: 0 },
    { id: "depth", label: "Average Depth", unit: "in", type: "number", defaultValue: "0.25", min: 0, step: 0.0625 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const depth = parseFloat(inputs.depth) || 0;
    const cubicFt = area * (depth / 12);
    // 50 lb bag covers ~0.4 cu ft at 1/4" depth
    const bags50 = Math.ceil(cubicFt / 0.4);
    return [
      { label: "50 lb Bags", value: bags50, unit: "bags", highlight: true },
      { label: "Volume", value: Math.round(cubicFt * 100) / 100, unit: "ft³" },
      { label: "Floor Area", value: Math.round(area), unit: "ft²" },
    ];
  },
};

// ─── EXCAVATION (EXPANDED) ───────────────────────────────────────────────────

const gradeSlope: Calculator = {
  id: "grade-slope",
  name: "Grade / Slope",
  description: "Calculate grade percentage, rise, and run",
  inputs: [
    {
      id: "known", label: "Calculate From", unit: "", type: "select",
      options: [
        { label: "Rise & Run → Grade %", value: "rise_run" },
        { label: "Grade % & Run → Rise", value: "grade_run" },
        { label: "Grade % & Rise → Run", value: "grade_rise" },
      ],
      defaultValue: "rise_run",
    },
    { id: "rise", label: "Rise / Drop", unit: "ft", type: "number", defaultValue: "1", min: 0 },
    { id: "run", label: "Horizontal Run", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    { id: "grade", label: "Grade %", unit: "%", type: "number", defaultValue: "5", min: 0 },
  ],
  calculate: (inputs) => {
    const mode = inputs.known;
    const rise = parseFloat(inputs.rise) || 0;
    const run = parseFloat(inputs.run) || 0;
    const gradePct = parseFloat(inputs.grade) || 0;
    if (mode === "rise_run") {
      const pct = run > 0 ? (rise / run) * 100 : 0;
      const angle = Math.atan(rise / run) * (180 / Math.PI);
      return [
        { label: "Grade", value: Math.round(pct * 100) / 100, unit: "%", highlight: true },
        { label: "Angle", value: Math.round(angle * 100) / 100, unit: "°" },
        { label: "Rise", value: rise, unit: "ft" },
        { label: "Run", value: run, unit: "ft" },
      ];
    } else if (mode === "grade_run") {
      const riseCalc = run * (gradePct / 100);
      return [
        { label: "Rise / Drop", value: Math.round(riseCalc * 100) / 100, unit: "ft", highlight: true },
        { label: "Rise in Inches", value: Math.round(riseCalc * 12 * 10) / 10, unit: "in" },
        { label: "Grade", value: gradePct, unit: "%" },
        { label: "Run", value: run, unit: "ft" },
      ];
    } else {
      const runCalc = gradePct > 0 ? (rise / gradePct) * 100 : 0;
      return [
        { label: "Horizontal Run", value: Math.round(runCalc * 100) / 100, unit: "ft", highlight: true },
        { label: "Rise", value: rise, unit: "ft" },
        { label: "Grade", value: gradePct, unit: "%" },
      ];
    }
  },
};

const compactionPasses: Calculator = {
  id: "compaction-passes",
  name: "Compaction Passes",
  description: "Number of roller passes to reach target compaction",
  inputs: [
    { id: "area", label: "Area to Compact", unit: "ft²", type: "number", defaultValue: "1000", min: 0 },
    { id: "lift", label: "Lift Thickness", unit: "in", type: "number", defaultValue: "6", min: 0 },
    {
      id: "material", label: "Material", unit: "", type: "select",
      options: [
        { label: "Granular Fill / Sand (4–6 passes)", value: "5" },
        { label: "Gravel / Crushed Stone (4–6 passes)", value: "5" },
        { label: "Cohesive Soil / Clay (6–8 passes)", value: "7" },
        { label: "Subbase (6 passes)", value: "6" },
        { label: "Asphalt Base (4–6 passes)", value: "5" },
      ],
      defaultValue: "5",
    },
    { id: "rollerWidth", label: "Roller Drum Width", unit: "ft", type: "number", defaultValue: "5", min: 1 },
    { id: "speed", label: "Roller Speed", unit: "MPH", type: "number", defaultValue: "3", min: 0.5 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const passes = parseFloat(inputs.material) || 5;
    const width = parseFloat(inputs.rollerWidth) || 5;
    const speed = parseFloat(inputs.speed) || 3;
    // Total lane-length per pass
    const laneLength = area / width;
    // Production rate: drum width × speed × efficiency
    const prodRate = width * speed * 5280 * 0.85; // ft²/hr, 85% efficiency
    const totalHours = (laneLength * passes) / (speed * 5280);
    return [
      { label: "Passes Required", value: passes, unit: "passes", highlight: true },
      { label: "Total Lane Length", value: Math.round(laneLength * passes), unit: "ft" },
      { label: "Est. Compaction Time", value: Math.round(totalHours * 10) / 10, unit: "hrs" },
      { label: "Area", value: Math.round(area), unit: "ft²" },
    ];
  },
};

// ─── DRYWALL ─────────────────────────────────────────────────────────────────

const drywallSheets: Calculator = {
  id: "drywall-sheets",
  name: "Drywall Sheets",
  description: "4×8 or 4×12 sheets for walls and ceilings",
  inputs: [
    { id: "wallArea", label: "Total Wall Area", unit: "ft²", type: "number", defaultValue: "800", min: 0 },
    { id: "ceilingArea", label: "Ceiling Area", unit: "ft²", type: "number", defaultValue: "400", min: 0 },
    { id: "doors", label: "Doors (3/0×6/8)", unit: "ea", type: "number", defaultValue: "3", min: 0 },
    { id: "windows", label: "Windows", unit: "ea", type: "number", defaultValue: "6", min: 0 },
    {
      id: "sheetSize", label: "Sheet Size", unit: "", type: "select",
      options: [
        { label: "4×8 (32 ft²)", value: "32" },
        { label: "4×9 (36 ft²)", value: "36" },
        { label: "4×12 (48 ft²)", value: "48" },
      ],
      defaultValue: "32",
    },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const walls = parseFloat(inputs.wallArea) || 0;
    const ceiling = parseFloat(inputs.ceilingArea) || 0;
    const doors = parseFloat(inputs.doors) || 0;
    const windows = parseFloat(inputs.windows) || 0;
    const sheetSqFt = parseFloat(inputs.sheetSize) || 32;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const openings = doors * 20 + windows * 15;
    const netArea = (walls + ceiling - openings) * waste;
    const sheets = Math.ceil(netArea / sheetSqFt);
    return [
      { label: "Sheets Needed", value: sheets, unit: "sheets", highlight: true },
      { label: "Net Area", value: Math.round(netArea), unit: "ft²" },
      { label: "Gross Area", value: Math.round(walls + ceiling), unit: "ft²" },
      { label: "Openings Deducted", value: Math.round(openings), unit: "ft²" },
    ];
  },
};

const jointCompound: Calculator = {
  id: "joint-compound",
  name: "Joint Compound (Mud)",
  description: "Buckets of mud and tape for finishing drywall",
  inputs: [
    { id: "sheets", label: "Number of Sheets", unit: "sheets", type: "number", defaultValue: "50", min: 0 },
    {
      id: "coats", label: "Finish Level", unit: "", type: "select",
      options: [
        { label: "Level 3 (2 coats tape + 1 skim)", value: "3" },
        { label: "Level 4 (3 coats — standard)", value: "4" },
        { label: "Level 5 (full skim coat)", value: "5" },
      ],
      defaultValue: "4",
    },
  ],
  calculate: (inputs) => {
    const sheets = parseFloat(inputs.sheets) || 0;
    const level = parseFloat(inputs.coats) || 4;
    // ~1 gallon per 100 sq ft per coat; 5-gal bucket = 64 lbs ≈ covers ~350 sq ft for 3 coats
    const sqft = sheets * 32;
    // Tape: ~2 LF joint per sqft of drywall (rough)
    const tapeLF = sqft * 0.3;
    const tapeRolls = Math.ceil(tapeLF / 500); // 500 ft rolls
    // Mud: approx 1 bucket per 4 sheets at level 4
    const mudFactor = level === 3 ? 3.5 : level === 4 ? 4 : 5;
    const buckets5gal = Math.ceil(sheets / mudFactor);
    const screws = Math.ceil(sheets * 32); // ~1 screw per ft²
    return [
      { label: "5-gal Buckets (mud)", value: buckets5gal, unit: "buckets", highlight: true },
      { label: "Tape Rolls (500 ft)", value: tapeRolls, unit: "rolls" },
      { label: "Drywall Screws", value: screws, unit: "screws" },
      { label: "Total Area", value: Math.round(sqft), unit: "ft²" },
    ];
  },
};

const cornerBead: Calculator = {
  id: "corner-bead",
  name: "Corner Bead & Trim",
  description: "Linear feet of metal or vinyl corner bead",
  inputs: [
    { id: "corners", label: "Outside Corners", unit: "ea", type: "number", defaultValue: "8", min: 0 },
    { id: "height", label: "Wall / Ceiling Height", unit: "ft", type: "number", defaultValue: "9", min: 0 },
    { id: "archways", label: "Archway LF (flexible bead)", unit: "LF", type: "number", defaultValue: "0", min: 0 },
    {
      id: "beadLength", label: "Bead Stock Length", unit: "", type: "select",
      options: [
        { label: "8 ft lengths", value: "8" },
        { label: "9 ft lengths", value: "9" },
        { label: "10 ft lengths", value: "10" },
      ],
      defaultValue: "9",
    },
  ],
  calculate: (inputs) => {
    const corners = parseFloat(inputs.corners) || 0;
    const height = parseFloat(inputs.height) || 0;
    const archLF = parseFloat(inputs.archways) || 0;
    const stockLen = parseFloat(inputs.beadLength) || 9;
    const cornerLF = corners * height;
    const totalLF = cornerLF + archLF;
    const pieces = Math.ceil(totalLF / stockLen);
    return [
      { label: "Corner Bead Pieces", value: pieces, unit: `${stockLen}-ft sticks`, highlight: true },
      { label: "Total Linear Feet", value: Math.round(totalLF), unit: "LF" },
      { label: "Corner LF", value: Math.round(cornerLF), unit: "LF" },
    ];
  },
};

const drywallLiftRental: Calculator = {
  id: "drywall-crew-time",
  name: "Hang Time Estimator",
  description: "Estimated crew-hours to hang and finish drywall",
  inputs: [
    { id: "sheets", label: "Total Sheets", unit: "sheets", type: "number", defaultValue: "50", min: 1 },
    {
      id: "crewSize", label: "Crew Size", unit: "", type: "select",
      options: [
        { label: "1 Person", value: "1" },
        { label: "2 People", value: "2" },
        { label: "3 People", value: "3" },
      ],
      defaultValue: "2",
    },
    { id: "ceiling", label: "Ceiling Sheets (harder)", unit: "sheets", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const sheets = parseFloat(inputs.sheets) || 0;
    const crew = parseFloat(inputs.crewSize) || 2;
    const ceilSheets = parseFloat(inputs.ceiling) || 0;
    const wallSheets = sheets - ceilSheets;
    // Hanging: ~6 min per wall sheet, 15 min per ceiling sheet (1 person)
    const hangHrs = (wallSheets * 6 + ceilSheets * 15) / 60;
    // Finishing: ~3 min/sheet per coat × 3 coats
    const finishHrs = sheets * 3 * 3 / 60;
    const totalHrs = hangHrs + finishHrs;
    const crewHrs = totalHrs / crew;
    const days = Math.ceil(crewHrs / 8);
    return [
      { label: "Total Crew-Hours", value: Math.round(crewHrs * 10) / 10, unit: "hrs", highlight: true },
      { label: "Est. Days", value: days, unit: `days (${crew}-person crew)` },
      { label: "Hang Time", value: Math.round(hangHrs * 10) / 10, unit: "hrs" },
      { label: "Finish Time", value: Math.round(finishHrs * 10) / 10, unit: "hrs" },
    ];
  },
};

const drywallPatch: Calculator = {
  id: "drywall-patch",
  name: "Patch / Repair Area",
  description: "Material for patching drywall holes or damaged sections",
  inputs: [
    { id: "holes", label: "Small Holes (< 6\")", unit: "ea", type: "number", defaultValue: "3", min: 0 },
    { id: "medPatches", label: "Medium Patches (6\"–24\")", unit: "ea", type: "number", defaultValue: "1", min: 0 },
    { id: "largePatches", label: "Large Patches (> 24\")", unit: "ft²", type: "number", defaultValue: "0", min: 0 },
  ],
  calculate: (inputs) => {
    const small = parseFloat(inputs.holes) || 0;
    const med = parseFloat(inputs.medPatches) || 0;
    const large = parseFloat(inputs.largePatches) || 0;
    const mudQts = Math.ceil(small * 0.1 + med * 0.5 + large * 0.25);
    const sandpaperSheets = Math.ceil(small * 1 + med * 2 + large * 1);
    const primerQts = Math.ceil((small + med + large) / 10);
    return [
      { label: "Joint Compound (qt)", value: Math.max(mudQts, 1), unit: "qts", highlight: true },
      { label: "Sandpaper Sheets", value: sandpaperSheets, unit: "sheets (120g)" },
      { label: "Primer (qt)", value: Math.max(primerQts, 1), unit: "qts" },
    ];
  },
};

// ─── INSULATION ───────────────────────────────────────────────────────────────

const battInsulation: Calculator = {
  id: "batt-insulation",
  name: "Batt / Roll Insulation",
  description: "Bags or rolls of fiberglass or mineral wool batts",
  inputs: [
    { id: "area", label: "Area to Insulate", unit: "ft²", type: "number", defaultValue: "500", min: 0 },
    {
      id: "rValue", label: "Target R-Value", unit: "", type: "select",
      options: [
        { label: "R-11 (2×4 wall, 3.5\")", value: "R11" },
        { label: "R-13 (2×4 wall, 3.5\")", value: "R13" },
        { label: "R-15 (2×4 wall, 3.5\" HD)", value: "R15" },
        { label: "R-19 (2×6 wall, 5.5\")", value: "R19" },
        { label: "R-21 (2×6 wall, 5.5\" HD)", value: "R21" },
        { label: "R-30 (floor/attic, 9.5\")", value: "R30" },
        { label: "R-38 (attic, 12\")", value: "R38" },
        { label: "R-49 (attic, 16\")", value: "R49" },
      ],
      defaultValue: "R13",
    },
    {
      id: "spacing", label: "Framing Spacing", unit: "", type: "select",
      options: [
        { label: "16\" O.C.", value: "16" },
        { label: "24\" O.C.", value: "24" },
      ],
      defaultValue: "16",
    },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "5", min: 0 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const spacing = inputs.spacing;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    // Coverage per bag/roll varies by product; typical values
    const coverageMap: Record<string, [number, string]> = {
      R11: [40, "40 ft²/roll"],
      R13: [40, "40 ft²/roll"],
      R15: [32, "32 ft²/roll"],
      R19: [48, "48 ft²/roll"],
      R21: [40, "40 ft²/roll"],
      R30: [40, "40 ft²/roll"],
      R38: [32, "32 ft²/bag"],
      R49: [24, "24 ft²/bag"],
    };
    const [covPer] = coverageMap[inputs.rValue] || [40, "40 ft²"];
    const rolls = Math.ceil((area * waste) / covPer);
    const vapor = Math.ceil(area * 1.1 / 200); // vapor barrier rolls (200 sqft each)
    return [
      { label: "Rolls / Bags", value: rolls, unit: "rolls", highlight: true },
      { label: "Area (w/ waste)", value: Math.round(area * waste), unit: "ft²" },
      { label: "Vapor Barrier Rolls", value: vapor, unit: "rolls (200 ft²)" },
    ];
  },
};

const blownInInsulation: Calculator = {
  id: "blown-in",
  name: "Blown-In Insulation",
  description: "Bags of blown cellulose or fiberglass for attics",
  inputs: [
    { id: "area", label: "Attic / Floor Area", unit: "ft²", type: "number", defaultValue: "1000", min: 0 },
    {
      id: "rValue", label: "Target R-Value", unit: "", type: "select",
      options: [
        { label: "R-19 (~5.5\" cellulose)", value: "19" },
        { label: "R-30 (~8\" cellulose)", value: "30" },
        { label: "R-38 (~10\" cellulose)", value: "38" },
        { label: "R-49 (~13\" cellulose)", value: "49" },
        { label: "R-60 (~16\" cellulose)", value: "60" },
      ],
      defaultValue: "38",
    },
    {
      id: "material", label: "Material", unit: "", type: "select",
      options: [
        { label: "Cellulose (covers ~40 ft²/bag at R-38)", value: "cellulose" },
        { label: "Fiberglass (covers ~26 ft²/bag at R-38)", value: "fiberglass" },
      ],
      defaultValue: "cellulose",
    },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const r = parseFloat(inputs.rValue) || 38;
    const isCellulose = inputs.material === "cellulose";
    // Bags needed: roughly area / (base_coverage × R38_ratio)
    // Base: cellulose ~40 ft²/bag at R38, fiberglass ~26 ft²/bag at R38
    const baseCoverage = isCellulose ? 40 : 26;
    const rRatio = 38 / r; // more R → fewer sqft per bag
    const bagCoverage = baseCoverage * rRatio;
    const bags = Math.ceil(area / bagCoverage);
    const depth = isCellulose ? (r / 3.7) : (r / 2.5); // inches
    return [
      { label: "Bags Needed", value: bags, unit: "bags", highlight: true },
      { label: "Install Depth", value: Math.round(depth * 10) / 10, unit: "in" },
      { label: "Area", value: Math.round(area), unit: "ft²" },
      { label: "Coverage per Bag", value: Math.round(bagCoverage * 10) / 10, unit: "ft²" },
    ];
  },
};

const rigidFoam: Calculator = {
  id: "rigid-foam",
  name: "Rigid Foam Board",
  description: "4×8 sheets of XPS, EPS, or polyiso board",
  inputs: [
    { id: "area", label: "Area", unit: "ft²", type: "number", defaultValue: "400", min: 0 },
    {
      id: "rPerInch", label: "Foam Type", unit: "", type: "select",
      options: [
        { label: "EPS (R-3.8/in, white bead board)", value: "3.8" },
        { label: "XPS (R-5/in, blue/pink board)", value: "5.0" },
        { label: "Polyiso (R-6.5/in, foil face)", value: "6.5" },
      ],
      defaultValue: "5.0",
    },
    { id: "targetR", label: "Target R-Value", unit: "", type: "number", defaultValue: "10", min: 0 },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const rPerIn = parseFloat(inputs.rPerInch) || 5;
    const targetR = parseFloat(inputs.targetR) || 10;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const thickness = targetR / rPerIn;
    // Standard thicknesses: 1, 1.5, 2, 3, 4 inches
    const stdThick = [1, 1.5, 2, 3, 4];
    let layers = 1;
    let thickPerLayer = thickness;
    for (const t of stdThick) {
      if (t >= thickness) { thickPerLayer = t; break; }
    }
    if (thickPerLayer > 4) { layers = Math.ceil(thickness / 4); thickPerLayer = 4; }
    const sheets = Math.ceil((area * waste * layers) / 32);
    return [
      { label: "Sheets (4×8)", value: sheets, unit: "sheets", highlight: true },
      { label: "Thickness per Layer", value: Math.round(thickPerLayer * 10) / 10, unit: "in" },
      { label: "Layers", value: layers, unit: "layers" },
      { label: "Total R-Value", value: Math.round(thickPerLayer * layers * rPerIn * 10) / 10, unit: "" },
    ];
  },
};

const sprayFoam: Calculator = {
  id: "spray-foam",
  name: "Spray Foam Coverage",
  description: "2-part kits or board feet of spray polyurethane foam",
  inputs: [
    { id: "area", label: "Area to Spray", unit: "ft²", type: "number", defaultValue: "200", min: 0 },
    { id: "thickness", label: "Target Thickness", unit: "in", type: "number", defaultValue: "2", min: 0.5, step: 0.5 },
    {
      id: "foamType", label: "Foam Type", unit: "", type: "select",
      options: [
        { label: "Open-Cell (R-3.7/in) — air seal, interiors", value: "3.7" },
        { label: "Closed-Cell (R-6.5/in) — vapor barrier, exterior", value: "6.5" },
      ],
      defaultValue: "6.5",
    },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const thick = parseFloat(inputs.thickness) || 2;
    const rPerIn = parseFloat(inputs.foamType) || 6.5;
    const boardFt = area * thick; // 1 BF = 1 ft² at 1" thick
    // Kits: 600 BF kit is common; also 200 BF and 15 BF kits
    const kit600 = Math.floor(boardFt / 600);
    const remainder = boardFt % 600;
    const kit200 = Math.floor(remainder / 200);
    const rem2 = remainder % 200;
    const kit15 = Math.ceil(rem2 / 15);
    const totalR = thick * rPerIn;
    return [
      { label: "Board Feet Needed", value: Math.round(boardFt), unit: "BF", highlight: true },
      { label: "600 BF Kits", value: kit600, unit: "kits" },
      { label: "200 BF Kits", value: kit200, unit: "kits" },
      { label: "15 BF Touch-Up Kits", value: kit15, unit: "kits" },
      { label: "R-Value Achieved", value: Math.round(totalR * 10) / 10, unit: "" },
    ];
  },
};

const rValueCalc: Calculator = {
  id: "r-value-stack",
  name: "R-Value Stack-Up",
  description: "Total wall or roof assembly R-value from multiple layers",
  inputs: [
    { id: "sheathing", label: "Sheathing (OSB/ply 1/2\")", unit: "R", type: "number", defaultValue: "0.63", min: 0, step: 0.01 },
    { id: "cavity", label: "Cavity Insulation", unit: "R", type: "number", defaultValue: "13", min: 0 },
    { id: "rigidFoamR", label: "Continuous Rigid Foam", unit: "R", type: "number", defaultValue: "5", min: 0 },
    { id: "drywall", label: "Drywall 1/2\"", unit: "R", type: "number", defaultValue: "0.45", min: 0, step: 0.01 },
    { id: "siding", label: "Siding / Cladding", unit: "R", type: "number", defaultValue: "0.81", min: 0, step: 0.01 },
    { id: "airFilms", label: "Air Films (inside + outside)", unit: "R", type: "number", defaultValue: "0.92", min: 0, step: 0.01 },
  ],
  calculate: (inputs) => {
    const layers = [
      parseFloat(inputs.sheathing) || 0,
      parseFloat(inputs.cavity) || 0,
      parseFloat(inputs.rigidFoamR) || 0,
      parseFloat(inputs.drywall) || 0,
      parseFloat(inputs.siding) || 0,
      parseFloat(inputs.airFilms) || 0,
    ];
    const totalR = layers.reduce((a, b) => a + b, 0);
    const uValue = totalR > 0 ? 1 / totalR : 0;
    return [
      { label: "Total R-Value", value: Math.round(totalR * 100) / 100, unit: "R", highlight: true },
      { label: "U-Factor", value: Math.round(uValue * 10000) / 10000, unit: "BTU/hr·ft²·°F" },
      { label: "Cavity Only", value: parseFloat(inputs.cavity) || 0, unit: "R" },
      { label: "Continuous Foam", value: parseFloat(inputs.rigidFoamR) || 0, unit: "R" },
    ];
  },
};

// ─── ELECTRICAL (MORE) ────────────────────────────────────────────────────────

const evCharger: Calculator = {
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
    const runFt = parseFloat(inputs.runLength) || 50;
    const battery = parseFloat(inputs.batteryKwh) || 82;
    const empty = parseFloat(inputs.percentEmpty) || 80;
    // NEC 625.17 / 210.19: branch circuit = 125% continuous
    const breakerAmps = amps * 1.25;
    // Wire sizing at 125%
    let wire = "8 AWG";
    if (breakerAmps <= 20) wire = "12 AWG";
    else if (breakerAmps <= 30) wire = "10 AWG";
    else if (breakerAmps <= 40) wire = "8 AWG";
    else if (breakerAmps <= 55) wire = "6 AWG";
    else if (breakerAmps <= 70) wire = "4 AWG";
    else if (breakerAmps <= 95) wire = "3 AWG";
    else if (breakerAmps <= 110) wire = "2 AWG";
    // Standard breaker
    let breaker = 20;
    for (const b of [20,25,30,40,50,60,70,80,90,100]) { if (b >= breakerAmps) { breaker = b; break; } else { breaker = b; } }
    const kwhNeeded = battery * (empty / 100);
    const chargeHrs = kw > 0 ? kwhNeeded / kw : 0;
    const milesPerHr = kw * 3; // rough: ~3 miles per kWh
    return [
      { label: "Breaker Size", value: breaker, unit: "A (2-pole)", highlight: true },
      { label: "Wire Size (Cu THHN)", value: 0, unit: wire },
      { label: "Charge Rate", value: Math.round(kw * 10) / 10, unit: "kW" },
      { label: "Miles Added/Hour", value: Math.round(milesPerHr), unit: "mi/hr" },
      { label: "Time to Full Charge", value: Math.round(chargeHrs * 10) / 10, unit: "hrs" },
    ];
  },
};

const solarSizing: Calculator = {
  id: "solar-sizing",
  name: "Solar System Sizing",
  description: "Array size and panel count from energy usage",
  inputs: [
    { id: "monthlyKwh", label: "Monthly Usage", unit: "kWh/mo", type: "number", defaultValue: "1000", min: 0 },
    { id: "sunHours", label: "Peak Sun Hours / Day", unit: "hrs", type: "number", defaultValue: "5", min: 0.1, step: 0.5 },
    {
      id: "panelWatts", label: "Panel Wattage", unit: "", type: "select",
      options: [
        { label: "300W panel", value: "300" },
        { label: "350W panel", value: "350" },
        { label: "400W panel", value: "400" },
        { label: "450W panel", value: "450" },
        { label: "500W panel", value: "500" },
      ],
      defaultValue: "400",
    },
    { id: "systemLoss", label: "System Loss / Derating", unit: "%", type: "number", defaultValue: "20", min: 0 },
    { id: "offset", label: "Offset Goal", unit: "%", type: "number", defaultValue: "100", min: 0 },
  ],
  calculate: (inputs) => {
    const monthly = parseFloat(inputs.monthlyKwh) || 0;
    const sunHrs = parseFloat(inputs.sunHours) || 5;
    const panelW = parseFloat(inputs.panelWatts) || 400;
    const loss = 1 - (parseFloat(inputs.systemLoss) || 20) / 100;
    const offset = (parseFloat(inputs.offset) || 100) / 100;
    const dailyKwh = (monthly * offset) / 30.4;
    const systemKw = dailyKwh / (sunHrs * loss);
    const panels = Math.ceil((systemKw * 1000) / panelW);
    const annualProduction = systemKw * sunHrs * 365 * loss;
    return [
      { label: "System Size", value: Math.round(systemKw * 100) / 100, unit: "kW DC", highlight: true },
      { label: "Panels Needed", value: panels, unit: `× ${panelW}W panels` },
      { label: "Est. Annual Production", value: Math.round(annualProduction), unit: "kWh/yr" },
      { label: "Daily Target", value: Math.round(dailyKwh * 10) / 10, unit: "kWh/day" },
    ];
  },
};

const recessedLightSpacing: Calculator = {
  id: "recessed-light-spacing",
  name: "Recessed Light Spacing",
  description: "How many cans and where to place them for even lighting",
  inputs: [
    { id: "length", label: "Room Length", unit: "ft", type: "number", defaultValue: "16", min: 0 },
    { id: "width", label: "Room Width", unit: "ft", type: "number", defaultValue: "12", min: 0 },
    { id: "ceilingHt", label: "Ceiling Height", unit: "ft", type: "number", defaultValue: "9", min: 0 },
    {
      id: "canSize", label: "Can / Trim Size", unit: "", type: "select",
      options: [
        { label: "4\" (spread ~4–5 ft)", value: "4.5" },
        { label: "5\" (spread ~5–6 ft)", value: "5.5" },
        { label: "6\" (spread ~6–7 ft)", value: "6.5" },
      ],
      defaultValue: "6.5",
    },
    { id: "targetFc", label: "Target Foot-Candles", unit: "fc", type: "number", defaultValue: "30", min: 5 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const w = parseFloat(inputs.width) || 0;
    const h = parseFloat(inputs.ceilingHt) || 9;
    const spread = parseFloat(inputs.canSize) || 6.5;
    const fc = parseFloat(inputs.targetFc) || 30;
    // Spacing rule: can diameter × ceiling height / 2 for perimeter placement
    const wallOffset = h / 2;
    const spacing = spread;
    const cols = Math.ceil(l / spacing);
    const rows = Math.ceil(w / spacing);
    const count = cols * rows;
    // Lumens needed: area × fc / CU (assume 0.7 CU for recessed)
    const lumensNeeded = l * w * fc / 0.7;
    const lumensPerCan = Math.round(lumensNeeded / Math.max(count, 1));
    return [
      { label: "Recessed Cans", value: count, unit: "cans", highlight: true },
      { label: "Grid Spacing", value: Math.round(spacing * 10) / 10, unit: "ft" },
      { label: "Wall Offset", value: Math.round(wallOffset * 10) / 10, unit: "ft from wall" },
      { label: "Lumens per Can", value: lumensPerCan, unit: "lumens" },
      { label: "Total Lumens Needed", value: Math.round(lumensNeeded), unit: "lm" },
    ];
  },
};

// ─── FRAMING (MORE) ───────────────────────────────────────────────────────────

const stairCalculator: Calculator = {
  id: "stair-calculator",
  name: "Stair Calculator",
  description: "Risers, treads, stringer length, and material for a staircase",
  inputs: [
    { id: "totalRise", label: "Total Rise (floor to floor)", unit: "in", type: "number", defaultValue: "109", min: 0 },
    { id: "treadDepth", label: "Tread Depth", unit: "in", type: "number", defaultValue: "10", min: 0 },
    { id: "width", label: "Stair Width", unit: "in", type: "number", defaultValue: "36", min: 0 },
    { id: "treadsPerStringer", label: "Stringers", unit: "ea", type: "number", defaultValue: "3", min: 2 },
  ],
  calculate: (inputs) => {
    const totalRise = parseFloat(inputs.totalRise) || 0;
    const treadDepth = parseFloat(inputs.treadDepth) || 10;
    const width = parseFloat(inputs.width) || 36;
    const stringers = parseFloat(inputs.treadsPerStringer) || 3;
    const risers = Math.ceil(totalRise / 7.75); // max 7-3/4" riser per IBC
    const riserHeight = totalRise / risers;
    const totalRun = (risers - 1) * treadDepth;
    // Stringer length via Pythagorean theorem
    const stringerLen = Math.sqrt(totalRise * totalRise + totalRun * totalRun) / 12;
    // Treads needed (risers - 1 for attached landings)
    const treadCount = risers - 1;
    const treadBoardFt = (treadCount * (width / 12) * (treadDepth / 12)) * 1.1;
    return [
      { label: "Number of Risers", value: risers, unit: "risers", highlight: true },
      { label: "Riser Height", value: Math.round(riserHeight * 100) / 100, unit: "in" },
      { label: "Treads", value: treadCount, unit: "treads" },
      { label: "Total Run", value: Math.round(totalRun * 10) / 10, unit: "in" },
      { label: "Stringer Length", value: Math.round(stringerLen * 100) / 100, unit: "ft each" },
      { label: "Tread Board-Feet", value: Math.round(treadBoardFt * 10) / 10, unit: "BF" },
    ];
  },
};

const deckBoards: Calculator = {
  id: "deck-boards",
  name: "Deck Boards",
  description: "Linear feet and pieces of decking boards",
  inputs: [
    { id: "length", label: "Deck Length", unit: "ft", type: "number", defaultValue: "20", min: 0 },
    { id: "width", label: "Deck Width", unit: "ft", type: "number", defaultValue: "16", min: 0 },
    {
      id: "boardWidth", label: "Board Width", unit: "", type: "select",
      options: [
        { label: "5/4×6 (5.5\" face)", value: "5.5" },
        { label: "2×6 (5.5\" face)", value: "5.5" },
        { label: "2×4 (3.5\" face)", value: "3.5" },
        { label: "1×6 Composite (5.5\")", value: "5.5" },
        { label: "1×4 Composite (3.5\")", value: "3.5" },
      ],
      defaultValue: "5.5",
    },
    { id: "gap", label: "Board Gap", unit: "in", type: "number", defaultValue: "0.25", min: 0, step: 0.0625 },
    {
      id: "boardLength", label: "Board Length", unit: "", type: "select",
      options: [
        { label: "8 ft", value: "8" },
        { label: "10 ft", value: "10" },
        { label: "12 ft", value: "12" },
        { label: "16 ft", value: "16" },
        { label: "20 ft", value: "20" },
      ],
      defaultValue: "16",
    },
    { id: "waste", label: "Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const w = parseFloat(inputs.width) || 0;
    const boardFace = parseFloat(inputs.boardWidth) || 5.5;
    const gap = parseFloat(inputs.gap) || 0.25;
    const boardLen = parseFloat(inputs.boardLength) || 16;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const effectiveWidth = (boardFace + gap) / 12;
    const rowCount = Math.ceil(w / effectiveWidth);
    const lfNeeded = rowCount * l * waste;
    const pieces = Math.ceil(lfNeeded / boardLen);
    const screwsPerBoard = Math.ceil((l / 1.33) * 2); // every joist ~16" OC, 2 screws
    return [
      { label: "Pieces", value: pieces, unit: `${boardLen}-ft boards`, highlight: true },
      { label: "Linear Feet", value: Math.round(lfNeeded), unit: "LF" },
      { label: "Rows", value: rowCount, unit: "rows" },
      { label: "Screws / Clips (est.)", value: pieces * screwsPerBoard, unit: "ea" },
    ];
  },
};

// ─── PLUMBING (MORE) ─────────────────────────────────────────────────────────

const septicSizing: Calculator = {
  id: "septic-sizing",
  name: "Septic Tank Sizing",
  description: "Minimum tank gallons and leach field for a home",
  inputs: [
    { id: "bedrooms", label: "Bedrooms", unit: "ea", type: "number", defaultValue: "3", min: 1 },
    {
      id: "soilPerc", label: "Soil Percolation Rate", unit: "", type: "select",
      options: [
        { label: "Fast (< 3 min/in) — sandy", value: "fast" },
        { label: "Moderate (3–30 min/in) — loam", value: "mod" },
        { label: "Slow (30–60 min/in) — clay", value: "slow" },
      ],
      defaultValue: "mod",
    },
  ],
  calculate: (inputs) => {
    const br = parseFloat(inputs.bedrooms) || 3;
    const perc = inputs.soilPerc;
    // EPA / typical sizing: 1000 gal for ≤2 br, +250 each additional
    const tankGal = br <= 2 ? 1000 : 1000 + (br - 2) * 250;
    // Daily flow: 75 GPD per bedroom (conservative)
    const dailyFlow = br * 75;
    // Leach field: sq ft per GPD based on perc rate
    const sqftPerGpd = perc === "fast" ? 0.8 : perc === "mod" ? 1.2 : 2.0;
    const leachSqFt = Math.ceil(dailyFlow * sqftPerGpd);
    // 100% reserve required by most codes
    const totalSqFt = leachSqFt * 2;
    return [
      { label: "Minimum Tank Size", value: tankGal, unit: "gal", highlight: true },
      { label: "Daily Flow", value: dailyFlow, unit: "GPD" },
      { label: "Primary Field", value: leachSqFt, unit: "ft²" },
      { label: "Total (w/ 100% reserve)", value: totalSqFt, unit: "ft²" },
    ];
  },
};

const pipeInsulationCalc: Calculator = {
  id: "pipe-insulation",
  name: "Pipe Insulation",
  description: "Linear feet of foam pipe insulation sleeves",
  inputs: [
    { id: "hotLF", label: "Hot Water Pipe Run", unit: "LF", type: "number", defaultValue: "60", min: 0 },
    { id: "coldLF", label: "Cold / Supply Pipe Run", unit: "LF", type: "number", defaultValue: "40", min: 0 },
    {
      id: "pipeDia", label: "Pipe Diameter", unit: "", type: "select",
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
    { id: "sleeveLen", label: "Sleeve Length", unit: "ft", type: "number", defaultValue: "6", min: 1 },
  ],
  calculate: (inputs) => {
    const hot = parseFloat(inputs.hotLF) || 0;
    const cold = parseFloat(inputs.coldLF) || 0;
    const sleeveLen = parseFloat(inputs.sleeveLen) || 6;
    const total = hot + cold;
    const pieces = Math.ceil(total / sleeveLen);
    const waste = Math.ceil(pieces * 0.1);
    return [
      { label: "Pieces Needed", value: pieces + waste, unit: `${sleeveLen}-ft sleeves`, highlight: true },
      { label: "Total Linear Feet", value: Math.round(total), unit: "LF" },
      { label: "Hot Water Pipes", value: hot, unit: "LF" },
      { label: "Cold / Supply Pipes", value: cold, unit: "LF" },
    ];
  },
};

// ─── HVAC (MORE) ─────────────────────────────────────────────────────────────

const heatLossGain: Calculator = {
  id: "heat-loss-gain",
  name: "Simplified Heat Load (Manual J)",
  description: "Estimated heating and cooling load for a room or zone",
  inputs: [
    { id: "area", label: "Room / Zone Area", unit: "ft²", type: "number", defaultValue: "300", min: 0 },
    { id: "ceilingHt", label: "Ceiling Height", unit: "ft", type: "number", defaultValue: "9", min: 0 },
    { id: "windows", label: "Window Area", unit: "ft²", type: "number", defaultValue: "40", min: 0 },
    { id: "wallR", label: "Wall R-Value", unit: "R", type: "number", defaultValue: "13", min: 1 },
    { id: "designDelta", label: "Design Temp Difference (ΔT)", unit: "°F", type: "number", defaultValue: "55", min: 0 },
    {
      id: "climate", label: "Climate / Occupancy", unit: "", type: "select",
      options: [
        { label: "Cold Climate (heating dominant)", value: "heat" },
        { label: "Hot Climate (cooling dominant)", value: "cool" },
        { label: "Mixed Climate", value: "mixed" },
      ],
      defaultValue: "heat",
    },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const ht = parseFloat(inputs.ceilingHt) || 9;
    const winArea = parseFloat(inputs.windows) || 0;
    const wallR = parseFloat(inputs.wallR) || 13;
    const delta = parseFloat(inputs.designDelta) || 55;
    const wallArea = (area * 4 / Math.sqrt(area)) * ht - winArea; // rough perimeter × height
    // U-values
    const uWall = 1 / wallR;
    const uCeiling = 1 / 30; // R-30 assumed
    const uWindow = 0.35; // double-pane
    const wallLoss = uWall * wallArea * delta;
    const ceilLoss = uCeiling * area * delta;
    const winLoss = uWindow * winArea * delta;
    const infiltration = (area * ht * 0.5 * 0.018 * delta); // 0.5 ACH × 0.018 BTU/ft³·°F
    const totalBtu = wallLoss + ceilLoss + winLoss + infiltration;
    const tons = totalBtu / 12000;
    return [
      { label: "Total Load", value: Math.round(totalBtu), unit: "BTU/hr", highlight: true },
      { label: "Tonnage", value: Math.round(tons * 10) / 10, unit: "tons" },
      { label: "Wall Loss", value: Math.round(wallLoss), unit: "BTU/hr" },
      { label: "Window Loss", value: Math.round(winLoss), unit: "BTU/hr" },
      { label: "Infiltration", value: Math.round(infiltration), unit: "BTU/hr" },
    ];
  },
};

const exhaustFan: Calculator = {
  id: "exhaust-fan",
  name: "Exhaust Fan Sizing",
  description: "CFM rating for bathroom, kitchen, or utility exhaust fans",
  inputs: [
    {
      id: "room", label: "Room Type", unit: "", type: "select",
      options: [
        { label: "Bathroom (< 100 ft²)", value: "bath_small" },
        { label: "Bathroom (> 100 ft²)", value: "bath_large" },
        { label: "Kitchen Range Hood", value: "kitchen" },
        { label: "Utility / Laundry Room", value: "utility" },
      ],
      defaultValue: "bath_small",
    },
    { id: "area", label: "Room Area", unit: "ft²", type: "number", defaultValue: "50", min: 0 },
    { id: "ceilingHt", label: "Ceiling Height", unit: "ft", type: "number", defaultValue: "8", min: 0 },
    { id: "btu", label: "Range BTU (kitchen only)", unit: "BTU/hr", type: "number", defaultValue: "60000", min: 0 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const ht = parseFloat(inputs.ceilingHt) || 8;
    const btu = parseFloat(inputs.btu) || 0;
    const roomType = inputs.room;
    let cfm = 0;
    let rule = "";
    if (roomType === "bath_small") {
      cfm = Math.max(50, area); // HVI: 1 CFM per sqft, min 50
      rule = "HVI: 1 CFM/ft², min 50 CFM";
    } else if (roomType === "bath_large") {
      // Per fixture: toilet 50, shower 50, tub 50, separate WC 50
      cfm = Math.max(Math.ceil(area * 1.07), 100);
      rule = "ASHRAE 62.2: per fixture method";
    } else if (roomType === "kitchen") {
      cfm = Math.max(btu / 100, 400); // 1 CFM per 100 BTU, min 400
      rule = "HVI: 1 CFM per 100 BTU, min 400";
    } else {
      // Utility: 0.5 ACH minimum
      cfm = Math.ceil((area * ht * 0.5) / 60);
      rule = "0.5 ACH minimum";
    }
    return [
      { label: "Required CFM", value: Math.ceil(cfm), unit: "CFM", highlight: true },
      { label: "Sone Rating (max)", value: roomType === "bath_small" ? 1 : 2, unit: "sones" },
      { label: "Sizing Method", value: 0, unit: rule },
    ];
  },
};

// ─── ROOFING (MORE) ──────────────────────────────────────────────────────────

const snowLoad: Calculator = {
  id: "snow-load",
  name: "Roof Snow Load",
  description: "Balanced and unbalanced snow load on a sloped roof",
  inputs: [
    { id: "pg", label: "Ground Snow Load (Pg)", unit: "psf", type: "number", defaultValue: "30", min: 0 },
    { id: "rise", label: "Roof Slope (rise per 12\")", unit: "in", type: "number", defaultValue: "6", min: 0 },
    {
      id: "exposure", label: "Exposure Category", unit: "", type: "select",
      options: [
        { label: "Sheltered (Ce = 1.2)", value: "1.2" },
        { label: "Partially Exposed (Ce = 1.0)", value: "1.0" },
        { label: "Fully Exposed (Ce = 0.9)", value: "0.9" },
      ],
      defaultValue: "1.0",
    },
    {
      id: "thermal", label: "Thermal Factor", unit: "", type: "select",
      options: [
        { label: "Heated Building (Ct = 1.0)", value: "1.0" },
        { label: "Poorly Insulated (Ct = 1.1)", value: "1.1" },
        { label: "Unheated (Ct = 1.2)", value: "1.2" },
        { label: "Freezer / Cold Storage (Ct = 1.3)", value: "1.3" },
      ],
      defaultValue: "1.0",
    },
    { id: "is", label: "Importance Factor (Is)", unit: "", type: "number", defaultValue: "1.0", min: 0.8, step: 0.05 },
  ],
  calculate: (inputs) => {
    const pg = parseFloat(inputs.pg) || 0;
    const slope = parseFloat(inputs.rise) || 6;
    const Ce = parseFloat(inputs.exposure) || 1.0;
    const Ct = parseFloat(inputs.thermal) || 1.0;
    const Is = parseFloat(inputs.is) || 1.0;
    // ASCE 7: pf = 0.7 × Ce × Ct × Is × pg
    const pf = 0.7 * Ce * Ct * Is * pg;
    // Slope factor Cs (roof pitch in degrees)
    const deg = Math.atan(slope / 12) * (180 / Math.PI);
    const Cs = deg <= 30 ? 1.0 : deg <= 70 ? 1.0 - (deg - 30) / 40 : 0;
    const ps = Cs * pf;
    return [
      { label: "Flat Roof Snow Load (pf)", value: Math.round(pf * 10) / 10, unit: "psf", highlight: true },
      { label: "Sloped Roof Load (ps)", value: Math.round(ps * 10) / 10, unit: "psf" },
      { label: "Slope Factor (Cs)", value: Math.round(Cs * 100) / 100, unit: "" },
      { label: "Roof Pitch", value: slope, unit: "in / 12" },
    ];
  },
};

const dripEdge: Calculator = {
  id: "drip-edge",
  name: "Drip Edge & Fascia",
  description: "Linear feet of drip edge and fascia board",
  inputs: [
    { id: "length", label: "Building Length", unit: "ft", type: "number", defaultValue: "40", min: 0 },
    { id: "width", label: "Building Width", unit: "ft", type: "number", defaultValue: "30", min: 0 },
    { id: "overhang", label: "Eave Overhang", unit: "in", type: "number", defaultValue: "12", min: 0 },
    { id: "rise", label: "Roof Pitch (rise per 12\")", unit: "in", type: "number", defaultValue: "6", min: 0 },
    {
      id: "pieceLen", label: "Stock Length", unit: "", type: "select",
      options: [
        { label: "10 ft pieces", value: "10" },
        { label: "12 ft pieces", value: "12" },
      ],
      defaultValue: "10",
    },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const w = parseFloat(inputs.width) || 0;
    const overhang = (parseFloat(inputs.overhang) || 0) / 12;
    const stockLen = parseFloat(inputs.pieceLen) || 10;
    // Rake sides use slope-adjusted length
    const pitch = parseFloat(inputs.rise) || 6;
    const slopeMult = Math.sqrt(pitch * pitch + 144) / 12;
    const rakeLF = (w / 2) * slopeMult * 2 * 2; // 2 gable ends, 2 rake edges each
    const eaveLF = (l + overhang * 2) * 2; // two eaves
    const totalDripEdge = rakeLF + eaveLF;
    const pieces = Math.ceil(totalDripEdge / stockLen * 1.05);
    return [
      { label: "Drip Edge Pieces", value: pieces, unit: `${stockLen}-ft pieces`, highlight: true },
      { label: "Total LF", value: Math.round(totalDripEdge), unit: "LF" },
      { label: "Eave LF", value: Math.round(eaveLF), unit: "LF" },
      { label: "Rake LF", value: Math.round(rakeLF), unit: "LF" },
    ];
  },
};

// ─── LANDSCAPING ─────────────────────────────────────────────────────────────

const mulchCalc: Calculator = {
  id: "mulch",
  name: "Mulch / Topsoil / Gravel",
  description: "Cubic yards or bags of bulk material",
  inputs: [
    { id: "area", label: "Coverage Area", unit: "ft²", type: "number", defaultValue: "500", min: 0 },
    { id: "depth", label: "Depth", unit: "in", type: "number", defaultValue: "3", min: 0, step: 0.5 },
    {
      id: "material", label: "Material", unit: "", type: "select",
      options: [
        { label: "Mulch (wood, shredded)", value: "mulch" },
        { label: "Topsoil", value: "topsoil" },
        { label: "Gravel / Stone", value: "gravel" },
        { label: "Sand", value: "sand" },
        { label: "Compost", value: "compost" },
      ],
      defaultValue: "mulch",
    },
    { id: "waste", label: "Extra / Waste", unit: "%", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const depth = (parseFloat(inputs.depth) || 0) / 12;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const cubicFt = area * depth * waste;
    const cy = cubicFt / 27;
    // Bags: 2 cu ft bags
    const bags2cuFt = Math.ceil(cubicFt / 2);
    // Weight per CY for delivery reference
    const weightMap: Record<string, number> = { mulch: 800, topsoil: 2000, gravel: 2800, sand: 2700, compost: 1000 };
    const lbsPerCy = weightMap[inputs.material] || 1500;
    const tons = (cy * lbsPerCy) / 2000;
    return [
      { label: "Cubic Yards", value: Math.round(cy * 100) / 100, unit: "yd³", highlight: true },
      { label: "2 cu ft Bags", value: bags2cuFt, unit: "bags" },
      { label: "Approx Weight", value: Math.round(tons * 100) / 100, unit: "tons" },
    ];
  },
};

const sodCalc: Calculator = {
  id: "sod",
  name: "Sod & Seed",
  description: "Pallets of sod or lbs of seed for a lawn area",
  inputs: [
    { id: "area", label: "Lawn Area", unit: "ft²", type: "number", defaultValue: "2000", min: 0 },
    {
      id: "type", label: "Installation Method", unit: "", type: "select",
      options: [
        { label: "Sod (pallets — 450 ft²/pallet)", value: "sod" },
        { label: "Seed — new lawn (4–6 lbs/1000 ft²)", value: "seed_new" },
        { label: "Seed — overseeding (2–3 lbs/1000 ft²)", value: "seed_over" },
      ],
      defaultValue: "sod",
    },
    { id: "waste", label: "Waste / Cuts", unit: "%", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const area = parseFloat(inputs.area) || 0;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const total = area * waste;
    if (inputs.type === "sod") {
      const pallets = Math.ceil(total / 450);
      const pieces = Math.ceil(total / 1.5); // typical 18"×24" piece = 3 sf
      return [
        { label: "Pallets of Sod", value: pallets, unit: "pallets (450 ft²)", highlight: true },
        { label: "Individual Pieces", value: pieces, unit: "pieces" },
        { label: "Area (w/ waste)", value: Math.round(total), unit: "ft²" },
      ];
    } else {
      const lbsPer = inputs.type === "seed_new" ? 5 : 2.5;
      const lbs = Math.ceil((total / 1000) * lbsPer);
      return [
        { label: "Seed Needed", value: lbs, unit: "lbs", highlight: true },
        { label: "Area", value: Math.round(area), unit: "ft²" },
        { label: "Rate", value: lbsPer, unit: "lbs/1000 ft²" },
      ];
    }
  },
};

const retainingWall: Calculator = {
  id: "retaining-wall",
  name: "Retaining Wall Block",
  description: "Block count and drainage stone for a retaining wall",
  inputs: [
    { id: "length", label: "Wall Length", unit: "ft", type: "number", defaultValue: "30", min: 0 },
    { id: "height", label: "Wall Height", unit: "ft", type: "number", defaultValue: "3", min: 0, step: 0.5 },
    {
      id: "blockType", label: "Block Type", unit: "", type: "select",
      options: [
        { label: "Allan Block / 6\"×18\" (0.75 ft² face)", value: "0.75" },
        { label: "Versa-Lok / 6\"×16\" (0.67 ft² face)", value: "0.67" },
        { label: "Keystone 6\"×16\" (0.67 ft² face)", value: "0.67" },
        { label: "Natural Stone ~12\"×18\" (1.5 ft²)", value: "1.5" },
      ],
      defaultValue: "0.75",
    },
    { id: "waste", label: "Waste / Cuts", unit: "%", type: "number", defaultValue: "10", min: 0 },
  ],
  calculate: (inputs) => {
    const l = parseFloat(inputs.length) || 0;
    const h = parseFloat(inputs.height) || 0;
    const blockFace = parseFloat(inputs.blockType) || 0.75;
    const waste = 1 + (parseFloat(inputs.waste) || 0) / 100;
    const faceArea = l * h;
    const blocks = Math.ceil((faceArea * waste) / blockFace);
    // Base course 6" below grade, batter set-back ~1"/ft height
    // Drainage stone: 12" wide × wall height + 6" base per LF of wall
    const drainageCY = Math.ceil((l * (h + 0.5) * 1) / 27);
    const capBlocks = Math.ceil(l * 1.05 / 1.5); // cap block ~18" each
    return [
      { label: "Wall Block Count", value: blocks, unit: "blocks", highlight: true },
      { label: "Cap Blocks", value: capBlocks, unit: "blocks" },
      { label: "Drainage Stone", value: drainageCY, unit: "yd³" },
      { label: "Face Area", value: Math.round(faceArea), unit: "ft²" },
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
    calculators: [concreteSlab, concreteFooting, rebarQuantity, cmuCount, circularSlab, postHole, stepConcrete],
  },
  {
    id: "framing",
    name: "Framing",
    color: "#92400E",
    icon: "box",
    calculators: [studCount, boardFeet, sheathingSheets, joistCount, rafterLength, wallFramingList, stairCalculator, deckBoards],
  },
  {
    id: "electrical",
    name: "Electrical",
    color: "#D97706",
    icon: "zap",
    calculators: [
      circuitLoad,
      voltageDrop,
      wireGauge,
      conduitFill,
      motorAmpacity,
      threePhasePower,
      boxFill,
      serviceLoad,
      generatorSizing,
      transformerKva,
      groundingConductor,
      demandFactor,
      shortCircuitCurrent,
      evCharger,
      solarSizing,
      recessedLightSpacing,
    ],
  },
  {
    id: "plumbing",
    name: "Plumbing",
    color: "#1D4ED8",
    icon: "droplet",
    calculators: [drainSlope, pipeSizing, fixtureUnits, pressureLoss, gasPipeSizing, waterHeaterSizing, septicSizing, pipeInsulationCalc],
  },
  {
    id: "hvac",
    name: "HVAC",
    color: "#065F46",
    icon: "wind",
    calculators: [btuLoad, ductSizing, cfmPerRoom, refrigerantLineSizing, ventilationRate, heatLossGain, exhaustFan],
  },
  {
    id: "roofing",
    name: "Roofing",
    color: "#991B1B",
    icon: "home",
    calculators: [roofPitch, roofingArea, shingleCount, underlaymentRolls, valleyLength, snowLoad, dripEdge],
  },
  {
    id: "masonry",
    name: "Masonry",
    color: "#78350F",
    icon: "grid",
    calculators: [brickCount, cmuCount, groutVolume, mortarMix, stoneVeneer, tuckpointing],
  },
  {
    id: "painting",
    name: "Painting",
    color: "#5B21B6",
    icon: "edit-3",
    calculators: [paintCoverage, wallArea, exteriorPaint],
  },
  {
    id: "flooring",
    name: "Flooring",
    color: "#B45309",
    icon: "square",
    calculators: [tileLayout, hardwoodFlooring, carpetYards, subflooring, floorLeveling],
  },
  {
    id: "excavation",
    name: "Excavation",
    color: "#713F12",
    icon: "truck",
    calculators: [cutFill, swellFactor, haulLoads, trenchVolume, gradeSlope, compactionPasses],
  },
  {
    id: "drywall",
    name: "Drywall",
    color: "#4B5563",
    icon: "align-justify",
    calculators: [drywallSheets, jointCompound, cornerBead, drywallLiftRental, drywallPatch],
  },
  {
    id: "insulation",
    name: "Insulation",
    color: "#0F766E",
    icon: "thermometer",
    calculators: [battInsulation, blownInInsulation, rigidFoam, sprayFoam, rValueCalc],
  },
  {
    id: "landscaping",
    name: "Landscaping",
    color: "#15803D",
    icon: "sun",
    calculators: [mulchCalc, sodCalc, retainingWall],
  },
];

export function getTradeById(id: string): Trade | undefined {
  return trades.find((t) => t.id === id);
}

export function getCalculatorById(tradeId: string, calcId: string): Calculator | undefined {
  const trade = getTradeById(tradeId);
  return trade?.calculators.find((c) => c.id === calcId);
}
