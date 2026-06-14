import type { CalculatorInput } from "./types";

export function parseFraction(raw: string): number {
  const s = (raw ?? "").trim();
  if (!s) return NaN;
  const slash = s.indexOf("/");
  if (slash > 0) {
    const num = parseFloat(s.slice(0, slash));
    const den = parseFloat(s.slice(slash + 1));
    if (!isNaN(num) && !isNaN(den) && den !== 0) return num / den;
    return NaN;
  }
  return parseFloat(s);
}

export function parseInputValue(raw: string): number {
  const n = parseFraction(raw);
  return isFinite(n) ? n : NaN;
}

export function validateInputs(
  inputs: CalculatorInput[],
  values: Record<string, string>,
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const input of inputs) {
    if (input.type !== "number") continue;

    const raw = (values[input.id] ?? "").trim();
    if (!raw) continue;

    const n = parseFraction(raw);

    if (isNaN(n) || !isFinite(n)) {
      errors[input.id] = "Enter a valid number (e.g. 12 or 3/4)";
      continue;
    }
    if (n < 0 && (input.min === undefined || input.min >= 0)) {
      errors[input.id] = "Value cannot be negative";
      continue;
    }
    if (input.min !== undefined && n < input.min) {
      errors[input.id] =
        input.min === 0 ? "Must be 0 or greater" : `Must be \u2265 ${input.min}`;
      continue;
    }
    if (input.max !== undefined && n > input.max) {
      errors[input.id] = `Must be \u2264 ${input.max}`;
      continue;
    }
    if (input.integer && !Number.isInteger(n)) {
      errors[input.id] = "Must be a whole number";
    }
  }

  return errors;
}

export function preProcessValues(
  values: Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(values)) {
    if (typeof v === "string" && v.includes("/")) {
      const n = parseFraction(v);
      out[k] = isNaN(n) ? v : String(n);
    } else {
      out[k] = v;
    }
  }
  return out;
}
