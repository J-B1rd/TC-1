export type ReferenceTable = {
  headers: [string, string];
  rows: [string, string][];
};

export type ReferenceItem = {
  title: string;
  icon: string;
  bullets?: string[];
  table?: ReferenceTable;
};

const concrete: ReferenceItem[] = [
  {
    title: "Concrete Mix Design",
    icon: "sliders",
    table: {
      headers: ["Strength / Use", "Mix Ratio (cement:sand:gravel)"],
      rows: [
        ["2500 PSI — footings, slabs", "1 : 3 : 3"],
        ["3000 PSI — driveways, floors", "1 : 2.5 : 2.5"],
        ["3500 PSI — structural columns", "1 : 2 : 2"],
        ["4000 PSI — high-load/commercial", "1 : 1.5 : 1.5"],
        ["Water/Cement Ratio (target)", "0.40 – 0.50 by weight"],
        ["Slump — general flatwork", "3 – 5 in"],
        ["Slump — pumped concrete", "5 – 7 in"],
      ],
    },
  },
  {
    title: "Slab Thickness by Application",
    icon: "layers",
    table: {
      headers: ["Application", "Min Thickness"],
      rows: [
        ["Residential sidewalk", "4 in"],
        ["Residential driveway", "4 – 5 in"],
        ["Garage floor", "4 in (6 in w/ heavy vehicles)"],
        ["Basement floor slab", "4 in"],
        ["Exterior patio", "4 in"],
        ["Commercial floor", "5 – 6 in"],
        ["Footing (1-story)", "6 – 8 in"],
        ["Footing (2-story)", "10 – 12 in"],
      ],
    },
  },
  {
    title: "Temperature & Curing Rules",
    icon: "thermometer",
    bullets: [
      "Do not pour below 40°F without cold-weather protection",
      "Do not pour above 90°F without hot-weather additives/ice",
      "Keep concrete above 50°F for at least 3 days after pour",
      "Cure time: 70% strength at 7 days, 99% at 28 days (standard)",
      "Use burlap or plastic sheeting to retain moisture during cure",
      "Do not apply loads for at least 7 days (28 days for full design load)",
      "Reinforced slabs: add 1.5 in cover over rebar minimum",
    ],
  },
  {
    title: "Rebar Reference",
    icon: "grid",
    table: {
      headers: ["Bar #", "Diameter / Weight"],
      rows: [
        ["#3", "3/8 in — 0.376 lb/ft"],
        ["#4", "1/2 in — 0.668 lb/ft"],
        ["#5", "5/8 in — 1.043 lb/ft"],
        ["#6", "3/4 in — 1.502 lb/ft"],
        ["#7", "7/8 in — 2.044 lb/ft"],
        ["#8", "1 in — 2.670 lb/ft"],
        ["Min lap splice", "1.3 × development length (typ. 24× bar dia)"],
      ],
    },
  },
];

const framing: ReferenceItem[] = [
  {
    title: "Lumber — Nominal vs. Actual Sizes",
    icon: "box",
    table: {
      headers: ["Nominal Size", "Actual Size"],
      rows: [
        ["2×4", "1-1/2 × 3-1/2 in"],
        ["2×6", "1-1/2 × 5-1/2 in"],
        ["2×8", "1-1/2 × 7-1/4 in"],
        ["2×10", "1-1/2 × 9-1/4 in"],
        ["2×12", "1-1/2 × 11-1/4 in"],
        ["4×4 post", "3-1/2 × 3-1/2 in"],
        ["6×6 post", "5-1/2 × 5-1/2 in"],
        ["1×6 board", "3/4 × 5-1/2 in"],
      ],
    },
  },
  {
    title: "Standard Rough Opening Sizes",
    icon: "maximize",
    table: {
      headers: ["Door / Window", "Rough Opening (W × H)"],
      rows: [
        ["2/8 door (2-8 × 6-8)", "34 × 82-1/2 in"],
        ["3/0 door (3-0 × 6-8)", "38 × 82-1/2 in"],
        ["3/0 × 8-0 door", "38 × 98-1/2 in"],
        ["Garage door 9×7 ft", "110 × 85 in"],
        ["Garage door 16×7 ft", "194 × 85 in"],
        ["Egress window (IRC)", "Min 5.7 ft² net opening"],
        ["Window rough opening", "Nominal size + 2 in each direction"],
      ],
    },
  },
  {
    title: "Nail Schedule (Common Nails)",
    icon: "tool",
    table: {
      headers: ["Connection", "Fastener"],
      rows: [
        ["Stud to plate (toe nail)", "3 × 8d or 2 × 16d"],
        ["Double top plate lap", "8 × 16d at splice"],
        ["Header to king stud", "3 × 16d each end"],
        ["Joist to sill/beam (toe)", "3 × 8d"],
        ["Rim joist to joist", "3 × 16d"],
        ["Sheathing to studs", "8d @ 6 in edges / 12 in field"],
        ["Rafter to plate (toe)", "3 × 8d or hurricane tie"],
        ["LVL beam — consult MFR", "Per engineered spec"],
      ],
    },
  },
  {
    title: "Max Joist Spans (2× lumber, 40 psf live load)",
    icon: "minus",
    table: {
      headers: ["Joist Size @ Spacing", "Max Span (Douglas Fir #2)"],
      rows: [
        ["2×6 @ 12\" OC", "11-4"],
        ["2×6 @ 16\" OC", "10-4"],
        ["2×8 @ 12\" OC", "15-0"],
        ["2×8 @ 16\" OC", "13-7"],
        ["2×10 @ 12\" OC", "19-0"],
        ["2×10 @ 16\" OC", "17-2"],
        ["2×12 @ 12\" OC", "23-0"],
        ["2×12 @ 16\" OC", "20-10"],
      ],
    },
  },
  {
    title: "Stair Code Quick Reference (IRC)",
    icon: "arrow-up",
    bullets: [
      "Max riser height: 7-3/4 in",
      "Min tread depth: 10 in (nosing not included)",
      "Min stair width: 36 in (residential)",
      "Handrail height: 34 – 38 in above nosing",
      "Headroom clearance: 6 ft 8 in minimum",
      "Max variation between risers in same flight: 3/8 in",
      "Nosing projection: 3/4 – 1-1/4 in (if used)",
      "Guardrail required when deck ≥ 30 in above grade",
    ],
  },
];

