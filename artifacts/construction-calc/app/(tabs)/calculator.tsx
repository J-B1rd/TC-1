import { Feather } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
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

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Convert decimal inches to ft + in + fraction string */
function inchesToFtIn(totalInches: number): string {
  const negative = totalInches < 0;
  const absIn = Math.abs(totalInches);
  const ft = Math.floor(absIn / 12);
  const remainIn = absIn % 12;
  const wholeIn = Math.floor(remainIn);
  const fracDec = remainIn - wholeIn;

  const fracs: [number, string][] = [
    [0, ""],
    [1 / 16, "¹⁄₁₆"],
    [1 / 8, "⅛"],
    [3 / 16, "³⁄₁₆"],
    [1 / 4, "¼"],
    [5 / 16, "⁵⁄₁₆"],
    [3 / 8, "⅜"],
    [7 / 16, "⁷⁄₁₆"],
    [1 / 2, "½"],
    [9 / 16, "⁹⁄₁₆"],
    [5 / 8, "⅝"],
    [11 / 16, "¹¹⁄₁₆"],
    [3 / 4, "¾"],
    [13 / 16, "¹³⁄₁₆"],
    [7 / 8, "⅞"],
    [15 / 16, "¹⁵⁄₁₆"],
  ];

  let closest = fracs[0];
  let minDiff = Math.abs(fracDec - fracs[0][0]);
  for (const f of fracs) {
    const diff = Math.abs(fracDec - f[0]);
    if (diff < minDiff) {
      minDiff = diff;
      closest = f;
    }
  }

  // handle rounding up to next inch
  let displayIn = wholeIn;
  let displayFrac = closest[1];
  if (closest[0] >= 1 - 0.001) {
    displayIn += 1;
    displayFrac = "";
  }
  let displayFt = ft;
  if (displayIn >= 12) {
    displayFt += 1;
    displayIn = 0;
  }

  const sign = negative ? "-" : "";
  if (displayFt === 0 && displayIn === 0 && !displayFrac) return `${sign}0"`;
  if (displayFt === 0)
    return `${sign}${displayIn}${displayFrac ? " " + displayFrac : ""}"`;
  if (displayIn === 0 && !displayFrac) return `${sign}${displayFt}'`;
  return `${sign}${displayFt}' ${displayIn}${displayFrac ? " " + displayFrac : ""}"`;
}

/** Convert ft-in-fraction values to total decimal inches */
function ftInToInches(ft: number, inches: number, fracVal: number): number {
  return ft * 12 + inches + fracVal;
}

