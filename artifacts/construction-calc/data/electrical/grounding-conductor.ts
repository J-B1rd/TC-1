import type { Calculator } from "../types";

export const groundingConductor: Calculator = {
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
    if (electrode === "rod" && ["1/0 AWG","2/0 AWG","3/0 AWG"].includes(cu)) cu = "6 AWG";
    if (electrode === "ufer" && ["2/0 AWG","3/0 AWG"].includes(cu)) cu = "4 AWG";
    return [
      { label: "GEC — Copper", value: 0, unit: cu, highlight: true },
      { label: "GEC — Aluminum", value: 0, unit: al },
      { label: "Service Size", value: a, unit: "A" },
    ];
  },
};
