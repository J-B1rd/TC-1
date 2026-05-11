import type { Calculator } from "../types";

export const shortCircuitCurrent: Calculator = {
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
    const Zc = (ohmsPerKft * length * 2) / 1000;
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
