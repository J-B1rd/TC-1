import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function inchesToFtIn(totalInches: number): string {
  const negative = totalInches < 0;
  const absIn = Math.abs(totalInches);
  const ft = Math.floor(absIn / 12);
  const remainIn = absIn % 12;
  const wholeIn = Math.floor(remainIn);
  const fracDec = remainIn - wholeIn;
  const fracs: [number, string][] = [
    [0,""], [1/16,"¹⁄₁₆"], [1/8,"⅛"], [3/16,"³⁄₁₆"], [1/4,"¼"],
    [5/16,"⁵⁄₁₆"], [3/8,"⅜"], [7/16,"⁷⁄₁₆"], [1/2,"½"], [9/16,"⁹⁄₁₆"],
    [5/8,"⅝"], [11/16,"¹¹⁄₁₆"], [3/4,"¾"], [13/16,"¹³⁄₁₆"], [7/8,"⅞"], [15/16,"¹⁵⁄₁₆"],
  ];
  let closest = fracs[0];
  let minDiff = Math.abs(fracDec - fracs[0][0]);
  for (const f of fracs) {
    const d = Math.abs(fracDec - f[0]);
    if (d < minDiff) { minDiff = d; closest = f; }
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

function fmt(n: number): string {
  if (!isFinite(n)) return "Error";
  return parseFloat(n.toPrecision(10)).toString();
}

type Mode = "standard" | "construction";
interface HistoryItem { expr: string; result: string; }
interface ConstInput { feet: string; inches: string; frac: number; fracLabel: string; }
const empty = (): ConstInput => ({ feet: "", inches: "", frac: 0, fracLabel: "" });

const FRACS = [
  { label: "¼", val: 1/4 }, { label: "½", val: 1/2 }, { label: "¾", val: 3/4 },
  { label: "⅛", val: 1/8 }, { label: "⅜", val: 3/8 }, { label: "⅝", val: 5/8 },
  { label: "⅞", val: 7/8 }, { label: "¹⁄₁₆", val: 1/16 }, { label: "³⁄₁₆", val: 3/16 },
];

// ─── Key Button ───────────────────────────────────────────────────────────────

type BtnVariant = "num" | "op" | "action" | "eq" | "accent";

function Key({
  label, onPress, variant = "num", wide, accent,
}: {
  label: string;
  onPress: () => void;
  variant?: BtnVariant;
  wide?: boolean;
  accent?: string;
}) {
  const colors = useColors();
  const dark = useColorScheme() === "dark";

  const bg =
    variant === "eq"     ? colors.primary :
    variant === "op"     ? (dark ? "#2C2C35" : "#E4E4EC") :
    variant === "action" ? (dark ? "#323236" : "#DCDCE4") :
    variant === "accent" && accent ? accent + "18" :
    (dark ? "#1C1C22" : colors.card);

  const tc =
    variant === "eq"     ? "#fff" :
    variant === "op"     ? colors.primary :
    variant === "accent" && accent ? accent :
    colors.foreground;

  const border =
    variant === "eq"     ? "transparent" :
    variant === "op"     ? (dark ? "#3A3A46" : "#D0D0DC") :
    variant === "action" ? (dark ? "#3A3A3A" : "#D4D4DC") :
    colors.border;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.key,
        wide && { flex: 2 },
        {
          backgroundColor: bg,
          borderColor: border,
          opacity: pressed ? 0.58 : 1,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
      ]}
    >
      <Text style={[
        styles.keyTxt,
        variant === "eq" && { color: "#fff", fontFamily: "Inter_600SemiBold" },
        variant === "op" && { color: colors.primary, fontSize: 19 },
        variant === "action" && { color: colors.mutedForeground, fontSize: 15 },
        variant === "accent" && accent && { color: accent, fontSize: 14 },
        { color: tc },
      ]}>
        {label}
      </Text>
    </Pressable>
  );
}

// ─── Standard Calculator ──────────────────────────────────────────────────────

