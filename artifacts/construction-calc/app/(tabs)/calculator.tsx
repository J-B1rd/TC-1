import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

// ─── Helpers ────────────────────────────────────────────────────────────────

function inchesToFtIn(totalInches: number): string {
  const negative = totalInches < 0;
  const absIn = Math.abs(totalInches);
  const ft = Math.floor(absIn / 12);
  const remainIn = absIn % 12;
  const wholeIn = Math.floor(remainIn);
  const fracDec = remainIn - wholeIn;
  const fracs: [number, string][] = [
    [0, ""], [1/16,"¹⁄₁₆"], [1/8,"⅛"], [3/16,"³⁄₁₆"], [1/4,"¼"],
    [5/16,"⁵⁄₁₆"], [3/8,"⅜"], [7/16,"⁷⁄₁₆"], [1/2,"½"], [9/16,"⁹⁄₁₆"],
    [5/8,"⅝"], [11/16,"¹¹⁄₁₆"], [3/4,"¾"], [13/16,"¹³⁄₁₆"], [7/8,"⅞"], [15/16,"¹⁵⁄₁₆"],
  ];
  let closest = fracs[0];
  let minDiff = Math.abs(fracDec - fracs[0][0]);
  for (const f of fracs) {
    const diff = Math.abs(fracDec - f[0]);
    if (diff < minDiff) { minDiff = diff; closest = f; }
  }
  let displayIn = wholeIn;
  let displayFrac = closest[1];
  if (closest[0] >= 1 - 0.001) { displayIn += 1; displayFrac = ""; }
  let displayFt = ft;
  if (displayIn >= 12) { displayFt += 1; displayIn = 0; }
  const sign = negative ? "-" : "";
  if (displayFt === 0 && displayIn === 0 && !displayFrac) return `${sign}0"`;
  if (displayFt === 0) return `${sign}${displayIn}${displayFrac ? " "+displayFrac : ""}"`;
  if (displayIn === 0 && !displayFrac) return `${sign}${displayFt}'`;
  return `${sign}${displayFt}' ${displayIn}${displayFrac ? " "+displayFrac : ""}"`;
}

function ftInToInches(ft: number, inches: number, fracVal: number): number {
  return ft * 12 + inches + fracVal;
}

function formatNumber(n: number): string {
  if (!isFinite(n)) return "Error";
  return parseFloat(n.toPrecision(10)).toString();
}

type Mode = "standard" | "construction";
interface HistoryItem { expr: string; result: string; }
interface ConstInput { feet: string; inches: string; frac: number; fracLabel: string; }
function emptyConst(): ConstInput { return { feet: "", inches: "", frac: 0, fracLabel: "" }; }

const FRACTIONS = [
  { label: "¼", val: 1/4 }, { label: "½", val: 1/2 }, { label: "¾", val: 3/4 },
  { label: "⅛", val: 1/8 }, { label: "⅜", val: 3/8 }, { label: "⅝", val: 5/8 },
  { label: "⅞", val: 7/8 }, { label: "¹⁄₁₆", val: 1/16 }, { label: "³⁄₁₆", val: 3/16 },
];

// ─── Button ──────────────────────────────────────────────────────────────────

function Btn({
  label, onPress, variant, accent, sm,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "op" | "action" | "accent";
  accent?: string;
  sm?: boolean;
}) {
  const colors = useColors();
  const dark = useColorScheme() === "dark";
  const bg =
    variant === "primary" ? colors.primary :
    variant === "op"      ? (dark ? "#2A2A3A" : "#E2E2EC") :
    variant === "action"  ? (dark ? "#3A3A3C" : "#D1D5DB") :
    variant === "accent" && accent ? accent + "22" :
    colors.card;
  const tc =
    variant === "primary" ? "#fff" :
    variant === "op"      ? colors.primary :
    variant === "accent" && accent ? accent :
    colors.foreground;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, opacity: pressed ? 0.6 : 1,
          transform: [{ scale: pressed ? 0.93 : 1 }] },
      ]}
    >
      <Text style={[styles.btnTxt, sm && { fontSize: 15 }, { color: tc }]}>
        {label}
      </Text>
    </Pressable>
  );
}