/** Safely evaluate a simple arithmetic expression */
function safeEval(expr: string): number | null {
  try {
    // Replace × and ÷ for eval
    const sanitised = expr
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/[^0-9+\-*/.()% ]/g, "");
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${sanitised})`)();
    if (typeof result === "number" && isFinite(result)) return result;
    return null;
  } catch {
    return null;
  }
}

function formatNumber(n: number): string {
  if (!isFinite(n)) return "Error";
  // Show up to 10 sig digits, strip trailing zeros
  const s = parseFloat(n.toPrecision(10)).toString();
  return s;
}

// ─── Types ─────────────────────────────────────────────────────────────────

type Mode = "standard" | "construction";

interface HistoryItem {
  expr: string;
  result: string;
}

interface ConstInput {
  feet: string;
  inches: string;
  frac: number; // decimal 0–<1
  fracLabel: string;
}

const FRACTIONS: { label: string; val: number }[] = [
  { label: "¼", val: 1 / 4 },
  { label: "½", val: 1 / 2 },
  { label: "¾", val: 3 / 4 },
  { label: "⅛", val: 1 / 8 },
  { label: "⅜", val: 3 / 8 },
  { label: "⅝", val: 5 / 8 },
  { label: "⅞", val: 7 / 8 },
  { label: "¹⁄₁₆", val: 1 / 16 },
  { label: "³⁄₁₆", val: 3 / 16 },
];

function emptyConstInput(): ConstInput {
  return { feet: "", inches: "", frac: 0, fracLabel: "" };
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function CalcButton({
  label,
  onPress,
  flex,
  variant,
  accentColor,
  small,
}: {
  label: string | React.ReactNode;
  onPress: () => void;
  flex?: number;
  variant?: "primary" | "operator" | "action" | "default" | "accent";
  accentColor?: string;
  small?: boolean;
}) {
  const colors = useColors();
  const isDark = useColorScheme() === "dark";

  const bg =
    variant === "primary"
      ? colors.primary
      : variant === "operator"
      ? (isDark ? "#2A2A3A" : "#E8E8F0")
      : variant === "action"
      ? (isDark ? "#333" : "#D1D5DB")
      : variant === "accent" && accentColor
      ? accentColor + "22"
      : colors.card;

  const textColor =
    variant === "primary"
      ? "#fff"
      : variant === "operator"
      ? colors.primary
      : variant === "accent" && accentColor
      ? accentColor
      : colors.foreground;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          flex: flex ?? 1,
          backgroundColor: bg,
          opacity: pressed ? 0.65 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
      ]}
      hitSlop={4}
    >
      {typeof label === "string" ? (
        <Text
          style={[
            styles.btnText,
            small && { fontSize: 14 },
            { color: textColor },
          ]}
        >
          {label}
        </Text>
      ) : (
        label
      )}
    </Pressable>
  );
}

// ─── Standard Calculator ────────────────────────────────────────────────────

function StandardCalculator({
  history,
  onHistory,
}: {
  history: HistoryItem[];
  onHistory: (item: HistoryItem) => void;
}) {
  const colors = useColors();
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [pendingOp, setPendingOp] = useState<string | null>(null);
  const [pendingVal, setPendingVal] = useState<number | null>(null);
  const [justCalc, setJustCalc] = useState(false);

  const inputDigit = (d: string) => {
    if (justCalc) {
      setDisplay(d);
      setExpression("");
      setJustCalc(false);
      return;
    }
    setDisplay((prev) => (prev === "0" ? d : prev.length < 15 ? prev + d : prev));
  };

  const inputDot = () => {
    if (justCalc) { setDisplay("0."); setJustCalc(false); return; }
    if (!display.includes(".")) setDisplay((d) => d + ".");
  };

  const handleOp = (op: string) => {
    const cur = parseFloat(display);
    if (pendingOp && pendingVal !== null && !justCalc) {
      const res = applyOp(pendingVal, cur, pendingOp);
      setDisplay(formatNumber(res));
      setExpression(`${formatNumber(res)} ${op}`);
      setPendingVal(res);
    } else {
      setExpression(`${display} ${op}`);
      setPendingVal(cur);
    }
    setPendingOp(op);
    setJustCalc(true);
  };

  const applyOp = (a: number, b: number, op: string): number => {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "×") return a * b;
    if (op === "÷") return b !== 0 ? a / b : NaN;
    if (op === "%") return (a * b) / 100;
    return b;
  };

  const handleEquals = () => {
    if (!pendingOp || pendingVal === null) return;
    const cur = parseFloat(display);
    const res = applyOp(pendingVal, cur, pendingOp);
    const resultStr = formatNumber(res);
    const exprStr = `${expression} ${display} =`;
    onHistory({ expr: exprStr, result: resultStr });
    setDisplay(resultStr);
    setExpression(exprStr);
    setPendingOp(null);
    setPendingVal(null);
    setJustCalc(true);
  };

  const handleClear = () => {
    setDisplay("0");
    setExpression("");
    setPendingOp(null);
    setPendingVal(null);
    setJustCalc(false);
  };

  const handleBackspace = () => {
    if (justCalc) return;
    setDisplay((d) => (d.length > 1 ? d.slice(0, -1) : "0"));
  };

  const handlePercent = () => {
    const val = parseFloat(display) / 100;
    setDisplay(formatNumber(val));
  };

  const handlePlusMinus = () => {
    setDisplay((d) => (d.startsWith("-") ? d.slice(1) : "-" + d));
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Display */}
      <View
        style={[
          styles.display,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text
          style={[styles.expressionText, { color: colors.mutedForeground }]}
          numberOfLines={1}
        >
          {expression || " "}
        </Text>
        <Text
          style={[styles.displayText, { color: colors.foreground }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {display}
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.btnGrid}>
        <View style={styles.btnRow}>
          <CalcButton label="C" onPress={handleClear} variant="action" />
          <CalcButton label="+/-" onPress={handlePlusMinus} variant="action" />
          <CalcButton label="%" onPress={handlePercent} variant="action" />
          <CalcButton label="÷" onPress={() => handleOp("÷")} variant="operator" />
        </View>
        <View style={styles.btnRow}>
          <CalcButton label="7" onPress={() => inputDigit("7")} />
          <CalcButton label="8" onPress={() => inputDigit("8")} />
          <CalcButton label="9" onPress={() => inputDigit("9")} />
          <CalcButton label="×" onPress={() => handleOp("×")} variant="operator" />
        </View>
        <View style={styles.btnRow}>
          <CalcButton label="4" onPress={() => inputDigit("4")} />
          <CalcButton label="5" onPress={() => inputDigit("5")} />
          <CalcButton label="6" onPress={() => inputDigit("6")} />
          <CalcButton label="-" onPress={() => handleOp("-")} variant="operator" />
        </View>
        <View style={styles.btnRow}>
          <CalcButton label="1" onPress={() => inputDigit("1")} />
          <CalcButton label="2" onPress={() => inputDigit("2")} />
          <CalcButton label="3" onPress={() => inputDigit("3")} />
          <CalcButton label="+" onPress={() => handleOp("+")} variant="operator" />
        </View>
        <View style={styles.btnRow}>
          <CalcButton label="⌫" onPress={handleBackspace} variant="action" />
          <CalcButton label="0" onPress={() => inputDigit("0")} />
          <CalcButton label="." onPress={inputDot} />
          <CalcButton label="=" onPress={handleEquals} variant="primary" />
        </View>
      </View>

      {/* History */}
      {history.length > 0 && (
        <View
          style={[
            styles.historyBox,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.historyLabel, { color: colors.mutedForeground }]}>
            HISTORY
          </Text>
          {history
            .slice(-4)
            .reverse()
            .map((h, i) => (
              <View key={i} style={styles.historyRow}>
                <Text
                  style={[styles.historyExpr, { color: colors.mutedForeground }]}
                  numberOfLines={1}
                >
                  {h.expr}
                </Text>
                <Text style={[styles.historyResult, { color: colors.foreground }]}>
                  {h.result}
                </Text>
              </View>
            ))}
        </View>
      )}
    </View>
  );
}

// ─── Construction Calculator ────────────────────────────────────────────────

function ConstructionCalculator({
  history,
  onHistory,
}: {
  history: HistoryItem[];
  onHistory: (item: HistoryItem) => void;
}) {
  const colors = useColors();
  const tradeOrange = "#D97706";

  // Current entry being built
  const [entry, setEntry] = useState<ConstInput>(emptyConstInput());
  const [activeField, setActiveField] = useState<"feet" | "inches">("feet");

  // Pending operation (like a standard calc)
  const [pendingOp, setPendingOp] = useState<string | null>(null);
  const [pendingInches, setPendingInches] = useState<number | null>(null); // total inches
  const [resultInches, setResultInches] = useState<number | null>(null);
  const [expression, setExpression] = useState("");
  const [justCalc, setJustCalc] = useState(false);

  const entryInches = ftInToInches(
    parseFloat(entry.feet || "0"),
    parseFloat(entry.inches || "0"),
    entry.frac
  );

  const displayStr = (() => {
    if (resultInches !== null && justCalc) return inchesToFtIn(resultInches);
    const ft = parseInt(entry.feet || "0");
    const ins = parseInt(entry.inches || "0");
    const frac = entry.fracLabel;
    if (ft === 0 && ins === 0 && !frac) return "0\"";
    if (ft === 0) return `${ins}${frac ? " " + frac : ""}"`;
    if (ins === 0 && !frac) return `${ft}'`;
    return `${ft}' ${ins}${frac ? " " + frac : ""}"`;
  })();

  const inputDigit = (d: string) => {
    if (justCalc) {
      setEntry(emptyConstInput());
      setResultInches(null);
      setJustCalc(false);
      setActiveField("feet");
      setEntry((e) => ({ ...e, [activeField === "feet" ? "feet" : "inches"]: d }));
      return;
    }
    setEntry((e) => {
      const field = activeField;
      const cur = e[field] as string;
      const next = cur === "0" ? d : cur + d;
      return { ...e, [field]: next };
    });
  };

  const handleFrac = (val: number, label: string) => {
    if (justCalc) {
      setEntry({ ...emptyConstInput(), frac: val, fracLabel: label });
      setResultInches(null);
      setJustCalc(false);
      return;
    }
    setEntry((e) => ({ ...e, frac: val, fracLabel: label }));
  };

  const handleOp = (op: string) => {
    if (justCalc && resultInches !== null) {
      setPendingInches(resultInches);
      setExpression(`${inchesToFtIn(resultInches)} ${op}`);
      setPendingOp(op);
      setJustCalc(false);
      setEntry(emptyConstInput());
      setResultInches(null);
      return;
    }
    const cur = entryInches;
    if (pendingOp && pendingInches !== null) {
      const res = applyOp(pendingInches, cur, pendingOp);
      setResultInches(res);
      setExpression(`${inchesToFtIn(res)} ${op}`);
      setPendingInches(res);
    } else {
      setExpression(`${inchesToFtIn(cur)} ${op}`);
      setPendingInches(cur);
    }
    setPendingOp(op);
    setJustCalc(true);
    setEntry(emptyConstInput());
  };

  const applyOp = (a: number, b: number, op: string): number => {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "×") return a * b; // e.g., dimension × scalar
    if (op === "÷") return b !== 0 ? a / b : 0;
    return b;
  };

  const handleEquals = () => {
    if (!pendingOp || pendingInches === null) return;
    const cur = entryInches;
    const res = applyOp(pendingInches, cur, pendingOp);
    const exprStr = `${expression} ${inchesToFtIn(cur)} =`;
    onHistory({ expr: exprStr, result: inchesToFtIn(res) });
    setResultInches(res);
    setExpression(exprStr);
    setPendingOp(null);
    setPendingInches(null);
    setJustCalc(true);
    setEntry(emptyConstInput());
  };

  const handleClear = () => {
    setEntry(emptyConstInput());
    setPendingOp(null);
    setPendingInches(null);
    setResultInches(null);
    setExpression("");
    setJustCalc(false);
    setActiveField("feet");
  };

  const handleBackspace = () => {
    if (justCalc) return;
    setEntry((e) => {
      const field = activeField;
      const cur = e[field] as string;
      const next = cur.length > 1 ? cur.slice(0, -1) : "";
      return { ...e, [field]: next };
    });
  };

  // Quick conversions
  const convertToDecimalFt = () => {
    const totalIn = justCalc && resultInches !== null ? resultInches : entryInches;
    const decFt = totalIn / 12;
    onHistory({
      expr: `${inchesToFtIn(totalIn)} → decimal ft`,
      result: `${decFt.toFixed(4)} ft`,
    });
    setExpression(`${inchesToFtIn(totalIn)} → ${decFt.toFixed(4)} ft`);
  };

  const computeArea = () => {
    if (pendingOp === "×" && pendingInches !== null) {
      const cur = entryInches;
      const sqIn = pendingInches * cur;
      const sqFt = sqIn / 144;
      const exprStr = `${inchesToFtIn(pendingInches)} × ${inchesToFtIn(cur)} = ${sqFt.toFixed(2)} ft²`;
      onHistory({ expr: exprStr, result: `${sqFt.toFixed(2)} ft²` });
      setExpression(exprStr);
      setJustCalc(true);
      setEntry(emptyConstInput());
      setPendingOp(null);
      setPendingInches(null);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Display */}
      <View
        style={[
          styles.display,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text
          style={[styles.expressionText, { color: colors.mutedForeground }]}
          numberOfLines={1}
        >
          {expression || " "}
        </Text>
        <Text
          style={[styles.displayText, { color: colors.foreground }]}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {displayStr}
        </Text>

        {/* ft / in field selector */}
        <View style={styles.fieldRow}>
          <Pressable
            onPress={() => { setActiveField("feet"); if (justCalc) { setResultInches(null); setJustCalc(false); } }}
            style={[
              styles.fieldBtn,
              {
                backgroundColor: activeField === "feet" ? tradeOrange + "22" : colors.background,
                borderColor: activeField === "feet" ? tradeOrange : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.fieldBtnText,
                { color: activeField === "feet" ? tradeOrange : colors.mutedForeground },
              ]}
            >
              ft
            </Text>
          </Pressable>
          <Pressable
            onPress={() => { setActiveField("inches"); if (justCalc) { setResultInches(null); setJustCalc(false); } }}
            style={[
              styles.fieldBtn,
              {
                backgroundColor: activeField === "inches" ? tradeOrange + "22" : colors.background,
                borderColor: activeField === "inches" ? tradeOrange : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.fieldBtnText,
                { color: activeField === "inches" ? tradeOrange : colors.mutedForeground },
              ]}
            >
              in
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Fraction pad */}
      <View
        style={[
          styles.fracPad,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.fracLabel, { color: colors.mutedForeground }]}>
          FRACTIONS
        </Text>
        <View style={styles.fracRow}>
          {FRACTIONS.map((f) => (
            <Pressable
              key={f.label}
              onPress={() => handleFrac(f.val, f.label)}
              style={({ pressed }) => [
                styles.fracBtn,
                {
                  backgroundColor:
                    entry.fracLabel === f.label
                      ? tradeOrange + "22"
                      : colors.background,
                  borderColor:
                    entry.fracLabel === f.label ? tradeOrange : colors.border,
                  opacity: pressed ? 0.6 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.fracBtnText,
                  {
                    color:
                      entry.fracLabel === f.label
                        ? tradeOrange
                        : colors.foreground,
                  },
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
          <Pressable
            onPress={() => handleFrac(0, "")}
            style={({ pressed }) => [
              styles.fracBtn,
              {
                backgroundColor:
                  entry.frac === 0 && entry.fracLabel === ""
                    ? tradeOrange + "22"
                    : colors.background,
                borderColor:
                  entry.frac === 0 && entry.fracLabel === ""
                    ? tradeOrange
                    : colors.border,
                opacity: pressed ? 0.6 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.fracBtnText,
                {
                  color:
                    entry.frac === 0 && entry.fracLabel === ""
                      ? tradeOrange
                      : colors.mutedForeground,
                },
              ]}
            >
              0
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Number + ops grid */}
      <View style={styles.btnGrid}>
        <View style={styles.btnRow}>
          <CalcButton label="C" onPress={handleClear} variant="action" />
          <CalcButton
            label="⌫"
            onPress={handleBackspace}
            variant="action"
          />
          <CalcButton
            label="dec ft"
            onPress={convertToDecimalFt}
            variant="action"
            small
          />
          <CalcButton label="÷" onPress={() => handleOp("÷")} variant="operator" />
        </View>
        <View style={styles.btnRow}>
          <CalcButton label="7" onPress={() => inputDigit("7")} />
          <CalcButton label="8" onPress={() => inputDigit("8")} />
          <CalcButton label="9" onPress={() => inputDigit("9")} />
          <CalcButton label="×" onPress={() => handleOp("×")} variant="operator" />
        </View>
        <View style={styles.btnRow}>
          <CalcButton label="4" onPress={() => inputDigit("4")} />
          <CalcButton label="5" onPress={() => inputDigit("5")} />
          <CalcButton label="6" onPress={() => inputDigit("6")} />
          <CalcButton label="-" onPress={() => handleOp("-")} variant="operator" />
        </View>
        <View style={styles.btnRow}>
          <CalcButton label="1" onPress={() => inputDigit("1")} />
          <CalcButton label="2" onPress={() => inputDigit("2")} />
          <CalcButton label="3" onPress={() => inputDigit("3")} />
          <CalcButton label="+" onPress={() => handleOp("+")} variant="operator" />
        </View>
        <View style={styles.btnRow}>
          <CalcButton
            label="ft²"
            onPress={computeArea}
            variant="accent"
            accentColor={tradeOrange}
            small
          />
          <CalcButton label="0" onPress={() => inputDigit("0")} />
          <CalcButton label="00" onPress={() => { inputDigit("0"); inputDigit("0"); }} />
          <CalcButton label="=" onPress={handleEquals} variant="primary" />
        </View>
      </View>

      {/* History */}
      {history.length > 0 && (
        <View
          style={[
            styles.historyBox,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.historyLabel, { color: colors.mutedForeground }]}>
            HISTORY
          </Text>
          {history
            .slice(-4)
            .reverse()
            .map((h, i) => (
              <View key={i} style={styles.historyRow}>
                <Text
                  style={[styles.historyExpr, { color: colors.mutedForeground }]}
                  numberOfLines={1}
                >
                  {h.expr}
                </Text>
                <Text style={[styles.historyResult, { color: colors.foreground }]}>
                  {h.result}
                </Text>
              </View>
            ))}
        </View>
      )}
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function CalculatorScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>("standard");
  const [stdHistory, setStdHistory] = useState<HistoryItem[]>([]);
  const [conHistory, setConHistory] = useState<HistoryItem[]>([]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 10;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 16,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Calculator
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {mode === "standard" ? "Standard arithmetic" : "Feet & inches"}
          </Text>
        </View>

        {/* Mode toggle */}
        <View
          style={[
            styles.modeToggle,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {(["standard", "construction"] as Mode[]).map((m) => (
            <Pressable
              key={m}
              onPress={() => setMode(m)}
              style={[
                styles.modeBtn,
                mode === m && {
                  backgroundColor: colors.primary,
                  shadowColor: colors.primary,
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 3,
                },
              ]}
            >
              <Feather
                name={m === "standard" ? "hash" : "tool"}
                size={13}
                color={mode === m ? "#fff" : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.modeBtnText,
                  { color: mode === m ? "#fff" : colors.mutedForeground },
                ]}
              >
                {m === "standard" ? "Standard" : "Ft & In"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 14, paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        {mode === "standard" ? (
          <StandardCalculator
            history={stdHistory}
            onHistory={(item) => setStdHistory((h) => [...h, item])}
          />
        ) : (
          <ConstructionCalculator
            history={conHistory}
            onHistory={(item) => setConHistory((h) => [...h, item])}
          />
        )}
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  modeToggle: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    padding: 3,
    gap: 3,
  },
  modeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  modeBtnText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  display: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
    minHeight: 96,
    justifyContent: "flex-end",
  },
  expressionText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginBottom: 4,
    textAlign: "right",
  },
  displayText: {
    fontSize: 42,
    fontFamily: "Inter_700Bold",
    textAlign: "right",
    letterSpacing: -1,
  },
  fieldRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  fieldBtn: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 6,
    alignItems: "center",
  },
  fieldBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fracPad: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  fracLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    marginBottom: 7,
  },
  fracRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  fracBtn: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 6,
    minWidth: 40,
    alignItems: "center",
  },
  fracBtnText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  btnGrid: {
    gap: 8,
  },
  btnRow: {
    flexDirection: "row",
    gap: 8,
  },
  btn: {
    height: 58,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 22,
    fontFamily: "Inter_500Medium",
  },
  historyBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginTop: 12,
  },
  historyLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    gap: 8,
  },
  historyExpr: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  historyResult: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
});
