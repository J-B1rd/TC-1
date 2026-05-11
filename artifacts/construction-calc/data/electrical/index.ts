import type { Trade } from "../types";
import { circuitLoad } from "./circuit-load";
import { voltageDrop } from "./voltage-drop";
import { wireGauge } from "./wire-gauge";
import { conduitFill } from "./conduit-fill";
import { motorAmpacity } from "./motor-ampacity";
import { threePhasePower } from "./three-phase-power";
import { boxFill } from "./box-fill";
import { serviceLoad } from "./service-load";
import { generatorSizing } from "./generator-sizing";
import { transformerKva } from "./transformer-kva";
import { groundingConductor } from "./grounding-conductor";
import { demandFactor } from "./demand-factor";
import { shortCircuitCurrent } from "./short-circuit";
import { evCharger } from "./ev-charger";
import { solarSizing } from "./solar-sizing";
import { recessedLightSpacing } from "./recessed-lights";

export {
  circuitLoad, voltageDrop, wireGauge, conduitFill, motorAmpacity, threePhasePower,
  boxFill, serviceLoad, generatorSizing, transformerKva, groundingConductor, demandFactor,
  shortCircuitCurrent, evCharger, solarSizing, recessedLightSpacing,
};

export const electricalTrade: Trade = {
  id: "electrical",
  name: "Electrical",
  color: "#D97706",
  icon: "zap",
  calculators: [
    circuitLoad, voltageDrop, wireGauge, conduitFill, motorAmpacity, threePhasePower,
    boxFill, serviceLoad, generatorSizing, transformerKva, groundingConductor, demandFactor,
    shortCircuitCurrent, evCharger, solarSizing, recessedLightSpacing,
  ],
};