// ─── Standard ────────────────────────────────────────────────────────────────

function Standard({ onHistory }: { onHistory: (h: HistoryItem) => void }) {
  const colors = useColors();
  const [display, setDisplay] = useState("0");
  const [expr, setExpr] = useState("");
  const [pendingOp, setPendingOp] = useState<string | null>(null);
  const [pendingVal, setPendingVal] = useState<number | null>(null);
  const [justCalc, setJustCalc] = useState(false);

  const digit = (d: string) => {
    if (justCalc) { setDisplay(d); setExpr(""); setJustCalc(false); return; }
    setDisplay(p => p === "0" ? d : p.length < 14 ? p + d : p);
  };
  const dot = () => {
    if (justCalc) { setDisplay("0."); setJustCalc(false); return; }
    if (!display.includes(".")) setDisplay(d => d + ".");
  };
  const apply = (a: number, b: number, op: string) =>
    op === "+" ? a+b : op === "-" ? a-b : op === "×" ? a*b :
    op === "÷" ? (b !== 0 ? a/b : NaN) : op === "%" ? (a*b)/100 : b;

  const op = (o: string) => {
    const cur = parseFloat(display);
    if (pendingOp && pendingVal !== null && !justCalc) {
      const res = apply(pendingVal, cur, pendingOp);
      setDisplay(formatNumber(res)); setExpr(`${formatNumber(res)} ${o}`); setPendingVal(res);
    } else { setExpr(`${display} ${o}`); setPendingVal(cur); }
    setPendingOp(o); setJustCalc(true);
  };
  const equals = () => {
    if (!pendingOp || pendingVal === null) return;
    const cur = parseFloat(display);
    const res = apply(pendingVal, cur, pendingOp);
    const rs = formatNumber(res);
    onHistory({ expr: `${expr} ${display} =`, result: rs });
    setDisplay(rs); setExpr(`${expr} ${display} =`);
    setPendingOp(null); setPendingVal(null); setJustCalc(true);
  };
  const clear = () => { setDisplay("0"); setExpr(""); setPendingOp(null); setPendingVal(null); setJustCalc(false); };
  const back = () => { if (justCalc) return; setDisplay(d => d.length > 1 ? d.slice(0,-1) : "0"); };
  const pct = () => setDisplay(formatNumber(parseFloat(display)/100));
  const pm = () => setDisplay(d => d.startsWith("-") ? d.slice(1) : "-"+d);

  return (
    <View style={{ flex: 1 }}>
      {/* Display */}
      <View style={[styles.display, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.exprTxt, { color: colors.mutedForeground }]} numberOfLines={1}>
          {expr || " "}
        </Text>
        <Text style={[styles.displayTxt, { color: colors.foreground }]} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>

      {/* Grid — flex:1 so it fills all remaining space */}
      <View style={styles.grid}>
        <View style={styles.row}>
          <Btn label="C"   onPress={clear} variant="action" />
          <Btn label="+/-" onPress={pm}    variant="action" />
          <Btn label="%"   onPress={pct}   variant="action" />
          <Btn label="÷"   onPress={() => op("÷")} variant="op" />
        </View>
        <View style={styles.row}>
          <Btn label="7" onPress={() => digit("7")} />
          <Btn label="8" onPress={() => digit("8")} />
          <Btn label="9" onPress={() => digit("9")} />
          <Btn label="×" onPress={() => op("×")} variant="op" />
        </View>
        <View style={styles.row}>
          <Btn label="4" onPress={() => digit("4")} />
          <Btn label="5" onPress={() => digit("5")} />
          <Btn label="6" onPress={() => digit("6")} />
          <Btn label="−" onPress={() => op("-")} variant="op" />
        </View>
        <View style={styles.row}>
          <Btn label="1" onPress={() => digit("1")} />
          <Btn label="2" onPress={() => digit("2")} />
          <Btn label="3" onPress={() => digit("3")} />
          <Btn label="+" onPress={() => op("+")} variant="op" />
        </View>
        <View style={styles.row}>
          <Btn label="⌫" onPress={back} variant="action" />
          <Btn label="0" onPress={() => digit("0")} />
          <Btn label="." onPress={dot} />
          <Btn label="=" onPress={equals} variant="primary" />
        </View>
      </View>
    </View>
  );
}

