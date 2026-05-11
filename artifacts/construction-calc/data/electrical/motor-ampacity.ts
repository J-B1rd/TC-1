import type { Calculator } from "../types";

export const motorAmpacity: Calculator = {
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
    const efficiency = 0.85;
    const pf = 0.85;
    let fla: number;
    if (isThree) {
      fla = (hp * 746) / (Math.sqrt(3) * v * efficiency * pf);
    } else {
      fla = (hp * 746) / (v * efficiency * pf);
    }
    const conductorAmps = fla * 1.25;
    const breakerAmps = fla * 2.5;
    let wireGaugeSz = "4/0 AWG";
    if (conductorAmps <= 15) wireGaugeSz = "14 AWG";
    else if (conductorAmps <= 20) wireGaugeSz = "12 AWG";
    else if (conductorAmps <= 30) wireGaugeSz = "10 AWG";
    else if (conductorAmps <= 40) wireGaugeSz = "8 AWG";
    else if (conductorAmps <= 55) wireGaugeSz = "6 AWG";
    else if (conductorAmps <= 70) wireGaugeSz = "4 AWG";
    else if (conductorAmps <= 95) wireGaugeSz = "3 AWG";
    else if (conductorAmps <= 110) wireGaugeSz = "2 AWG";
    else if (conductorAmps <= 130) wireGaugeSz = "1 AWG";
    else if (conductorAmps <= 150) wireGaugeSz = "1/0 AWG";
    else if (conductorAmps <= 175) wireGaugeSz = "2/0 AWG";
    else if (conductorAmps <= 200) wireGaugeSz = "3/0 AWG";
    let breaker = 15;
    const bSizes = [15,20,25,30,35,40,45,50,60,70,80,90,100,110,125,150,175,200,225,250,300,350,400];
    for (const b of bSizes) { if (b >= breakerAmps) { breaker = b; break; } else { breaker = b; } }
    return [
      { label: "Full-Load Amps (FLA)", value: Math.round(fla * 100) / 100, unit: "A", highlight: true },
      { label: "Min Conductor (125%)", value: Math.round(conductorAmps * 10) / 10, unit: "A" },
      { label: "Conductor Size (Cu)", value: 0, unit: wireGaugeSz },
      { label: "Max Breaker (250%)", value: breaker, unit: "A" },
    ];
  },
};