const electrical: ReferenceItem[] = [
  {
    title: "THHN/THWN Copper Ampacity (75°C)",
    icon: "zap",
    table: {
      headers: ["Wire Gauge", "Ampacity @ 75°C (NEC 310.16)"],
      rows: [
        ["14 AWG", "20 A (15 A breaker max)"],
        ["12 AWG", "25 A (20 A breaker max)"],
        ["10 AWG", "35 A (30 A breaker max)"],
        ["8 AWG", "50 A"],
        ["6 AWG", "65 A"],
        ["4 AWG", "85 A"],
        ["3 AWG", "100 A"],
        ["2 AWG", "115 A"],
        ["1 AWG", "130 A"],
        ["1/0 AWG", "150 A"],
        ["2/0 AWG", "175 A"],
        ["3/0 AWG", "200 A"],
        ["4/0 AWG", "230 A"],
        ["250 kcmil", "255 A"],
        ["350 kcmil", "310 A"],
        ["500 kcmil", "380 A"],
      ],
    },
  },
  {
    title: "Wire Color Codes",
    icon: "git-branch",
    table: {
      headers: ["Function", "Color (NEC convention)"],
      rows: [
        ["Hot — 120V", "Black"],
        ["Hot — 120V (2nd)", "Red"],
        ["Neutral", "White or Gray"],
        ["Ground", "Green or Bare"],
        ["Hot — 277V", "Brown"],
        ["Hot — 277V (2nd)", "Orange"],
        ["Hot — 277V (3rd)", "Yellow"],
        ["Neutral — 480Y/277V", "Gray"],
        ["DC Positive", "Red or positive marking"],
        ["DC Negative", "Black or white w/ stripe"],
      ],
    },
  },
  {
    title: "GFCI & AFCI Requirements (NEC 2023)",
    icon: "shield",
    table: {
      headers: ["Location", "Protection Required"],
      rows: [
        ["Bathrooms", "GFCI"],
        ["Kitchens (countertop)", "GFCI"],
        ["Garages", "GFCI"],
        ["Outdoor receptacles", "GFCI"],
        ["Crawl spaces", "GFCI"],
        ["Unfinished basements", "GFCI"],
        ["Boathouses", "GFCI"],
        ["Bedrooms", "AFCI"],
        ["Living / Family rooms", "AFCI"],
        ["Hallways / Closets", "AFCI"],
        ["Dining rooms", "AFCI"],
        ["Kitchens (general)", "AFCI + GFCI combo"],
        ["Laundry rooms", "AFCI"],
      ],
    },
  },
  {
    title: "Standard Breaker & Outlet Sizing",
    icon: "cpu",
    table: {
      headers: ["Circuit / Outlet", "Breaker / Wire"],
      rows: [
        ["General lighting / outlets", "15 A / 14 AWG"],
        ["Kitchen small appliance", "20 A / 12 AWG (×2 required)"],
        ["Bathroom", "20 A / 12 AWG"],
        ["Clothes dryer (240V)", "30 A 2-pole / 10 AWG"],
        ["Electric range (240V)", "40–50 A 2-pole / 8–6 AWG"],
        ["Dishwasher", "20 A / 12 AWG dedicated"],
        ["Refrigerator", "20 A / 12 AWG dedicated"],
        ["Microwave", "20 A / 12 AWG dedicated"],
        ["Washer", "20 A / 12 AWG GFCI"],
        ["EV Charger Level 2", "40–50 A 2-pole / 8–6 AWG"],
        ["Water heater (electric)", "30 A 2-pole / 10 AWG"],
        ["A/C unit (varies)", "Per MFR nameplate"],
      ],
    },
  },
  {
    title: "Conduit Fill — Max Conductors",
    icon: "minus",
    table: {
      headers: ["Conduit (Trade Size)", "Max fill (40% rule)"],
      rows: [
        ["1/2\" EMT", "12 AWG × 3 (THHN), or 14 AWG × 4"],
        ["3/4\" EMT", "12 AWG × 6, or 10 AWG × 4"],
        ["1\" EMT", "12 AWG × 10, or 8 AWG × 5"],
        ["1-1/4\" EMT", "12 AWG × 18"],
        ["1-1/2\" EMT", "12 AWG × 26"],
        ["2\" EMT", "12 AWG × 45"],
        ["Rule of thumb", "NEC Annex C for exact fill tables"],
      ],
    },
  },
];