// ─── Construction ─────────────────────────────────────────────────────────────

function Construction({ onHistory }: { onHistory: (h: HistoryItem) => void }) {
  const colors = useColors();
  const orange = "#D97706";
  const [entry, setEntry] = useState<ConstInput>(emptyConst());
  const [active, setActive] = useState<"feet"|"inches">("feet");
  const [pendingOp, setPendingOp] = useState<string|null>(null);
  const [pendingIn, setPendingIn] = useState<number|null>(null);
  const [resultIn, setResultIn] = useState<number|null>(null);
  const [expr, setExpr] = useState("");
  const [justCalc, setJustCalc] = useState(false);

  const entryInches = ftInToInches(
    parseFloat(entry.feet||"0"), parseFloat(entry.inches||"0"), entry.frac
  );
  const displayStr = (() => {
    if (resultIn !== null && justCalc) return inchesToFtIn(resultIn);
    const ft = parseInt(entry.feet||"0");
    const ins = parseInt(entry.inches||"0");
    const frac = entry.fracLabel;
    if (ft===0 && ins===0 && !frac) return '0"';
    if (ft===0) return `${ins}${frac?" "+frac:""}"`;
    if (ins===0 && !frac) return `${ft}'`;
    return `${ft}' ${ins}${frac?" "+frac:""}"`; 
  })();

  const digit = (d: string) => {
    if (justCalc) {
      setEntry({ ...emptyConst(), [active]: d });
      setResultIn(null); setJustCalc(false); return;
    }
    setEntry(e => { const cur = e[active] as string; return { ...e, [active]: cur===''||cur==='0'?d:cur+d }; });
  };
  const frac = (val: number, label: string) => {
    if (justCalc) { setEntry({ ...emptyConst(), frac: val, fracLabel: label }); setResultIn(null); setJustCalc(false); return; }
    setEntry(e => ({ ...e, frac: val, fracLabel: label }));
  };
  const applyOp = (a: number, b: number, o: string) =>
    o==="+" ? a+b : o==="-" ? a-b : o==="×" ? a*b : o==="÷" && b!==0 ? a/b : 0;

  const doOp = (o: string) => {
    if (justCalc && resultIn !== null) {
      setPendingIn(resultIn); setExpr(`${inchesToFtIn(resultIn)} ${o}`);
      setPendingOp(o); setJustCalc(false); setEntry(emptyConst()); setResultIn(null); return;
    }
    const cur = entryInches;
    if (pendingOp && pendingIn !== null) {
      const res = applyOp(pendingIn, cur, pendingOp);
      setResultIn(res); setExpr(`${inchesToFtIn(res)} ${o}`); setPendingIn(res);
    } else { setExpr(`${inchesToFtIn(cur)} ${o}`); setPendingIn(cur); }
    setPendingOp(o); setJustCalc(true); setEntry(emptyConst());
  };
  const equals = () => {
    if (!pendingOp || pendingIn===null) return;
    const cur = entryInches;
    const res = applyOp(pendingIn, cur, pendingOp);
    onHistory({ expr: `${expr} ${inchesToFtIn(cur)} =`, result: inchesToFtIn(res) });
    setResultIn(res); setExpr(`${expr} ${inchesToFtIn(cur)} =`);
    setPendingOp(null); setPendingIn(null); setJustCalc(true); setEntry(emptyConst());
  };
  const clear = () => { setEntry(emptyConst()); setPendingOp(null); setPendingIn(null); setResultIn(null); setExpr(""); setJustCalc(false); setActive("feet"); };
  const back = () => { if (justCalc) return; setEntry(e => { const cur = e[active] as string; return { ...e, [active]: cur.length>1?cur.slice(0,-1):"" }; }); };
  const decFt = () => {
    const total = justCalc && resultIn!==null ? resultIn : entryInches;
    const df = (total/12).toFixed(4);
    onHistory({ expr: `${inchesToFtIn(total)} → dec ft`, result: `${df} ft` });
    setExpr(`${inchesToFtIn(total)} = ${df} ft`);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Display */}
      <View style={[styles.display, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.exprTxt, { color: colors.mutedForeground }]} numberOfLines={1}>
          {expr || " "}
        </Text>
        <Text style={[styles.displayTxt, { color: colors.foreground }]} adjustsFontSizeToFit numberOfLines={1}>
          {displayStr}
        </Text>
        {/* ft / in toggle */}
        <View style={styles.fieldToggleRow}>
          {(["feet","inches"] as const).map(f => (
            <Pressable
              key={f}
              onPress={() => { setActive(f); if (justCalc) { setResultIn(null); setJustCalc(false); } }}
              style={[styles.fieldToggle, {
                backgroundColor: active===f ? orange+"22" : colors.background,
                borderColor: active===f ? orange : colors.border,
              }]}
            >
              <Text style={[styles.fieldToggleTxt, { color: active===f ? orange : colors.mutedForeground }]}>
                {f === "feet" ? "ft" : "in"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Fraction row — compact single line */}
      <View style={[styles.fracRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {FRACTIONS.map(f => (
          <Pressable
            key={f.label}
            onPress={() => frac(f.val, f.label)}
            style={[styles.fracChip, {
              backgroundColor: entry.fracLabel===f.label ? orange+"20" : colors.background,
              borderColor: entry.fracLabel===f.label ? orange : colors.border,
            }]}
          >
            <Text style={[styles.fracChipTxt, { color: entry.fracLabel===f.label ? orange : colors.foreground }]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
        <Pressable
          onPress={() => frac(0,"")}
          style={[styles.fracChip, {
            backgroundColor: entry.frac===0&&entry.fracLabel==="" ? orange+"20" : colors.background,
            borderColor: entry.frac===0&&entry.fracLabel==="" ? orange : colors.border,
          }]}
        >
          <Text style={[styles.fracChipTxt, { color: entry.frac===0&&entry.fracLabel==="" ? orange : colors.mutedForeground }]}>0</Text>
        </Pressable>
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        <View style={styles.row}>
          <Btn label="C"      onPress={clear} variant="action" />
          <Btn label="⌫"      onPress={back}  variant="action" />
          <Btn label="dec ft" onPress={decFt} variant="action" sm />
          <Btn label="÷"      onPress={() => doOp("÷")} variant="op" />
        </View>
        <View style={styles.row}>
          <Btn label="7" onPress={() => digit("7")} />
          <Btn label="8" onPress={() => digit("8")} />
          <Btn label="9" onPress={() => digit("9")} />
          <Btn label="×" onPress={() => doOp("×")} variant="op" />
        </View>
        <View style={styles.row}>
          <Btn label="4" onPress={() => digit("4")} />
          <Btn label="5" onPress={() => digit("5")} />
          <Btn label="6" onPress={() => digit("6")} />
          <Btn label="−" onPress={() => doOp("-")} variant="op" />
        </View>
        <View style={styles.row}>
          <Btn label="1" onPress={() => digit("1")} />
          <Btn label="2" onPress={() => digit("2")} />
          <Btn label="3" onPress={() => digit("3")} />
          <Btn label="+" onPress={() => doOp("+")} variant="op" />
        </View>
        <View style={styles.row}>
          <Btn label="ft²" onPress={() => {
            if (pendingOp==="×" && pendingIn!==null) {
              const sqFt = (pendingIn * entryInches)/144;
              onHistory({ expr: `${inchesToFtIn(pendingIn)} × ${inchesToFtIn(entryInches)}`, result: `${sqFt.toFixed(2)} ft²` });
              setExpr(`= ${sqFt.toFixed(2)} ft²`); setJustCalc(true); setEntry(emptyConst()); setPendingOp(null); setPendingIn(null);
            }
          }} variant="accent" accent={orange} sm />
          <Btn label="0"  onPress={() => digit("0")} />
          <Btn label="00" onPress={() => { digit("0"); digit("0"); }} />
          <Btn label="="  onPress={equals} variant="primary" />
        </View>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CalculatorScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>("standard");
  const [stdHistory, setStdHistory] = useState<HistoryItem[]>([]);
  const [conHistory, setConHistory] = useState<HistoryItem[]>([]);

  const topPad = Platform.OS === "web" ? 16 : insets.top + 16;
  const bottomPad = Platform.OS === "web" ? 16 : insets.bottom + 8;
  const history = mode === "standard" ? stdHistory : conHistory;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Calculator</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {mode === "standard" ? "Standard" : "Feet & Inches"}
          </Text>
        </View>
        {/* Mode toggle */}
        <View style={[styles.toggle, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {(["standard","construction"] as Mode[]).map(m => (
            <Pressable
              key={m}
              onPress={() => setMode(m)}
              style={[styles.toggleBtn, mode===m && { backgroundColor: colors.primary }]}
            >
              <Feather name={m==="standard"?"hash":"tool"} size={13} color={mode===m?"#fff":colors.mutedForeground} />
              <Text style={[styles.toggleTxt, { color: mode===m?"#fff":colors.mutedForeground }]}>
                {m==="standard"?"Std":"Ft & In"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Last history line */}
      {history.length > 0 && (
        <View style={[styles.lastHistory, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Text style={[styles.lastHistoryExpr, { color: colors.mutedForeground }]} numberOfLines={1}>
            {history[history.length-1].expr}
          </Text>
          <Text style={[styles.lastHistoryVal, { color: colors.foreground }]}>
            = {history[history.length-1].result}
          </Text>
        </View>
      )}

      {/* Calculator body — flex:1 fills all remaining space */}
      <View style={[styles.body, { paddingBottom: bottomPad }]}>
        {mode === "standard"
          ? <Standard onHistory={h => setStdHistory(p => [...p.slice(-9), h])} />
          : <Construction onHistory={h => setConHistory(p => [...p.slice(-9), h])} />
        }
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { fontSize: 24, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  headerSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2, textTransform: "uppercase", letterSpacing: 0.8 },
  toggle: { flexDirection: "row", borderRadius: 12, borderWidth: 1, padding: 3, gap: 3 },
  toggleBtn: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 6 },
  toggleTxt: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  lastHistory: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 7, gap: 8, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  lastHistoryExpr: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular" },
  lastHistoryVal: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  body: { flex: 1, paddingHorizontal: 10, paddingTop: 10, gap: 8 },

  // Display
  display: {
    borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12,
    justifyContent: "flex-end",
  },
  exprTxt: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "right", marginBottom: 2 },
  displayTxt: { fontSize: 46, fontFamily: "Inter_700Bold", textAlign: "right", letterSpacing: -2, minHeight: 56 },

  // Ft/in toggle inside display
  fieldToggleRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  fieldToggle: { flex: 1, borderRadius: 8, borderWidth: 1, paddingVertical: 6, alignItems: "center" },
  fieldToggleTxt: { fontSize: 13, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5 },

  // Fraction row
  fracRow: {
    flexDirection: "row", flexWrap: "wrap", gap: 6,
    borderRadius: 12, borderWidth: 1, padding: 8,
  },
  fracChip: { borderRadius: 8, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 5, minWidth: 36, alignItems: "center" },
  fracChipTxt: { fontSize: 14, fontFamily: "Inter_500Medium" },

  // Button grid — each row is flex:1 so they share available height equally
  grid: { flex: 1, gap: 8 },
  row: { flex: 1, flexDirection: "row", gap: 8 },
  btn: { flex: 1, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  btnTxt: { fontSize: 22, fontFamily: "Inter_500Medium" },
});
