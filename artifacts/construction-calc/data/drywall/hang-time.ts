import type { Calculator } from "../types";

export const drywallLiftRental: Calculator = {
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
    const hangHrs = (wallSheets * 6 + ceilSheets * 15) / 60;
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
