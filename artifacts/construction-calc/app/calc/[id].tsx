import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { CalculatorInput, CalculatorResult } from "@/data/calculators";
import { getCalculatorById, getTradeById } from "@/data/calculators";
import { useColors } from "@/hooks/useColors";

// ─── Input field with inline unit ───────────────────────────────────────────

function NumberField({
  input,
  value,
  onChange,
  inputRef,
  onSubmit,
  tradeColor,
  autoFocus,
}: {
  input: CalculatorInput;
  value: string;
  onChange: (v: string) => void;
  inputRef?: React.Ref<TextInput>;
  onSubmit?: () => void;
  tradeColor: string;
  autoFocus?: boolean;
}) {
  const colors = useColors();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
        {input.label}
      </Text>

      <View
        style={[
          styles.fieldInputRow,
          {
            backgroundColor: colors.input,
            borderColor: focused ? tradeColor : colors.border,
          },
        ]}
      >
        <TextInput
          ref={inputRef}
          style={[styles.fieldInput, { color: colors.foreground }]}
          value={value}
          onChangeText={onChange}
          keyboardType="decimal-pad"
          placeholder={input.defaultValue ?? "0"}
          placeholderTextColor={colors.mutedForeground}
          returnKeyType="done"
          selectTextOnFocus
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={onSubmit}
        />
        {input.unit ? (
          <View
            style={[
              styles.fieldUnit,
              { borderLeftColor: focused ? tradeColor + "40" : colors.border },
            ]}
          >
            <Text style={[styles.fieldUnitText, { color: focused ? tradeColor : colors.mutedForeground }]}>
              {input.unit}
            </Text>
          </View>
        ) : null}
      </View>

      {input.hint ? (
        <Text style={[styles.fieldHint, { color: colors.mutedForeground }]}>
          {input.hint}
        </Text>
      ) : null}
    </View>
  );
}

// ─── Select input ────────────────────────────────────────────────────────────