const plumbing: ReferenceItem[] = [
  {
    title: "Fixture Units (DFU) by Fixture",
    icon: "droplet",
    table: {
      headers: ["Fixture", "Drain Fixture Units (DFU)"],
      rows: [
        ["Lavatory (sink)", "1"],
        ["Kitchen sink", "2"],
        ["Bathtub", "2"],
        ["Shower stall", "2"],
        ["Toilet (gravity tank)", "3 (4 for flushometer)"],
        ["Dishwasher", "2"],
        ["Clothes washer", "2"],
        ["Floor drain (2\")", "2"],
        ["Utility / laundry sink", "3"],
        ["Service sink (mop)", "3"],
        ["Drinking fountain", "0.5"],
      ],
    },
  },
  {
    title: "Drain & Vent Pipe Sizing",
    icon: "arrow-down",
    table: {
      headers: ["Drain Size", "Max DFU / Use"],
      rows: [
        ["1-1/4\" trap arm", "1 DFU (lavatory only)"],
        ["1-1/2\" drain", "3 DFU"],
        ["2\" drain", "6 DFU — no toilets"],
        ["3\" drain", "20 DFU — 1 toilet max on branch"],
        ["4\" drain", "160 DFU — multiple toilets"],
        ["3\" vent stack", "Standard 1-bathroom home"],
        ["4\" main vent", "Multi-bath or large systems"],
        ["Trap arm — max length", "1-1/4\": 2.5 ft / 1-1/2\": 3.5 ft / 2\": 5 ft / 3\": 6 ft"],
      ],
    },
  },
  {
    title: "Common Rough-In Dimensions",
    icon: "maximize",
    table: {
      headers: ["Fixture", "Rough-In Dimension"],
      rows: [
        ["Toilet — floor flange", "12 in from finished wall (standard)"],
        ["Toilet — supply rough-in", "6 in AFF, 6 in to right of flange"],
        ["Lavatory drain height", "17 – 19 in AFF"],
        ["Lavatory supply", "21 in AFF"],
        ["Shower drain", "Center of stall"],
        ["Tub waste / overflow", "15 – 17 in AFF"],
        ["Kitchen sink drain", "16 – 20 in AFF"],
        ["Dishwasher supply", "Under sink cabinet"],
        ["Hose bib (exterior)", "12 – 18 in AFF"],
        ["Washing machine standpipe", "Min 18 in above trap"],
      ],
    },
  },
  {
    title: "Pipe Material Comparison",
    icon: "list",
    table: {
      headers: ["Material", "Best For / Notes"],
      rows: [
        ["PVC (white)", "DWV, cold supply — do not use for hot"],
        ["CPVC (cream/yellow)", "Hot & cold supply — rated to 180°F"],
        ["PEX (red/blue/white)", "Supply lines — flexible, freeze-resistant"],
        ["Copper (L & M type)", "Supply & refrigerant — premium/long life"],
        ["ABS (black)", "DWV — common in western US"],
        ["Cast iron", "DWV — soundproof, long life"],
        ["Galvanized steel", "Legacy supply — not recommended for new work"],
        ["HDPE", "Underground drain / force mains"],
      ],
    },
  },
  {
    title: "Drain Slope Requirements",
    icon: "trending-down",
    bullets: [
      "1/4 in per foot fall (2%) — required for 3 in and smaller drains (IRC P3005.3)",
      "1/8 in per foot fall (1%) — acceptable for 4 in and larger drains",
      "Steeper than 1/2 in per foot can cause liquid to outrun solids (self-siphoning)",
      "Horizontal drain arms: max 1/4 in/ft slope before vertical required",
      "All traps must be within accessible reach of a cleanout",
      "Every horizontal drain 4 in or larger needs a cleanout at upper end",
    ],
  },
];

const hvac: ReferenceItem[] = [
  {
    title: "Refrigerant Quick Reference",
    icon: "wind",
    table: {
      headers: ["Refrigerant", "Status / Use"],
      rows: [
        ["R-22 (Freon)", "Phased out — replacement stock only"],
        ["R-410A (Puron)", "Current residential standard"],
        ["R-32", "Next-gen — lower GWP than R-410A"],
        ["R-454B (Puron Advance)", "R-410A replacement (2025+)"],
        ["R-407C", "R-22 retrofit option"],
        ["R-134a", "Auto AC, small appliances"],
        ["R-600a (isobutane)", "Mini fridges — flammable"],
        ["R-290 (propane)", "Commercial refrigeration"],
      ],
    },
  },
  {
    title: "Thermostat Wire Colors (24V Control)",
    icon: "cpu",
    table: {
      headers: ["Wire Color", "Terminal / Function"],
      rows: [
        ["R (red)", "24V hot from transformer"],
        ["C (blue or black)", "Common — 24V return"],
        ["Y (yellow)", "Compressor / cooling"],
        ["Y2 (light blue)", "2nd stage cooling"],
        ["G (green)", "Fan — continuous"],
        ["W (white)", "Heat stage 1"],
        ["W2 (brown)", "Heat stage 2"],
        ["O (orange)", "Reversing valve — energized in cool"],
        ["B (dark blue)", "Reversing valve — energized in heat (Trane)"],
        ["E (gray)", "Emergency heat"],
        ["L", "Fault / service light"],
      ],
    },
  },
  {
    title: "MERV Filter Ratings",
    icon: "filter",
    table: {
      headers: ["MERV Rating", "Captures / Best For"],
      rows: [
        ["MERV 1–4", "Large dust, pollen — basic fiberglass"],
        ["MERV 5–8", "Mold spores, pet dander — standard pleated"],
        ["MERV 9–12", "Fine dust, lead, Legionella — better residential"],
        ["MERV 13–16", "Bacteria, smoke — hospital / HVAC premium"],
        ["MERV 17–20 (HEPA equiv.)", "Viruses, carbon — clean rooms"],
        ["Residential recommendation", "MERV 8–13 (don't over-filter small systems)"],
      ],
    },
  },
  {
    title: "Duct Velocity Limits",
    icon: "minus",
    table: {
      headers: ["Duct Location", "Max Velocity (FPM)"],
      rows: [
        ["Main supply trunk", "700 – 900 FPM"],
        ["Branch supply ducts", "500 – 700 FPM"],
        ["Return air ducts", "400 – 500 FPM"],
        ["Filter face velocity", "250 – 350 FPM"],
        ["Register / grille", "400 – 600 FPM"],
        ["Noise threshold", "> 800 FPM may be audible"],
      ],
    },
  },
  {
    title: "Equipment Efficiency Minimums",
    icon: "trending-up",
    table: {
      headers: ["Equipment", "Federal Minimum (2023+)"],
      rows: [
        ["Central AC (≤ 45K BTU)", "SEER2 14.3 (North) / 15.2 (South)"],
        ["Central AC (> 45K BTU)", "SEER2 13.8"],
        ["Air-source heat pump", "HSPF2 7.5 / SEER2 14.3"],
        ["Gas furnace (South)", "AFUE 80%"],
        ["Gas furnace (North)", "AFUE 90% (after 2023)"],
        ["Boiler (hot water gas)", "AFUE 84%"],
        ["Mini-split (ductless)", "SEER2 16+ recommended"],
      ],
    },
  },
];

