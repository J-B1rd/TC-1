import { voltageDrop } from "../data/electrical/voltage-drop";
import { conduitFill } from "../data/electrical/conduit-fill";
import { boxFill } from "../data/electrical/box-fill";
import { conduitBend } from "../data/electrical/conduit-bend";
import {
  parseFraction,
  validateInputs,
  preProcessValues,
} from "../data/validation";

// ─── parseFraction ────────────────────────────────────────────────────────────

describe("parseFraction", () => {
  it("parses whole numbers", () => {
    expect(parseFraction("12")).toBe(12);
    expect(parseFraction("0")).toBe(0);
    expect(parseFraction("100")).toBe(100);
  });

  it("parses decimal numbers", () => {
    expect(parseFraction("3.14")).toBeCloseTo(3.14);
    expect(parseFraction("0.5")).toBeCloseTo(0.5);
  });

  it("parses simple fractions", () => {
    expect(parseFraction("3/4")).toBeCloseTo(0.75);
    expect(parseFraction("1/2")).toBeCloseTo(0.5);
    expect(parseFraction("1/3")).toBeCloseTo(0.333, 2);
    expect(parseFraction("7/8")).toBeCloseTo(0.875);
  });

  it("returns NaN for invalid input", () => {
    expect(parseFraction("")).toBeNaN();
    expect(parseFraction("abc")).toBeNaN();
    expect(parseFraction("1/0")).toBeNaN();
  });
});

// ─── validateInputs ───────────────────────────────────────────────────────────