function SelectField({
  input,
  value,
  onChange,
  tradeColor,
}: {
  input: CalculatorInput;
  value: string;
  onChange: (v: string) => void;
  tradeColor: string;
}) {
  const colors = useColors();
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
        {input.label}
      </Text>
      <View style={styles.selectRow}>
        {(input.options ?? []).map((opt) => {
          const active = value === opt.value;
          return (
            <Pressable
              key={opt.value}
              style={[
                styles.selectChip,
                {
                  backgroundColor: active ? tradeColor : colors.input,
                  borderColor: active ? tradeColor : colors.border,
                },
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                onChange(opt.value);
              }}
            >
              <Text
                style={[
                  styles.selectChipText,
                  { color: active ? "#fff" : colors.foreground },
                ]}
                numberOfLines={1}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {input.hint ? (
        <Text style={[styles.fieldHint, { color: colors.mutedForeground }]}>
          {input.hint}
        </Text>
      ) : null}
    </View>
  );
}

// ─── Result value formatter ──────────────────────────────────────────────────

function formatVal(value: number): string {
  if (!isFinite(value) || isNaN(value)) return "—";
  if (Number.isInteger(value)) return value.toLocaleString();
  return value.toLocaleString(undefined, { maximumFractionDigits: 3 });
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function CalcScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [tradeId, calcId] = (id ?? "").split("--");
  const trade = getTradeById(tradeId);
  const calc = getCalculatorById(tradeId, calcId);

  const tradeColor = trade?.color ?? "#FF6B00";

  const defaultValues = useMemo(() => {
    const init: Record<string, string> = {};
    calc?.inputs.forEach((inp) => {
      init[inp.id] = inp.defaultValue ?? "";
    });
    return init;
  }, [calc]);

  const [values, setValues] = useState<Record<string, string>>(defaultValues);
  const [copied, setCopied] = useState(false);

  // Refs for auto-focus chaining
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const results: CalculatorResult[] = useMemo(() => {
    if (!calc) return [];
    try {
      return calc.calculate(values);
    } catch {
      return [];
    }
  }, [calc, values]);

  const primaryResult = results.find((r) => r.highlight) ?? results[0];
  const secondaryResults = results.filter((r) => r !== primaryResult);

  const handleReset = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setValues(defaultValues);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, [defaultValues]);

  const handleCopy = useCallback(async () => {
    if (!primaryResult) return;
    const text =
      primaryResult.unit && !isNaN(primaryResult.value)
        ? `${formatVal(primaryResult.value)} ${primaryResult.unit}`
        : primaryResult.unit ?? "—";
    try {
      await Clipboard.setStringAsync(text);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      Share.share({ message: `${calc?.name}: ${text}` });
    }
  }, [primaryResult, calc]);

  const bottomPad = Platform.OS === "web" ? 0 : insets.bottom;

  // Set header reset button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={handleReset}
          hitSlop={12}
          style={{ marginRight: 4, padding: 6 }}
        >
          <Feather name="refresh-cw" size={18} color={tradeColor} />
        </Pressable>
      ),
    });
  }, [navigation, handleReset, tradeColor]);

  if (!calc || !trade) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.mutedForeground }}>Calculator not found</Text>
      </View>
    );
  }

  const numericInputs = calc.inputs.filter((i) => i.type !== "select");
  const hasResults = results.length > 0;
  const primaryIsValid =
    primaryResult &&
    !isNaN(primaryResult.value) &&
    primaryResult.value !== 0;

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* ── Scrollable input area ─────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Calculator description */}
        {calc.description ? (
          <View
            style={[
              styles.descCard,
              { backgroundColor: tradeColor + "12", borderColor: tradeColor + "30" },
            ]}
          >
            <Feather name="info" size={13} color={tradeColor} />
            <Text style={[styles.descText, { color: colors.foreground }]}>
              {calc.description}
            </Text>
          </View>
        ) : null}

        {/* Inputs */}
        <View
          style={[
            styles.inputsCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.cardHeaderDot, { backgroundColor: tradeColor }]} />
            <Text style={[styles.cardHeaderLabel, { color: tradeColor }]}>
              INPUTS
            </Text>
          </View>

          {calc.inputs.map((input, idx) => {
            const isLast = idx === calc.inputs.length - 1;
            return (
              <View key={input.id}>
                {input.type === "select" ? (
                  <SelectField
                    input={input}
                    value={values[input.id] ?? input.defaultValue ?? ""}
                    onChange={(v) =>
                      setValues((prev) => ({ ...prev, [input.id]: v }))
                    }
                    tradeColor={tradeColor}
                  />
                ) : (
                  <NumberField
                    input={input}
                    value={values[input.id] ?? ""}
                    onChange={(v) =>
                      setValues((prev) => ({ ...prev, [input.id]: v }))
                    }
                    inputRef={(el) => {
                      const numIdx = numericInputs.indexOf(input);
                      if (numIdx >= 0) inputRefs.current[numIdx] = el;
                    }}
                    onSubmit={() => {
                      const numIdx = numericInputs.indexOf(input);
                      inputRefs.current[numIdx + 1]?.focus();
                    }}
                    tradeColor={tradeColor}
                    autoFocus={idx === 0}
                  />
                )}
                {!isLast && (
                  <View
                    style={[styles.fieldDivider, { backgroundColor: colors.border }]}
                  />
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* ── Sticky results panel ──────────────────────────────────────── */}
      <View
        style={[
          styles.resultsPanel,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: bottomPad + 12,
          },
        ]}
      >
        {/* Primary result */}
        {primaryResult ? (
          <View
            style={[
              styles.primaryResult,
              { backgroundColor: tradeColor + "10", borderColor: tradeColor + "25" },
            ]}
          >
            <Text style={[styles.primaryLabel, { color: tradeColor }]}>
              {primaryResult.label.toUpperCase()}
            </Text>

            <View style={styles.primaryValueRow}>
              {primaryIsValid ? (
                <>
                  <Text
                    style={[styles.primaryValue, { color: colors.foreground }]}
                    adjustsFontSizeToFit
                    numberOfLines={1}
                  >
                    {formatVal(primaryResult.value)}
                  </Text>
                  <Text style={[styles.primaryUnit, { color: tradeColor }]}>
                    {"  "}{primaryResult.unit}
                  </Text>
                </>
              ) : (
                <Text style={[styles.primaryValue, { color: colors.mutedForeground, fontSize: 28 }]}>
                  Enter values above
                </Text>
              )}
            </View>

            {/* Copy button */}
            {primaryIsValid && (
              <Pressable
                style={({ pressed }) => [
                  styles.copyBtn,
                  {
                    backgroundColor: copied ? tradeColor : tradeColor + "20",
                    borderColor: tradeColor + "50",
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                onPress={handleCopy}
              >
                <Feather
                  name={copied ? "check" : "copy"}
                  size={12}
                  color={copied ? "#fff" : tradeColor}
                />
                <Text
                  style={[
                    styles.copyBtnText,
                    { color: copied ? "#fff" : tradeColor },
                  ]}
                >
                  {copied ? "Copied!" : "Copy"}
                </Text>
              </Pressable>
            )}
          </View>
        ) : (
          <View style={[styles.primaryResult, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <Text style={[styles.primaryValue, { color: colors.mutedForeground, fontSize: 28 }]}>
              Enter values above
            </Text>
          </View>
        )}

        {/* Secondary results */}
        {secondaryResults.length > 0 && (
          <View style={styles.secondaryList}>
            {secondaryResults.map((r, i) => {
              const valid = !isNaN(r.value) && r.value !== 0;
              return (
                <View
                  key={i}
                  style={[
                    styles.secondaryRow,
                    i < secondaryResults.length - 1 && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.secondaryLabel, { color: colors.mutedForeground }]}>
                    {r.label}
                  </Text>
                  <Text style={[styles.secondaryValue, { color: colors.foreground }]}>
                    {valid
                      ? `${formatVal(r.value)}${r.unit ? " " + r.unit : ""}`
                      : r.unit ?? "—"}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 8 },

  descCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  descText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },

  inputsCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  cardHeaderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  cardHeaderLabel: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.2,
  },
  fieldWrap: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  fieldLabel: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  fieldInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1.5,
    height: 56,
    overflow: "hidden",
  },
  fieldInput: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 22,
    fontFamily: "Inter_600SemiBold",
  },
  fieldUnit: {
    paddingHorizontal: 12,
    height: "100%",
    justifyContent: "center",
    borderLeftWidth: 1,
  },
  fieldUnitText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldHint: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    lineHeight: 15,
  },
  fieldDivider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
  },

  selectRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  selectChip: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1.5,
  },
  selectChipText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },

  // ── Results panel ─────────────────────────────────────────────────────────
  resultsPanel: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 14,
    paddingHorizontal: 14,
    gap: 10,
  },
  primaryResult: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
    gap: 4,
  },
  primaryLabel: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.4,
  },
  primaryValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 0,
  },
  primaryValue: {
    fontSize: 48,
    fontFamily: "Inter_700Bold",
    letterSpacing: -2,
    textAlign: "center",
  },
  primaryUnit: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    marginLeft: 2,
    paddingBottom: 4,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 4,
  },
  copyBtnText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },

  secondaryList: {
    borderRadius: 12,
    overflow: "hidden",
  },
  secondaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
    gap: 8,
  },
  secondaryLabel: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  secondaryValue: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
});