const roofing: ReferenceItem[] = [
  {
    title: "Minimum Roof Slope by Material",
    icon: "trending-up",
    table: {
      headers: ["Roofing Material", "Minimum Pitch"],
      rows: [
        ["3-tab asphalt shingles", "2:12 (w/ underlayment), 4:12 (standard)"],
        ["Architectural shingles", "2:12 w/ ice & water, 4:12 standard"],
        ["Metal standing seam", "1:12 — 3:12"],
        ["Metal exposed fastener", "3:12"],
        ["EPDM rubber (flat)", "1/4:12 minimum"],
        ["TPO / PVC membrane", "1/4:12 minimum"],
        ["Cedar shake", "4:12 minimum"],
        ["Slate", "4:12 minimum"],
        ["Clay / concrete tile", "4:12 minimum"],
        ["Built-up (BUR) gravel", "1/4:12"],
      ],
    },
  },
  {
    title: "Shingle Installation Reference",
    icon: "layers",
    table: {
      headers: ["Item", "Standard Value"],
      rows: [
        ["Exposure (3-tab)", "5 in"],
        ["Exposure (architectural)", "5-5/8 in (varies by brand)"],
        ["Starter strip overhang", "3/4 in past drip edge"],
        ["Nails per 3-tab shingle", "4 (6 in high-wind zones)"],
        ["Nail placement (3-tab)", "1 in above cutouts"],
        ["Side lap", "6 in minimum"],
        ["Nail type", "Roofing nail, 11 gauge, 3/8 in head"],
        ["Nail length", "Min 3/4 in penetration into deck"],
        ["Hip & ridge shingles", "1 bundle per 33 LF"],
      ],
    },
  },
  {
    title: "Ice & Water Shield Requirements",
    icon: "cloud-snow",
    bullets: [
      "Required in areas where outside design temp ≤ 25°F (IRC R905.2.7)",
      "Apply from eave to 24 in inside exterior wall line",
      "In severe climates: extend to 36 in or more",
      "Also required in valleys (minimum 36 in wide)",
      "Required at roof penetrations (chimneys, skylights)",
      "Self-adhering modified bitumen — not standard felt",
      "Apply to clean, dry deck — overlap courses 6 in min",
      "Can double as air barrier when lapped and sealed at edges",
    ],
  },
  {
    title: "Roof Ventilation Requirements",
    icon: "wind",
    table: {
      headers: ["Method / Rule", "Requirement"],
      rows: [
        ["Net Free Area (NFA) ratio", "1/150 of attic floor area"],
        ["NFA with vapor barrier", "1/300 of attic floor area"],
        ["50/50 split rule", "Equal intake (soffit) and exhaust (ridge)"],
        ["Ridge vent NFA", "Approx 18 in² per LF of ridge vent"],
        ["Soffit vent NFA", "Approx 9–16 in² per linear foot"],
        ["Baffles required", "Yes — maintain 1 in airway above insulation"],
        ["Do not mix", "Ridge + gable vents — kills ridge vent draw"],
      ],
    },
  },
];