describe("validateInputs", () => {
  const inputs = voltageDrop.inputs.filter((i) => i.type === "number");

  it("returns no errors for valid values", () => {
    const errors = validateInputs(inputs, { amps: "20", distance: "100" });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("returns error for non-numeric strings", () => {
    const errors = validateInputs(inputs, { amps: "abc", distance: "100" });
    expect(errors.amps).toBeDefined();
  });

  it("returns error when value exceeds max", () => {
    const errors = validateInputs(inputs, { amps: "99999", distance: "100" });
    expect(errors.amps).toBeDefined();
  });

  it("returns error for negative when min is 0", () => {
    const errors = validateInputs(inputs, { amps: "-5", distance: "100" });
    expect(errors.amps).toBeDefined();
  });

  it("accepts fraction input as valid", () => {
    const errors = validateInputs(inputs, { amps: "3/4", distance: "100" });
    expect(errors.amps).toBeUndefined();
  });

  it("skips validation for empty strings", () => {
    const errors = validateInputs(inputs, { amps: "", distance: "" });
    expect(Object.keys(errors)).toHaveLength(0);
  });
});

// ─── preProcessValues ─────────────────────────────────────────────────────────

describe("preProcessValues", () => {
  it("converts fraction strings to decimal strings", () => {
    const result = preProcessValues({ size: "3/4", length: "100" });
    expect(result.size).toBe("0.75");
    expect(result.length).toBe("100");
  });

  it("leaves non-fraction strings unchanged", () => {
    const result = preProcessValues({ a: "12", b: "3.14", c: "abc" });
    expect(result.a).toBe("12");
    expect(result.b).toBe("3.14");
    expect(result.c).toBe("abc");
  });
});

// ─── Voltage Drop ─────────────────────────────────────────────────────────────

describe("Voltage Drop Calculator", () => {
  function calc(overrides: Record<string, string>) {
    const defaults = {
      voltage: "120",
      phase: "1",
      material: "cu",
      awg: "12 AWG",
      amps: "20",
      distance: "100",
    };
    return voltageDrop.calculate({ ...defaults, ...overrides });
  }

  it("computes 12 AWG Cu 20A 100ft 120V 1φ correctly", () => {
    const results = calc({});
    const vd = results.find((r) => r.label === "Voltage Drop");
    const pct = results.find((r) => r.label === "Drop Percentage");
    // R=1.98, VD=20×2×1.98×100/1000=7.92
    expect(vd?.value).toBeCloseTo(7.92, 1);
    expect(pct?.value).toBeCloseTo(6.6, 1);
  });

  it("computes three-phase with √3 multiplier", () => {
    const results = calc({ phase: "3", voltage: "480" });
    const m = results.find((r) => r.label.includes("Multiplier"));
    expect(m?.value).toBeCloseTo(1.732, 2);
  });

  it("voltage at load = system voltage minus drop", () => {
    const results = calc({});
    const vd  = results.find((r) => r.label === "Voltage Drop")!;
    const val = results.find((r) => r.label === "Voltage at Load")!;
    expect(val.value).toBeCloseTo(120 - vd.value, 1);
  });

  it("shows PASS status when drop <= 3%", () => {
    const results = calc({ amps: "5", distance: "50" });
    const status = results.find((r) => r.label === "Status");
    expect(status?.unit).toMatch(/PASS/);
  });

  it("shows OVER status when drop > 3%", () => {
    const results = calc({ amps: "20", distance: "150" });
    const status = results.find((r) => r.label === "Status");
    expect(status?.unit).toMatch(/OVER/);
  });

  it("larger wire has lower resistance", () => {
    const r12 = calc({ awg: "12 AWG" }).find((r) => r.label.includes("R"))!;
    const r8  = calc({ awg: "8 AWG"  }).find((r) => r.label.includes("R"))!;
    expect(r8.value).toBeLessThan(r12.value);
  });

  it("produces computeSteps with actual numbers", () => {
    const steps = voltageDrop.computeSteps!({
      voltage: "120", phase: "1", material: "cu",
      awg: "12 AWG", amps: "20", distance: "100",
    });
    expect(steps.length).toBeGreaterThan(0);
    expect(steps.some((s) => s.includes("1.98"))).toBe(true);
    expect(steps.some((s) => s.includes("7.9"))).toBe(true);
  });
});

// ─── Conduit Fill ─────────────────────────────────────────────────────────────

describe("Conduit Fill Calculator", () => {
  function calc(overrides: Record<string, string>) {
    const defaults = {
      conduitType: "emt",
      tradeSize: "3q",
      wireType: "thhn",
      wireSize: "12",
      count: "3",
    };
    return conduitFill.calculate({ ...defaults, ...overrides });
  }

  it("computes fill for 3×THHN 12AWG in 3/4\" EMT", () => {
    const results = calc({});
    const fill = results.find((r) => r.label === "Fill Percentage");
    // 3×0.0133/0.213×100 = 18.7%
    expect(fill?.value).toBeCloseTo(18.7, 0);
  });

  it("NEC limit is 40% for 3+ wires", () => {
    const results = calc({});
    const limit = results.find((r) => r.label === "NEC Limit");
    expect(limit?.value).toBe(40);
  });

  it("NEC limit is 53% for 1 wire", () => {
    const results = calc({ count: "1" });
    const limit = results.find((r) => r.label === "NEC Limit");
    expect(limit?.value).toBe(53);
  });

  it("NEC limit is 31% for 2 wires", () => {
    const results = calc({ count: "2" });
    const limit = results.find((r) => r.label === "NEC Limit");
    expect(limit?.value).toBe(31);
  });

  it("PASS status when fill is within limit", () => {
    const results = calc({});
    const status = results.find((r) => r.label === "Status");
    expect(status?.unit).toMatch(/PASS/);
  });

  it("OVER status when fill exceeds limit", () => {
    const results = calc({ count: "50" });
    const status = results.find((r) => r.label === "Status");
    expect(status?.unit).toMatch(/OVER/);
  });

  it("PVC Sch 80 has smaller area than EMT at same size", () => {
    const emt  = calc({ conduitType: "emt"  }).find((r) => r.label === "Conduit Internal Area")!;
    const pvc80= calc({ conduitType: "pvc80"}).find((r) => r.label === "Conduit Internal Area")!;
    expect(pvc80.value).toBeLessThan(emt.value);
  });

  it("produces computeSteps with actual numbers", () => {
    const steps = conduitFill.computeSteps!({
      conduitType: "emt", tradeSize: "3q", wireType: "thhn",
      wireSize: "12", count: "3",
    });
    expect(steps.length).toBeGreaterThan(0);
    expect(steps.some((s) => s.includes("0.213"))).toBe(true);
  });
});

// ─── Box Fill ─────────────────────────────────────────────────────────────────

describe("Box Fill Calculator", () => {
  function calc(overrides: Record<string, string>) {
    const defaults = {
      awg: "2.25",
      conductors: "4",
      grounds: "2",
      clamps: "1",
      devices: "1",
    };
    return boxFill.calculate({ ...defaults, ...overrides });
  }

  it("computes correct total volume (12 AWG, 4 cond, 2 gnd, 1 clamp, 1 device)", () => {
    const results = calc({});
    const vol = results.find((r) => r.label === "Min Box Volume Required");
    // 4×2.25 + 1×2×2.25 + 1×2.25 + 1×2.25 = 9+4.5+2.25+2.25 = 18
    expect(vol?.value).toBeCloseTo(18, 1);
  });

  it("grounds all combine to 1 allowance regardless of count", () => {
    const r1 = calc({ grounds: "1" }).find((r) => r.label === "Min Box Volume Required")!;
    const r5 = calc({ grounds: "5" }).find((r) => r.label === "Min Box Volume Required")!;
    expect(r1.value).toBe(r5.value);
  });

  it("clamps all combine to 1 allowance regardless of count", () => {
    const r1 = calc({ clamps: "1" }).find((r) => r.label === "Min Box Volume Required")!;
    const r4 = calc({ clamps: "4" }).find((r) => r.label === "Min Box Volume Required")!;
    expect(r1.value).toBe(r4.value);
  });

  it("no grounds = no ground allowance", () => {
    const rWith = calc({ grounds: "2" }).find((r) => r.label === "Min Box Volume Required")!;
    const rNone = calc({ grounds: "0" }).find((r) => r.label === "Min Box Volume Required")!;
    expect(rNone.value).toBeLessThan(rWith.value);
  });

  it("devices count as 2 allowances each", () => {
    const r1 = calc({ devices: "1", grounds: "0", clamps: "0" }).find((r) => r.label === "Min Box Volume Required")!;
    const r2 = calc({ devices: "2", grounds: "0", clamps: "0" }).find((r) => r.label === "Min Box Volume Required")!;
    // 1 extra device = 2 more allowances = 2×2.25 = 4.5 more
    expect(r2.value - r1.value).toBeCloseTo(4.5, 1);
  });

  it("suggests a box that fits", () => {
    const results = calc({});
    const box = results.find((r) => r.label === "Smallest Box That Fits");
    expect(box?.unit).toMatch(/\u2713 Fits/);
  });
});

// ─── Conduit Bend ─────────────────────────────────────────────────────────────

describe("Conduit Bend Calculator", () => {
  function calc(overrides: Record<string, string>) {
    const defaults = {
      bendType: "stub90",
      conduitSize: "3q",
      dimA: "12",
      angle: "45",
      dimB: "6",
    };
    return conduitBend.calculate({ ...defaults, ...overrides });
  }

  it("90° stub: mark = stub - gain (3/4\" gain = 6)", () => {
    const results = calc({ bendType: "stub90", dimA: "12" });
    const mark = results.find((r) => r.label === "Mark Location (from end)");
    expect(mark?.value).toBeCloseTo(6, 1); // 12 - 6 = 6
  });

  it("90° stub: larger conduit has larger gain", () => {
    const r3q = calc({ bendType: "stub90", conduitSize: "3q", dimA: "12" })
      .find((r) => r.label === "Gain / Deduct")!;
    const r1  = calc({ bendType: "stub90", conduitSize: "1",  dimA: "12" })
      .find((r) => r.label === "Gain / Deduct")!;
    expect(r1.value).toBeGreaterThan(r3q.value);
  });

  it("offset 45°: between-marks distance = rise × 1.414", () => {
    const results = calc({ bendType: "offset", dimA: "6", angle: "45" });
    const between = results.find((r) => r.label === "Distance Between Marks");
    expect(between?.value).toBeCloseTo(6 * 1.414, 1);
  });

  it("offset 30°: multiplier is 2.0", () => {
    const results = calc({ bendType: "offset", dimA: "5", angle: "30" });
    const between = results.find((r) => r.label === "Distance Between Marks");
    expect(between?.value).toBeCloseTo(5 * 2.0, 1);
  });

  it("3-pt saddle: spread = obstacle × 2.5", () => {
    const results = calc({ bendType: "saddle3", dimA: "4" });
    const spread = results.find((r) => r.label === "Spread (outer to outer)");
    expect(spread?.value).toBeCloseTo(10, 1); // 4 × 2.5
  });

  it("4-pt saddle: total span = 2×seg + obstacle width", () => {
    const results = calc({ bendType: "saddle4", dimA: "4", angle: "45", dimB: "6" });
    const span = results.find((r) => r.label.includes("Total Span"));
    // seg = 4 × 1.414 = 5.656; total = 5.656*2 + 6 = 17.312
    expect(span?.value).toBeCloseTo(17.31, 0);
  });

  it("produces computeSteps for 90° stub", () => {
    const steps = conduitBend.computeSteps!({
      bendType: "stub90", conduitSize: "3q", dimA: "12", angle: "45", dimB: "6",
    });
    expect(steps.length).toBeGreaterThan(0);
    expect(steps.some((s) => s.includes("6"))).toBe(true);
  });
});
