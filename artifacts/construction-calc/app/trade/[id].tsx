import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getTradeById } from "@/data/calculators";
import { tradeReferences } from "@/data/references";
import { useColors } from "@/hooks/useColors";

// ─── Mini Standard Calculator (for FAB modal) ─────────────────────────────────

function fmt(n: number): string {
  if (!isFinite(n)) return "Error";
  return parseFloat(n.toPrecision(10)).toString();
}

type CalcKey = { label: string; variant: "num" | "op" | "action" | "eq" };

const ROWS: CalcKey[][] = [
  [{ label: "C", variant: "action" }, { label: "+/−", variant: "action" }, { label: "%", variant: "action" }, { label: "÷", variant: "op" }],
  [{ label: "7", variant: "num" }, { label: "8", variant: "num" }, { label: "9", variant: "num" }, { label: "×", variant: "op" }],
  [{ label: "4", variant: "num" }, { label: "5", variant: "num" }, { label: "6", variant: "num" }, { label: "−", variant: "op" }],
  [{ label: "1", variant: "num" }, { label: "2", variant: "num" }, { label: "3", variant: "num" }, { label: "+", variant: "op" }],
  [{ label: "⌫", variant: "action" }, { label: "0", variant: "num" }, { label: ".", variant: "num" }, { label: "=", variant: "eq" }],
];