const masonry: ReferenceItem[] = [
  {
    title: "Mortar Type Chart",
    icon: "grid",
    table: {
      headers: ["Type", "Compressive Strength / Best Use"],
      rows: [
        ["Type M", "2500 PSI — below grade, retaining walls, driveways"],
        ["Type S", "1800 PSI — at/below grade, exterior, stone veneer"],
        ["Type N", "750 PSI — above grade exterior, interior, general use"],
        ["Type O", "350 PSI — non-load-bearing interior only"],
        ["Type K", "75 PSI — historic repointing only"],
        ["Pre-mixed (Type S or N)", "Check bag label for use / ratio"],
        ["Tuckpointing", "Match original — usually Type N or S"],
      ],
    },
  },
  {
    title: "Standard Brick & Block Sizes",
    icon: "layers",
    table: {
      headers: ["Unit", "Nominal Dims (W×H×L)"],
      rows: [
        ["Standard brick", "3-5/8 × 2-1/4 × 8 in (modular: 4×2-2/3×8)"],
        ["Jumbo brick", "3-5/8 × 2-3/4 × 8 in"],
        ["Engineer brick", "3-5/8 × 3-1/5 × 8 in"],
        ["CMU (standard)", "7-5/8 × 7-5/8 × 15-5/8 (nominal 8×8×16)"],
        ["CMU half block", "7-5/8 × 7-5/8 × 7-5/8"],
        ["CMU 4\" partition", "3-5/8 × 7-5/8 × 15-5/8"],
        ["CMU 12\"", "11-5/8 × 7-5/8 × 15-5/8"],
        ["Paver (standard)", "3-7/8 × 2-1/4 × 7-7/8 in"],
      ],
    },
  },
  {
    title: "Masonry Coverage Reference",
    icon: "square",
    table: {
      headers: ["Unit & Joint", "Units per 100 ft² of wall"],
      rows: [
        ["Standard brick, 3/8\" joint", "675 bricks"],
        ["Modular brick, 3/8\" joint", "616 bricks"],
        ["CMU 8×8×16, 3/8\" joint", "113 blocks"],
        ["CMU 8×4×16 (split face)", "225 blocks"],
        ["Mortar coverage (Type S)", "~7 bags / 100 ft² (standard brick)"],
        ["Grout — CMU cores filled", "0.085 ft³ per 8×16 block"],
      ],
    },
  },
  {
    title: "Lintel & Bond Beam Sizing",
    icon: "minus",
    bullets: [
      "Lintels must bear minimum 8 in on each side of opening",
      "CMU lintel block (U-block) filled with grout + rebar for spans up to 6 ft",
      "Steel angle lintel: L3×3×1/4 for spans to 4 ft, L4×3×5/16 for 4–6 ft",
      "Bond beam courses: every 4 ft of wall height in seismic zones",
      "Vertical rebar: max 48 in spacing in standard construction (check local codes)",
      "Control joints in CMU: every 20–25 ft horizontally",
    ],
  },
];

const painting: ReferenceItem[] = [
  {
    title: "Paint Sheen Selection Guide",
    icon: "edit-3",
    table: {
      headers: ["Sheen Level", "Best Use / Notes"],
      rows: [
        ["Flat / Matte", "Ceilings, low-traffic walls — hides imperfections"],
        ["Eggshell (10–25% sheen)", "Living rooms, bedrooms — washable, subtle"],
        ["Satin (26–40% sheen)", "Kitchens, baths, kids' rooms — durable"],
        ["Semi-Gloss (41–69%)", "Trim, doors, cabinets — moisture resistant"],
        ["High-Gloss (70%+)", "Cabinetry, furniture, accent trim — very durable"],
        ["Ceiling paint", "Flat, high-hide — less splattering"],
        ["Primer", "Always required on new drywall / bare wood"],
      ],
    },
  },
  {
    title: "Drying & Recoat Times",
    icon: "clock",
    table: {
      headers: ["Paint Type", "Touch Dry / Recoat / Full Cure"],
      rows: [
        ["Latex / Acrylic", "1 hr / 4 hr / 2–4 weeks"],
        ["Oil-Based", "6–8 hr / 24 hr / 7–14 days"],
        ["Alkyd (waterborne)", "4 hr / 16 hr / 3–7 days"],
        ["Chalk Paint", "1 hr / 1 hr / wax within 24 hr"],
        ["Epoxy floor coating", "8 hr touch / 24 hr foot / 72 hr vehicles"],
        ["Spray lacquer", "15 min / 1 hr / 24 hr"],
        ["Min temp to apply", "50°F for latex, 40°F for some exterior formulas"],
      ],
    },
  },
  {
    title: "Coverage Rates by Surface",
    icon: "layers",
    table: {
      headers: ["Surface Type", "Approx Coverage (gal)"],
      rows: [
        ["Smooth drywall (primed)", "400 ft²/gal"],
        ["Textured drywall", "300 – 350 ft²/gal"],
        ["Smooth wood / trim", "400 – 450 ft²/gal"],
        ["Rough wood / T1-11", "200 – 250 ft²/gal"],
        ["Brick / masonry", "75 – 150 ft²/gal (1st coat)"],
        ["Stucco (smooth)", "100 – 200 ft²/gal"],
        ["Metal (primed)", "400 – 450 ft²/gal"],
      ],
    },
  },
  {
    title: "Surface Prep Checklist",
    icon: "check-square",
    bullets: [
      "Fill all holes and cracks with spackle or caulk — let dry completely before painting",
      "Sand patched areas flush with 120-grit then 220-grit",
      "Wipe surfaces with TSP or sugar soap to remove grease and dirt",
      "Prime all new drywall, bare wood, and stain-prone areas",
      "Use stain-blocking primer (shellac or oil-based) over water stains",
      "Caulk all trim-to-wall gaps before painting trim",
      "Remove outlet covers and switch plates — never paint over them",
      "Temp: 50–90°F, humidity below 70% for best adhesion",
    ],
  },
];

