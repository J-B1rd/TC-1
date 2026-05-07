import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { CalculatorInput, CalculatorResult } from "@/data/calculators";
import { getCalculatorById, getTradeById } from "@/data/calculators";
import { useColors } from "@/hooks/useColors";

function SelectInput({
  input,
  value,
  onChange,
}: {
  input: CalculatorInput;
  value: string;
  onChange: (v: string) => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.selectWrap}>
      {(input.options ?? []).map((opt) => {
        const active = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            style={[
              styles.selectOption,
              {
                backgroundColor: active ? colors.primary : colors.secondary,
                borderColor: active ? colors.primary : colors.border,
              },
            ]}
            onPress={() => {
              Haptics.selectionAsync();
              onChange(opt.value);
            }}
          >
            <Text
              style={[
                styles.selectLabel,
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
  );
}

function ResultRow({
  result,
  tradeColor,
}: {
  result: CalculatorResult;
  tradeColor: string;
}) {
  const colors = useColors();
  if (result.highlight) {
    return (
      <View
        style={[
          styles.resultHighlight,
          { backgroundColor: tradeColor + "18", borderColor: tradeColor + "44" },
        ]}
      >
        <Text style={[styles.resultHighlightLabel, { color: tradeColor }]}>
          {result.label}
        </Text>
        <View style={styles.resultHighlightValueRow}>
          {result.unit && !isNaN(result.value) && result.value !== 0 ? (
            <>
              <Text
                style={[styles.resultHighlightValue, { color: colors.foreground }]}
              >
                {Number.isInteger(result.value)
                  ? result.value.toLocaleString()
                  : result.value.toLocaleString(undefined, {
                      maximumFractionDigits: 3,
                    })}
              </Text>
              <Text
                style={[styles.resultHighlightUnit, { color: tradeColor }]}
              >
                {" "}{result.unit}
              </Text>
            </>
          ) : (
            <Text
              style={[styles.resultHighlightValue, { color: colors.foreground }]}
            >
              {result.unit}
            </Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.resultRow,
        { borderBottomColor: colors.border },
      ]}
    >
      <Text style={[styles.resultLabel, { color: colors.mutedForeground }]}>
        {result.label}
      </Text>
      <View style={styles.resultRight}>
        {!isNaN(result.value) && result.value !== 0 ? (
          <>
            <Text style={[styles.resultValue, { color: colors.foreground }]}>
              {Number.isInteger(result.value)
                ? result.value.toLocaleString()
                : result.value.toLocaleString(undefined, {
                    maximumFractionDigits: 3,
                  })}
            </Text>
            <Text
              style={[styles.resultUnit, { color: colors.mutedForeground }]}
            >
              {" "}{result.unit}
            </Text>
          </>
        ) : (
          <Text style={[styles.resultValue, { color: colors.foreground }]}>
            {result.unit}
          </Text>
        )}
      </View>
    </View>
  );
}

export default function CalculatorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";

  const [tradeId, calcId] = (id ?? "").split("--");
  const trade = getTradeById(tradeId);
  const calc = getCalculatorById(tradeId, calcId);

  const defaultValues = useMemo(() => {
    const init: Record<string, string> = {};
    calc?.inputs.forEach((inp) => {
      init[inp.id] = inp.defaultValue ?? "";
    });
    return init;
  }, [calc]);

  const [values, setValues] = useState<Record<string, string>>(defaultValues);

  const results: CalculatorResult[] = useMemo(() => {
    if (!calc) return [];
    try {
      return calc.calculate(values);
    } catch {
      return [];
    }
  }, [calc, values]);

  const handleReset = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setValues(defaultValues);
  }, [defaultValues]);

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 20;
  const tradeColor = trade?.color ?? "#FF6B00";

  if (!calc || !trade) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.mutedForeground }}>
          Calculator not found
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Inputs */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Feather name="sliders" size={15} color={tradeColor} />
            <Text style={[styles.sectionTitle, { color: tradeColor }]}>
              INPUTS
            </Text>
          </View>

          {calc.inputs.map((input, idx) => (
            <View
              key={input.id}
              style={[
                styles.inputRow,
                idx < calc.inputs.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <View style={styles.inputLabelRow}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                  {input.label}
                </Text>
                {input.unit ? (
                  <Text
                    style={[styles.inputUnit, { color: colors.mutedForeground }]}
                  >
                    {input.unit}
                  </Text>
                ) : null}
              </View>

              {input.type === "select" ? (
                <SelectInput
                  input={input}
                  value={values[input.id] ?? input.defaultValue ?? ""}
                  onChange={(v) =>
                    setValues((prev) => ({ ...prev, [input.id]: v }))
                  }
                />
              ) : (
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colors.input,
                      color: colors.foreground,
                      borderColor: colors.border,
                    },
                  ]}
                  value={values[input.id] ?? ""}
                  onChangeText={(v) =>
                    setValues((prev) => ({ ...prev, [input.id]: v }))
                  }
                  keyboardType="decimal-pad"
                  placeholder={input.defaultValue ?? "0"}
                  placeholderTextColor={colors.mutedForeground}
                  returnKeyType="done"
                  selectTextOnFocus
                />
              )}

              {input.hint ? (
                <Text
                  style={[styles.inputHint, { color: colors.mutedForeground }]}
                >
                  {input.hint}
                </Text>
              ) : null}
            </View>
          ))}
        </View>

        {/* Results */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Feather name="bar-chart-2" size={15} color={tradeColor} />
            <Text style={[styles.sectionTitle, { color: tradeColor }]}>
              RESULTS
            </Text>
          </View>

          {results.length === 0 ? (
            <View style={styles.emptyResults}>
              <Feather name="alert-circle" size={20} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                Enter values above to see results
              </Text>
            </View>
          ) : (
            results.map((r, i) => (
              <ResultRow key={i} result={r} tradeColor={tradeColor} />
            ))
          )}
        </View>

        {/* Reset */}
        <Pressable
          style={({ pressed }) => [
            styles.resetBtn,
            {
              backgroundColor: colors.secondary,
              borderColor: colors.border,
              opacity: pressed ? 0.6 : 1,
            },
          ]}
          onPress={handleReset}
        >
          <Feather name="refresh-cw" size={14} color={colors.mutedForeground} />
          <Text style={[styles.resetLabel, { color: colors.mutedForeground }]}>
            Reset to Defaults
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  scroll: { padding: 16, gap: 12 },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 14,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.2,
  },
  inputRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  inputLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  inputUnit: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  textInput: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  inputHint: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  selectWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  selectOption: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
  },
  selectLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  resultHighlight: {
    margin: 12,
    marginTop: 4,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  resultHighlightLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  resultHighlightValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  resultHighlightValue: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
  },
  resultHighlightUnit: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    marginLeft: 4,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  resultLabel: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  resultRight: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  resultValue: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  resultUnit: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  emptyResults: {
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  resetLabel: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
});