function Standard({ onHistory }: { onHistory: (h: HistoryItem) => void }) {
  const colors = useColors();
  const [display, setDisplay] = useState("0");
  const [expr, setExpr] = useState("");
  const [pendingOp, setPendingOp] = useState<string|null>(null);
  const [pendingVal, setPendingVal] = useState<number|null>(null);
  const [justCalc, setJustCalc] = useState(false);

  const digit = (d: string) => {
    if (justCalc) { setDisplay(d); setExpr(""); setJustCalc(false); return; }
    setDisplay(p => p === "0" ? d : p.length < 14 ? p+d : p);
  };
  const dot = () => {
    if (justCalc) { setDisplay("0."); setJustCalc(false); return; }
    if (!display.includes(".")) setDisplay(d => d+".");
  };
  const apply = (a: number, b: number, op: string) =>
    op==="+" ? a+b : op==="-" ? a-b : op==="×" ? a*b :
    op==="÷" ? (b!==0 ? a/b : NaN) : op==="%" ? (a*b)/100 : b;

  const handleOp = (o: string) => {
    const cur = parseFloat(display);
    if (pendingOp && pendingVal!==null && !justCalc) {
      const res = apply(pendingVal, cur, pendingOp);
      setDisplay(fmt(res)); setExpr(`${fmt(res)} ${o}`); setPendingVal(res);
    } else { setExpr(`${display} ${o}`); setPendingVal(cur); }
    setPendingOp(o); setJustCalc(true);
  };
  const equals = () => {
    if (!pendingOp || pendingVal===null) return;
    const cur = parseFloat(display);
    const res = apply(pendingVal, cur, pendingOp);
    const rs = fmt(res);
    onHistory({ expr: `${expr} ${display} =`, result: rs });
    setDisplay(rs); setExpr(`${expr} ${display} =`);
    setPendingOp(null); setPendingVal(null); setJustCalc(true);
  };
  const clear = () => { setDisplay("0"); setExpr(""); setPendingOp(null); setPendingVal(null); setJustCalc(false); };
  const back = () => { if (justCalc) return; setDisplay(d => d.length>1?d.slice(0,-1):"0"); };
  const pct = () => setDisplay(fmt(parseFloat(display)/100));
  const pm = () => setDisplay(d => d.startsWith("-")?d.slice(1):"-"+d);

  return (
    <View style={styles.calcBody}>
      {/* Display */}
      <View style={[styles.display, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.exprLine, { color: colors.mutedForeground }]} numberOfLines={1}>
          {expr || " "}
        </Text>
        <Text style={[styles.mainNum, { color: colors.foreground }]} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        <View style={styles.keyRow}>
          <Key label="C"   onPress={clear} variant="action" />
          <Key label="+/−" onPress={pm}    variant="action" />
          <Key label="%"   onPress={pct}   variant="action" />
          <Key label="÷"   onPress={() => handleOp("÷")} variant="op" />
        </View>
        <View style={styles.keyRow}>
          <Key label="7" onPress={() => digit("7")} />
          <Key label="8" onPress={() => digit("8")} />
          <Key label="9" onPress={() => digit("9")} />
          <Key label="×" onPress={() => handleOp("×")} variant="op" />
        </View>
        <View style={styles.keyRow}>
          <Key label="4" onPress={() => digit("4")} />
          <Key label="5" onPress={() => digit("5")} />
          <Key label="6" onPress={() => digit("6")} />
          <Key label="−" onPress={() => handleOp("-")} variant="op" />
        </View>
        <View style={styles.keyRow}>
          <Key label="1" onPress={() => digit("1")} />
          <Key label="2" onPress={() => digit("2")} />
          <Key label="3" onPress={() => digit("3")} />
          <Key label="+" onPress={() => handleOp("+")} variant="op" />
        </View>
        <View style={styles.keyRow}>
          <Key label="⌫" onPress={back} variant="action" />
          <Key label="0" onPress={() => digit("0")} />
          <Key label="." onPress={dot} />
          <Key label="=" onPress={equals} variant="eq" />
        </View>
      </View>
    </View>
  );
}

// ─── Construction Calculator ──────────────────────────────────────────────────