const flooring: ReferenceItem[] = [
  {
    title: "Flooring Acclimation Requirements",
    icon: "clock",
    table: {
      headers: ["Flooring Type", "Acclimation / Conditions"],
      rows: [
        ["Solid hardwood", "3–5 days in room, HVAC running"],
        ["Engineered hardwood", "24–48 hrs in room"],
        ["Laminate", "48 hrs flat in room"],
        ["LVP / Vinyl plank", "24–48 hrs (less sensitive)"],
        ["Bamboo", "72 hrs in room"],
        ["Cork", "24 hrs"],
        ["Ceramic / Porcelain tile", "No acclimation needed"],
        ["Ideal temp / humidity", "60–80°F / 30–50% RH"],
      ],
    },
  },
  {
    title: "Expansion Gap Requirements",
    icon: "maximize",
    table: {
      headers: ["Flooring Type", "Expansion Gap at Walls"],
      rows: [
        ["Solid hardwood", "3/4 in minimum"],
        ["Engineered hardwood", "1/2 in minimum"],
        ["Laminate", "3/8 – 1/2 in"],
        ["LVP (floating)", "1/4 – 3/8 in"],
        ["LVP (glued)", "1/4 in at walls"],
        ["Tile (large format)", "1/16 in grout + movement joint"],
        ["Around posts / pipes", "1/2 in gap, fill with flexible sealant"],
      ],
    },
  },
  {
    title: "Grout Joint Size Guide",
    icon: "grid",
    table: {
      headers: ["Tile Size / Application", "Recommended Grout Joint"],
      rows: [
        ["Mosaic (< 2 in)", "1/16 – 1/8 in"],
        ["Small tile (2–8 in)", "3/16 in"],
        ["Standard (6–12 in)", "1/8 – 3/16 in"],
        ["Large format (12–24 in)", "1/8 – 3/16 in (rectified tile)"],
        ["Large format (non-rectified)", "3/16 – 3/8 in"],
        ["Natural stone", "1/8 – 1/4 in"],
        ["Subway tile (non-rectified)", "1/8 – 3/16 in"],
        ["Sanded grout (> 1/8 in joint)", "Recommend sanded"],
        ["Unsanded grout (< 1/8 in joint)", "Recommend unsanded"],
      ],
    },
  },
  {
    title: "Subfloor Flatness & Moisture",
    icon: "align-justify",
    bullets: [
      "Subfloor flatness: 3/16 in over 10 ft for most flooring (tile: 1/8 in over 10 ft)",
      "Use self-leveling compound to correct low spots > 3/16 in",
      "Wood subfloor moisture: max 12% MC for hardwood installation",
      "Concrete moisture: max 3 lbs per 1000 ft²/24 hr (ASTM F1869 test)",
      "Always use a vapor retarder on concrete slabs (6-mil poly or peel-and-stick)",
      "Minimum 18 in crawlspace clearance required for hardwood",
      "Do not install hardwood below grade (basement) — use engineered or LVP instead",
    ],
  },
];

const excavation: ReferenceItem[] = [
  {
    title: "OSHA Soil Classification & Slopes",
    icon: "trending-down",
    table: {
      headers: ["Soil Type", "Max Slope (H:V) & Description"],
      rows: [
        ["Type A (stable)", "3/4 : 1 — clay, dense/hard, no cracks"],
        ["Type B (moderate)", "1 : 1 — granular, angular, fissured"],
        ["Type C (weakest)", "1.5 : 1 — sandy, gravel, wet/loose"],
        ["Rock (solid)", "Vertical walls permitted"],
        ["Layered (worst governs)", "Use worst-layer classification"],
        ["< 5 ft depth", "Shoring may not be required (verify)"],
        ["> 5 ft depth", "Shoring or sloping REQUIRED (OSHA 1926.652)"],
        ["Daily inspection", "Competent person must inspect each shift"],
      ],
    },
  },
  {
    title: "Angle of Repose by Material",
    icon: "triangle",
    table: {
      headers: ["Material", "Angle of Repose"],
      rows: [
        ["Dry sand", "34°"],
        ["Moist sand", "40°"],
        ["Gravel (clean)", "35°"],
        ["Crushed stone", "38°"],
        ["Clay (dry)", "40°"],
        ["Clay (wet)", "15°"],
        ["Common earth (moist)", "30°"],
        ["Loose fill", "25–30°"],
      ],
    },
  },
  {
    title: "Equipment Production Rates (est.)",
    icon: "truck",
    table: {
      headers: ["Equipment", "Typical Production Rate"],
      rows: [
        ["Skid steer (grading)", "150 – 400 yd³/hr"],
        ["Mini excavator (0.5 yd³)", "60 – 100 yd³/hr"],
        ["Mid excavator (1 yd³)", "100 – 200 yd³/hr"],
        ["Backhoe (0.75 yd³ bucket)", "80 – 150 yd³/hr"],
        ["Bulldozer D6 (pushing)", "200 – 400 yd³/hr"],
        ["Dump truck (10 CY)", "6–8 loads/hr round-trip < 1 mile"],
        ["Plate compactor", "500 – 1500 ft²/hr (2-pass)"],
        ["Vibratory roller 5-ton", "3000 – 8000 ft²/hr"],
      ],
    },
  },
  {
    title: "Underground Utility Clearances",
    icon: "layers",
    bullets: [
      "Call 811 (USA) before any digging — 2–3 business days notice required",
      "Gas lines: 12 in clearance from other utilities (24 in preferred)",
      "Electrical (direct buried): 24 in minimum depth (12 in under concrete)",
      "Water main: 18 in separation from sewer, frost depth minimum cover",
      "Sewer (PVC): 12 in min depth, 12 in separation from water",
      "Telecommunications: 18 in depth (12 in in conduit)",
      "Irrigation: 12 in depth minimum",
      "Maintain 5 ft separation from any utility to excavation wall",
    ],
  },
];

