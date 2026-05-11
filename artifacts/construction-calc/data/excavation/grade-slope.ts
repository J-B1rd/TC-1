import type { Calculator } from "../types";

export const gradeSlope: Calculator = {
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