function MiniCalc({ onClose }: { onClose: () => void }) {
  const colors = useColors();
  const dark = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();

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
    op === "+" ? a + b : op === "-" ? a - b : op === "×" ? a * b :
    op === "÷" ? (b !== 0 ? a / b : NaN) : op === "%" ? (a * b) / 100 : b;
  const handleOp = (o: string) => {
    const cur = parseFloat(display);
    if (pendingOp && pendingVal !== null && !justCalc) {
      const res = apply(pendingVal, cur, pendingOp);
      setDisplay(fmt(res)); setExpr(`${fmt(res)} ${o}`); setPendingVal(res);
    } else { setExpr(`${display} ${o}`); setPendingVal(cur); }
    setPendingOp(o); setJustCalc(true);
  };
  const equals = () => {
    if (!pendingOp || pendingVal === null) return;
    const cur = parseFloat(display);
    const res = apply(pendingVal, cur, pendingOp);
    setDisplay(fmt(res)); setExpr(`${expr} ${display} =`);
    setPendingOp(null); setPendingVal(null); setJustCalc(true);
  };
  const clear = () => { setDisplay("0"); setExpr(""); setPendingOp(null); setPendingVal(null); setJustCalc(false); };
  const back = () => { if (justCalc) return; setDisplay(d => d.length > 1 ? d.slice(0, -1) : "0"); };
  const pct = () => setDisplay(fmt(parseFloat(display) / 100));
  const pm = () => setDisplay(d => d.startsWith("-") ? d.slice(1) : "-" + d);

  const handle = (key: CalcKey) => {
    if (key.label === "C") return clear();
    if (key.label === "⌫") return back();
    if (key.label === "%") return pct();
    if (key.label === "+/−") return pm();
    if (key.label === "=") return equals();
    if (key.label === ".") return dot();
    if (["÷","×","−","+"].includes(key.label)) return handleOp(key.label === "−" ? "-" : key.label);
    return digit(key.label);
  };

  const btnBg = (v: CalcKey["variant"]) =>
    v === "eq"     ? colors.primary :
    v === "op"     ? (dark ? "#2C2C35" : "#E4E4EC") :
    v === "action" ? (dark ? "#323236" : "#DCDCE4") :
    (dark ? "#1C1C22" : colors.card);
  const btnTc = (v: CalcKey["variant"]) =>
    v === "eq"     ? "#fff" :
    v === "op"     ? colors.primary :
    v === "action" ? colors.mutedForeground :
    colors.foreground;

  return (
    <View style={[mStyles.sheet, { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 }]}>
      {/* Handle bar */}
      <View style={[mStyles.handle, { backgroundColor: colors.border }]} />

      {/* Header */}
      <View style={mStyles.sheetHeader}>
        <View style={[mStyles.sheetIconWrap, { backgroundColor: colors.primary + "18" }]}>
          <Feather name="hash" size={16} color={colors.primary} />
        </View>
        <Text style={[mStyles.sheetTitle, { color: colors.foreground }]}>Quick Calculator</Text>
        <Pressable onPress={onClose} style={[mStyles.closeBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="x" size={16} color={colors.mutedForeground} />
        </Pressable>
      </View>

      {/* Display */}
      <View style={[mStyles.display, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[mStyles.exprLine, { color: colors.mutedForeground }]} numberOfLines={1}>{expr || " "}</Text>
        <Text style={[mStyles.mainNum, { color: colors.foreground }]} numberOfLines={1} adjustsFontSizeToFit>{display}</Text>
      </View>

      {/* Keys */}
      <View style={mStyles.keypad}>
        {ROWS.map((row, ri) => (
          <View key={ri} style={mStyles.keyRow}>
            {row.map(k => (
              <Pressable
                key={k.label}
                onPress={() => handle(k)}
                style={({ pressed }) => [
                  mStyles.key,
                  { backgroundColor: btnBg(k.variant), borderColor: dark ? "#2E2E38" : colors.border,
                    opacity: pressed ? 0.6 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] },
                ]}
              >
                <Text style={[mStyles.keyTxt,
                  k.variant === "op" && { fontSize: 19, color: colors.primary },
                  k.variant === "action" && { fontSize: 15, color: colors.mutedForeground },
                  k.variant === "eq" && { color: "#fff" },
                  k.variant === "num" && { color: colors.foreground },
                ]}>
                  {k.label}
                </Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Trade Screen ─────────────────────────────────────────────────────────────

export default function TradeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const trade = getTradeById(id ?? "");
  const refCount = tradeReferences[id ?? ""]?.length ?? 0;
  const [calcOpen, setCalcOpen] = useState(false);
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 20;

  if (!trade) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.mutedForeground }}>Trade not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        data={trade.calculators}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={[styles.tradeHero, { backgroundColor: trade.color + "14", borderColor: trade.color + "2A" }]}>
              <View style={[styles.heroIcon, { backgroundColor: trade.color + "25" }]}>
                <Feather name={trade.icon as keyof typeof Feather.glyphMap} size={28} color={trade.color} />
              </View>
              <Text style={[styles.heroName, { color: colors.foreground }]}>{trade.name}</Text>
              <Text style={[styles.heroMeta, { color: colors.mutedForeground }]}>
                {trade.calculators.length} calculators
              </Text>
              {refCount > 0 && (
                <Pressable
                  onPress={() => router.push(`/refs/${trade.id}`)}
                  style={({ pressed }) => [
                    styles.refsBtn,
                    { backgroundColor: colors.background, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Feather name="book-open" size={13} color={trade.color} />
                  <Text style={[styles.refsBtnText, { color: trade.color }]}>
                    View {refCount} Field Reference{refCount !== 1 ? "s" : ""}
                  </Text>
                  <Feather name="chevron-right" size={13} color={trade.color} />
                </Pressable>
              )}
            </View>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>CALCULATORS</Text>
          </View>
        }
        renderItem={({ item: calc }) => (
          <Pressable
            style={({ pressed }) => [
              styles.calcRow,
              { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.75 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] },
            ]}
            onPress={() => router.push(`/calc/${trade.id}--${calc.id}`)}
          >
            <View style={[styles.calcAccentDot, { backgroundColor: trade.color }]} />
            <View style={styles.calcText}>
              <Text style={[styles.calcName, { color: colors.foreground }]}>{calc.name}</Text>
              <Text style={[styles.calcDesc, { color: colors.mutedForeground }]} numberOfLines={2}>{calc.description}</Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>
        )}
      />

      {/* Floating calculator button */}
      <Pressable
        onPress={() => setCalcOpen(true)}
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: colors.primary,
            bottom: Platform.OS === "web" ? 24 : insets.bottom + 20,
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.93 : 1 }],
          },
        ]}
        accessibilityLabel="Open quick calculator"
      >
        <Feather name="hash" size={20} color="#fff" />
      </Pressable>

      {/* Quick Calculator Modal */}
      <Modal
        visible={calcOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setCalcOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setCalcOpen(false)} />
        <MiniCalc onClose={() => setCalcOpen(false)} />
      </Modal>
    </View>
  );
}

// ─── Trade Screen Styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { padding: 14 },
  listHeader: { gap: 14, marginBottom: 4 },

  tradeHero: { borderRadius: 18, borderWidth: 1, padding: 20, alignItems: "center", gap: 6 },
  heroIcon: { width: 60, height: 60, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  heroName: { fontSize: 22, fontFamily: "Inter_700Bold" },
  heroMeta: { fontSize: 13, fontFamily: "Inter_400Regular", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 },
  refsBtn: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8, marginTop: 4 },
  refsBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  sectionLabel: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 1, marginLeft: 2 },

  calcRow: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 14, borderWidth: 1, padding: 16 },
  calcAccentDot: { width: 4, height: 36, borderRadius: 2, flexShrink: 0 },
  calcText: { flex: 1 },
  calcName: { fontSize: 16, fontFamily: "Inter_600SemiBold", marginBottom: 3 },
  calcDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },

  // FAB
  fab: {
    position: "absolute",
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },

  // Modal overlay
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
});

// ─── Mini Calc Styles ─────────────────────────────────────────────────────────

const MGAP = 6;
const MKEY_H = 58;

const mStyles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: MGAP,
  },
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 4 },
  sheetHeader: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 4, marginBottom: 4 },
  sheetIconWrap: { width: 32, height: 32, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  sheetTitle: { flex: 1, fontSize: 16, fontFamily: "Inter_600SemiBold" },
  closeBtn: { width: 32, height: 32, borderRadius: 9, borderWidth: 1, alignItems: "center", justifyContent: "center" },

  display: { borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingTop: 8, paddingBottom: 10 },
  exprLine: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "right", marginBottom: 1 },
  mainNum: { fontSize: 36, fontFamily: "Inter_700Bold", textAlign: "right", letterSpacing: -1.2, minHeight: 44 },

  keypad: { gap: MGAP },
  keyRow: { height: MKEY_H, flexDirection: "row", gap: MGAP },
  key: { flex: 1, borderRadius: 13, borderWidth: StyleSheet.hairlineWidth, alignItems: "center", justifyContent: "center" },
  keyTxt: { fontSize: 20, fontFamily: "Inter_400Regular" },
});