const drywall: ReferenceItem[] = [
  {
    title: "Drywall Screw Spacing",
    icon: "tool",
    table: {
      headers: ["Location", "Screw Spacing"],
      rows: [
        ["Walls — edges", "8 in OC (max)"],
        ["Walls — field", "12 in OC (max)"],
        ["Ceilings — edges", "7 in OC (max)"],
        ["Ceilings — field", "12 in OC (max)"],
        ["From edge of board", "Min 3/8 in, max 16 in from edge"],
        ["Screw type (wood framing)", "Bugle head drywall screw — Type W"],
        ["Screw type (metal stud)", "Bugle head drywall screw — Type S"],
        ["Screw length — 1/2\" board", "1-1/4 in (wood) / 1 in (metal)"],
        ["Screw length — 5/8\" board", "1-5/8 in (wood) / 1-1/4 in (metal)"],
      ],
    },
  },
  {
    title: "Drywall Thickness by Application",
    icon: "layers",
    table: {
      headers: ["Application", "Thickness"],
      rows: [
        ["Standard walls (16\" OC framing)", "1/2 in"],
        ["Standard walls (24\" OC framing)", "5/8 in"],
        ["Ceilings (16\" OC)", "1/2 in (sag-resistant recommended)"],
        ["Ceilings (24\" OC)", "5/8 in — use sag-resistant"],
        ["Garage ceiling (fire)", "5/8 in Type X"],
        ["Garage wall shared w/ house", "1/2 in Type X (1-hr assembly)"],
        ["Shaft walls / elevator", "1 in or double 5/8\""],
        ["Curved walls", "1/4 in (dry-bent) or 3/8 in"],
      ],
    },
  },
  {
    title: "Fire-Rated Drywall Assemblies",
    icon: "shield",
    table: {
      headers: ["Assembly", "Fire Rating"],
      rows: [
        ["1 layer 5/8\" Type X (metal studs)", "1 hour"],
        ["1 layer 5/8\" Type X (wood studs)", "1 hour"],
        ["2 layers 5/8\" Type X (metal studs)", "2 hour"],
        ["2 layers 1/2\" Type X (wood studs)", "1 hour"],
        ["2 layers 5/8\" Type X (wood studs)", "2 hour"],
        ["Garage ceiling (fire)", "Min 1 layer 5/8\" Type X"],
        ["Garage shared wall", "1 layer 1/2\" Type X"],
      ],
    },
  },
  {
    title: "Joint Compound (Mud) Types",
    icon: "edit-3",
    table: {
      headers: ["Type", "Best Use / Notes"],
      rows: [
        ["All-Purpose (blue/green lid)", "Taping coat, general use — slow dry"],
        ["Lightweight All-Purpose", "Easier sanding — most common"],
        ["Topping Compound (blue)", "Final coat — very smooth finish"],
        ["Taping Compound", "Embedding tape — strong, cracks less"],
        ["Setting Compound (hot mud)", "20/45/90 min — does not shrink, structural"],
        ["Pre-mixed Topping", "Skim coat, texture — thin consistency"],
        ["Primer (before paint)", "PVA drywall primer — seals new board"],
      ],
    },
  },
  {
    title: "Level 5 Finish Checklist",
    icon: "check-square",
    bullets: [
      "Level 0: Drywall hung, no finishing",
      "Level 1: Tape embedded in joint compound (fire-rated assemblies)",
      "Level 2: Tape + 1 coat over fasteners (tile substrate)",
      "Level 3: Tape + 2 coats, all fasteners coated (texture finish)",
      "Level 4: Tape + 3 coats — standard finish for paint",
      "Level 5: Level 4 + skim coat over entire surface — critical lighting areas",
      "Always apply PVA primer after Level 4 or 5 before topcoat",
    ],
  },
];