function Construction({ onHistory }: { onHistory: (h: HistoryItem) => void }) {
  const colors = useColors();
  const orange = "#C96A00";
  const [entry, setEntry] = useState<ConstInput>(empty());
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
    if (resultIn!==null && justCalc) return inchesToFtIn(resultIn);
    const ft = parseInt(entry.feet||"0");
    const ins = parseInt(entry.inches||"0");
    const frac = entry.fracLabel;
    if (ft===0 && ins===0 && !frac) return '0"';
    if (ft===0) return `${ins}${frac?" "+frac:""}"`;
    if (ins===0 && !frac) return `${ft}'`;
    return `${ft}' ${ins}${frac?" "+frac:""}"`;
  })();

  const digit = (d: string) => {
    if (justCalc) { setEntry({ ...empty(), [active]: d }); setResultIn(null); setJustCalc(false); return; }
    setEntry(e => { const cur = e[active] as string; return { ...e, [active]: cur===''||cur==='0'?d:cur+d }; });
  };
  const frac = (val: number, label: string) => {
    if (justCalc) { setEntry({ ...empty(), frac: val, fracLabel: label }); setResultIn(null); setJustCalc(false); return; }
    setEntry(e => ({ ...e, frac: val, fracLabel: label }));
  };
  const applyOp = (a: number, b: number, o: string) =>
    o==="+" ? a+b : o==="-" ? a-b : o==="×" ? a*b : o==="÷" && b!==0 ? a/b : 0;

  const doOp = (o: string) => {
    if (justCalc && resultIn!==null) {
      setPendingIn(resultIn); setExpr(`${inchesToFtIn(resultIn)} ${o}`);
      setPendingOp(o); setJustCalc(false); setEntry(empty()); setResultIn(null); return;
    }
    const cur = entryInches;
    if (pendingOp && pendingIn!==null) {
      const res = applyOp(pendingIn, cur, pendingOp);
      setResultIn(res); setExpr(`${inchesToFtIn(res)} ${o}`); setPendingIn(res);
    } else { setExpr(`${inchesToFtIn(cur)} ${o}`); setPendingIn(cur); }
    setPendingOp(o); setJustCalc(true); setEntry(empty());
  };
  const equals = () => {
    if (!pendingOp || pendingIn===null) return;
    const cur = entryInches;
    const res = applyOp(pendingIn, cur, pendingOp);
    onHistory({ expr: `${expr} ${inchesToFtIn(cur)} =`, result: inchesToFtIn(res) });
    setResultIn(res); setExpr(`${expr} ${inchesToFtIn(cur)} =`);
    setPendingOp(null); setPendingIn(null); setJustCalc(true); setEntry(empty());
  };
  const clear = () => { setEntry(empty()); setPendingOp(null); setPendingIn(null); setResultIn(null); setExpr(""); setJustCalc(false); setActive("feet"); };
  const back = () => { if (justCalc) return; setEntry(e => { const cur = e[active] as string; return { ...e, [active]: cur.length>1?cur.slice(0,-1):"" }; }); };
  const decFt = () => {
    const total = justCalc && resultIn!==null ? resultIn : entryInches;
    const df = (total/12).toFixed(4);
    onHistory({ expr: `${inchesToFtIn(total)} → dec`, result: `${df} ft` });
    setExpr(`${inchesToFtIn(total)} = ${df} ft`);
  };

  return (
    <View style={styles.calcBody}>
      {/* Display — with ft/in toggle integrated */}
      <View style={[styles.display, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.exprLine, { color: colors.mutedForeground }]} numberOfLines={1}>
          {expr || " "}
        </Text>
        <Text style={[styles.mainNum, { color: colors.foreground }]} adjustsFontSizeToFit numberOfLines={1}>
          {displayStr}
        </Text>
        {/* ft / in chips — inside the display card */}
        <View style={styles.fieldRow}>
          {(["feet","inches"] as const).map(f => (
            <Pressable
              key={f}
              onPress={() => { setActive(f); if (justCalc) { setResultIn(null); setJustCalc(false); } }}
              style={[
                styles.fieldChip,
                {
                  backgroundColor: active===f ? orange+"1A" : "transparent",
                  borderColor: active===f ? orange+"60" : colors.border,
                },
              ]}
            >
              <Text style={[styles.fieldChipTxt, { color: active===f ? orange : colors.mutedForeground }]}>
                {f==="feet" ? "ft" : "in"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Fraction chips — horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.fracScroll}
        contentContainerStyle={styles.fracContent}
      >
        {FRACS.map(f => (
          <Pressable
            key={f.label}
            onPress={() => frac(f.val, f.label)}
            style={[
              styles.fracChip,
              {
                backgroundColor: entry.fracLabel===f.label ? orange+"18" : colors.card,
                borderColor: entry.fracLabel===f.label ? orange+"55" : colors.border,
              },
            ]}
          >
            <Text style={[styles.fracChipTxt, { color: entry.fracLabel===f.label ? orange : colors.mutedForeground }]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
        <Pressable
          onPress={() => frac(0,"")}
          style={[
            styles.fracChip,
            {
              backgroundColor: entry.frac===0&&entry.fracLabel==="" ? orange+"18" : colors.card,
              borderColor: entry.frac===0&&entry.fracLabel==="" ? orange+"55" : colors.border,
            },
          ]}
        >
          <Text style={[styles.fracChipTxt, { color: entry.frac===0&&entry.fracLabel==="" ? orange : colors.mutedForeground }]}>
            0
          </Text>
        </Pressable>
      </ScrollView>

      {/* Keypad */}
      <View style={styles.keypad}>
        <View style={styles.keyRow}>
          <Key label="C"      onPress={clear}  variant="action" />
          <Key label="⌫"      onPress={back}   variant="action" />
          <Key label="dec"    onPress={decFt}  variant="action" />
          <Key label="÷"      onPress={() => doOp("÷")} variant="op" />
        </View>
        <View style={styles.keyRow}>
          <Key label="7" onPress={() => digit("7")} />
          <Key label="8" onPress={() => digit("8")} />
          <Key label="9" onPress={() => digit("9")} />
          <Key label="×" onPress={() => doOp("×")} variant="op" />
        </View>
        <View style={styles.keyRow}>
          <Key label="4" onPress={() => digit("4")} />
          <Key label="5" onPress={() => digit("5")} />
          <Key label="6" onPress={() => digit("6")} />
          <Key label="−" onPress={() => doOp("-")} variant="op" />
        </View>
        <View style={styles.keyRow}>
          <Key label="1" onPress={() => digit("1")} />
          <Key label="2" onPress={() => digit("2")} />
          <Key label="3" onPress={() => digit("3")} />
          <Key label="+" onPress={() => doOp("+")} variant="op" />
        </View>
        <View style={styles.keyRow}>
          <Key label="ft²" onPress={() => {
            if (pendingOp==="×" && pendingIn!==null) {
              const sqFt = (pendingIn*entryInches)/144;
              onHistory({ expr:`${inchesToFtIn(pendingIn)} × ${inchesToFtIn(entryInches)}`, result:`${sqFt.toFixed(2)} ft²` });
              setExpr(`= ${sqFt.toFixed(2)} ft²`); setJustCalc(true);
              setEntry(empty()); setPendingOp(null); setPendingIn(null);
            }
          }} variant="accent" accent={orange} />
          <Key label="0"  onPress={() => digit("0")} />
          <Key label="00" onPress={() => { digit("0"); digit("0"); }} />
          <Key label="="  onPress={equals} variant="eq" />
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

  const topPad = Platform.OS === "web" ? 12 : insets.top + 6;
  const bottomPad = Platform.OS === "web" ? 20 : insets.bottom + 10;
  const history = mode === "standard" ? stdHistory : conHistory;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: topPad, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>Calculator</Text>
        </View>
        {/* Mode pills */}
        <View style={[styles.modePills, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {(["standard","construction"] as Mode[]).map(m => {
            const active = mode === m;
            return (
              <Pressable
                key={m}
                onPress={() => setMode(m)}
                style={[
                  styles.modePill,
                  active && { backgroundColor: colors.primary },
                ]}
              >
                <Feather
                  name={m==="standard" ? "hash" : "tool"}
                  size={11}
                  color={active ? "#fff" : colors.mutedForeground}
                />
                <Text style={[styles.modePillTxt, { color: active ? "#fff" : colors.mutedForeground }]}>
                  {m==="standard" ? "Standard" : "Ft & In"}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ── Last history strip ── */}
      {history.length > 0 && (
        <View style={[styles.historyStrip, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Text style={[styles.historyExpr, { color: colors.mutedForeground }]} numberOfLines={1}>
            {history[history.length-1].expr}
          </Text>
          <Text style={[styles.historyVal, { color: colors.foreground }]}>
            = {history[history.length-1].result}
          </Text>
        </View>
      )}

      {/* ── Calculator body ── */}
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

const GAP = 6;
const KEY_H = 62;

const styles = StyleSheet.create({
  screen: { flex: 1 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },

  // Mode toggle
  modePills: {
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    padding: 3,
    gap: 3,
  },
  modePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  modePillTxt: { fontSize: 12, fontFamily: "Inter_500Medium" },

  // History strip
  historyStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  historyExpr: { flex: 1, fontSize: 11, fontFamily: "Inter_400Regular" },
  historyVal: { fontSize: 12, fontFamily: "Inter_600SemiBold" },

  // Body — justifyContent:'flex-end' anchors keypad to bottom, empty space collects above display
  body: { flex: 1, paddingHorizontal: 10, paddingTop: 8, paddingBottom: 0, justifyContent: "flex-end", gap: GAP },
  calcBody: { gap: GAP },

  // Display card
  display: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 10,
  },
  exprLine: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "right", marginBottom: 1 },
  mainNum: {
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    textAlign: "right",
    letterSpacing: -1.5,
    minHeight: 48,
  },

  // ft/in chips inside display
  fieldRow: { flexDirection: "row", gap: 6, marginTop: 8 },
  fieldChip: {
    borderRadius: 7,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: "center",
  },
  fieldChipTxt: { fontSize: 12, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5 },

  // Fraction scroll
  fracScroll: { flexGrow: 0 },
  fracContent: { gap: 6, paddingHorizontal: 0 },
  fracChip: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    minWidth: 38,
  },
  fracChipTxt: { fontSize: 14, fontFamily: "Inter_400Regular" },

  // Keypad — fixed-height rows, no flex needed on the container
  keypad: { gap: GAP },
  keyRow: { height: KEY_H, flexDirection: "row", gap: GAP },

  // Key
  key: {
    flex: 1,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  keyTxt: {
    fontSize: 21,
    fontFamily: "Inter_400Regular",
    includeFontPadding: false,
  },
});