const insulation: ReferenceItem[] = [
  {
    title: "R-Value Requirements by Climate Zone",
    icon: "thermometer",
    table: {
      headers: ["Climate Zone (IECC)", "Attic / Wall / Floor / Crawl"],
      rows: [
        ["Zone 1 (Hot — HI, S. FL)", "R-30 / R-13 / R-13 / R-13"],
        ["Zone 2 (Hot — TX, FL, AZ)", "R-38 / R-13 / R-13 / R-13"],
        ["Zone 3 (Mixed hot)", "R-38 / R-20 / R-19 / R-19"],
        ["Zone 4 (Mixed — VA, KY, NM)", "R-49 / R-20+5ci / R-19 / R-19"],
        ["Zone 5 (Cool — IL, OH, PA)", "R-49 / R-20+5ci / R-30 / R-30"],
        ["Zone 6 (Cold — MN, WI, MT)", "R-49 / R-20+5ci / R-30 / R-30"],
        ["Zone 7 (Very Cold — AK North)", "R-60 / R-21+12ci / R-38 / R-38"],
        ["Zone 8 (Subarctic — AK extreme)", "R-60 / R-21+21ci / R-38 / R-38"],
      ],
    },
  },
  {
    title: "R-Value of Common Materials",
    icon: "layers",
    table: {
      headers: ["Material", "R-Value per Inch"],
      rows: [
        ["Fiberglass batt", "R-2.9 – R-3.8/in"],
        ["Mineral wool / Rockwool batt", "R-3.0 – R-3.3/in"],
        ["Cellulose (blown)", "R-3.2 – R-3.7/in"],
        ["Open-cell spray foam", "R-3.5 – R-3.8/in"],
        ["Closed-cell spray foam", "R-6.0 – R-7.0/in"],
        ["EPS rigid foam", "R-3.6 – R-4.0/in"],
        ["XPS rigid foam (blue/pink)", "R-5.0/in"],
        ["Polyiso rigid foam", "R-5.6 – R-6.5/in (aged)"],
        ["Structural lumber", "R-1.25/in"],
        ["Concrete (8\" CMU)", "R-1.1 total"],
        ["1/2\" drywall", "R-0.45 total"],
      ],
    },
  },
  {
    title: "Vapor Barrier & Air Barrier",
    icon: "shield",
    table: {
      headers: ["Climate Zone", "Vapor Retarder Class Required"],
      rows: [
        ["Zones 1–3 (hot/mixed)", "No vapor retarder required on walls"],
        ["Zone 4 (marine)", "Class II (kraft-faced batts OK)"],
        ["Zones 5–8 (cold)", "Class I or II on warm-in-winter side"],
        ["Class I", "≤ 0.1 perm — polyethylene, foil face"],
        ["Class II", "0.1–1.0 perm — kraft paper, vapor paint"],
        ["Class III", "1–10 perm — latex paint (w/ CI foam)"],
        ["Air barrier (all zones)", "< 0.004 cfm/ft² @ 0.3 in w.g."],
        ["Remember", "Vapor barrier ≠ air barrier; both needed"],
      ],
    },
  },
  {
    title: "Spray Foam Tips",
    icon: "wind",
    bullets: [
      "Always wear full PPE — N100 respirator, gloves, Tyvek suit",
      "Substrate temp must be 40–90°F for proper adhesion and cure",
      "Never exceed manufacturer max thickness per pass (usually 2 in for CC)",
      "Open-cell: great air seal, allows vapor to dry — not a vapor barrier",
      "Closed-cell: vapor barrier at 2 in+, structural reinforcement, moisture resistant",
      "Protect finished surfaces — uncured foam is very difficult to remove",
      "Trim flush after cure and before drywall — fire hazard if exposed",
      "Shelf life of 2-part kits is typically 12 months; check expiration",
    ],
  },
];

const landscaping: ReferenceItem[] = [
  {
    title: "Mulch Depth by Application",
    icon: "layers",
    table: {
      headers: ["Application", "Recommended Depth"],
      rows: [
        ["General ornamental beds", "2 – 3 in"],
        ["New planting beds", "3 – 4 in"],
        ["Weed suppression (max)", "4 in (deeper = root suffocation)"],
        ["Around trees (no volcano)", "2 – 4 in, keep 6 in from trunk"],
        ["Pathways (wood chip)", "4 – 6 in"],
        ["Erosion control on slopes", "4 in with erosion fabric"],
        ["Playground cushion (wood)", "9 – 12 in (ASTM safety)"],
        ["Annual refresh", "Add 1 in when depth drops below 2 in"],
      ],
    },
  },
  {
    title: "Retaining Wall Rules of Thumb",
    icon: "trending-up",
    bullets: [
      "Walls > 4 ft (measured from base) typically require a structural engineer and permit",
      "Set first course 6 in below grade for stability",
      "Batter (lean) wall back 1 in per 1 ft of height (setback per block specs)",
      "Install 3/4 in crushed stone drainage directly behind wall",
      "Perforated drain pipe at base of wall, daylight at ends",
      "Geogrid reinforcement required for most walls over 3 ft",
      "Deadman anchors: every other course, every 6–8 ft horizontally for taller walls",
      "Cap blocks glued with concrete adhesive for finish",
    ],
  },
  {
    title: "Lawn Establishment Guide",
    icon: "sun",
    table: {
      headers: ["Grass Type / Region", "Seed Rate / Season / Notes"],
      rows: [
        ["Kentucky Bluegrass (cool)", "2–3 lb/1000 ft² — Aug–Sep"],
        ["Tall Fescue (cool)", "5–8 lb/1000 ft² — Aug–Oct or Mar–Apr"],
        ["Ryegrass (cool, quick)", "8–10 lb/1000 ft² — Sep–Oct"],
        ["Bermuda (warm)", "1–2 lb/1000 ft² — May–Jul"],
        ["Zoysia (warm)", "0.5–1 lb/1000 ft² — May–Jul (plugs common)"],
        ["St. Augustine (warm)", "Sod/plugs only — Jun–Aug"],
        ["Overseeding rate", "Half of new lawn rate"],
        ["Starter fertilizer", "Apply at seeding — 5-10-5 or similar"],
      ],
    },
  },
  {
    title: "Soil Amendment Reference",
    icon: "sun",
    table: {
      headers: ["Amendment", "Rate & Purpose"],
      rows: [
        ["Compost", "2–4 in tilled in — all soil types, best all-around"],
        ["Lime (agricultural)", "50 lb/1000 ft² to raise pH 1 point"],
        ["Sulfur (elemental)", "10 lb/1000 ft² to lower pH 0.5 point"],
        ["Gypsum", "40 lb/1000 ft² — breaks up clay, no pH change"],
        ["Sand (in clay)", "Use sparingly — needs 50%+ to help (not a little)"],
        ["Perlite / pumice", "1:4 ratio with soil — improves drainage"],
        ["Soil test first", "County extension office — free or low cost"],
      ],
    },
  },
];

export const tradeReferences: Record<string, ReferenceItem[]> = {
  concrete,
  framing,
  electrical,
  plumbing,
  hvac,
  roofing,
  masonry,
  painting,
  flooring,
  excavation,
  drywall,
  insulation,
  landscaping,
};
