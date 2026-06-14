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

import type {
  CalculatorInput,
  CalculatorResult,
  Difficulty,
} from "@/data/calculators";
import { getCalculatorById, getTradeById } from "@/data/calculators";
import { preProcessValues, validateInputs } from "@/data/validation";
import { useColors } from "@/hooks/useColors";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatVal(value: number): string {
  if (!isFinite(value) || isNaN(value)) return "—";
  if (Number.isInteger(value)) return value.toLocaleString();
  return value.toLocaleString(undefined, { maximumFractionDigits: 3 });
}

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  basic: "#10B981",
  intermediate: "#F59E0B",
  advanced: "#EF4444",
};

// ─── NumberField ──────────────────────────────────────────────────────────────

function NumberField({
  input,
  value,
  onChange,
  inputRef,
  onSubmit,
  tradeColor,
  autoFocus,
  error,
}: {
  input: CalculatorInput;
  value: string;
  onChange: (v: string) => void;
  inputRef?: React.Ref<TextInput>;
  onSubmit?: () => void;
  tradeColor: string;
  autoFocus?: boolean;
  error?: string;
}) {
  const colors = useColors();
  const [focused, setFocused] = useState(false);
  const borderColor = error ? "#EF4444" : focused ? tradeColor : colors.border;

  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
        {input.label}
      </Text>
      <View
        style={[
          styles.fieldInputRow,
          { backgroundColor: colors.input, borderColor },
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
              {
                borderLeftColor: focused
                  ? tradeColor + "40"
                  : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.fieldUnitText,
                { color: focused ? tradeColor : colors.mutedForeground },
              ]}
            >
              {input.unit}
            </Text>
          </View>
        ) : null}
      </View>
      {error ? (
        <View style={styles.inlineErrorRow}>
          <Feather name="alert-circle" size={11} color="#EF4444" />
          <Text style={styles.inlineErrorText}>{error}</Text>
        </View>
      ) : input.hint ? (
        <Text style={[styles.fieldHint, { color: colors.mutedForeground }]}>
          {input.hint}
        </Text>
      ) : null}
    </View>
  );
}

// ─── SelectField ──────────────────────────────────────────────────────────────

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

// ─── CollapsibleSection ───────────────────────────────────────────────────────

function CollapsibleSection({
  icon,
  title,
  color,
  startOpen = false,
  children,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  color: string;
  startOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(startOpen);
  const colors = useColors();

  return (
    <View
      style={[
        styles.sectionDivider,
        { borderTopColor: colors.border },
      ]}
    >
      <Pressable
        style={styles.sectionHeader}
        onPress={() => {
          Haptics.selectionAsync();
          setOpen((o) => !o);
        }}
        hitSlop={4}
      >
        <Feather name={icon} size={13} color={color} />
        <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
        <View style={{ flex: 1 }} />
        <Feather
          name={open ? "chevron-up" : "chevron-down"}
          size={13}
          color={color}
        />
      </Pressable>
      {open && (
        <View style={styles.sectionContent}>{children}</View>
      )}
    </View>
  );
}

// ─── ResultRow ────────────────────────────────────────────────────────────────

function ResultRow({
  result,
  last,
}: {
  result: CalculatorResult;
  last: boolean;
}) {
  const colors = useColors();
  const isStatus = result.value === 0 && result.unit;
  return (
    <View
      style={[
        styles.resultRow,
        !last && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <Text
        style={[styles.resultRowLabel, { color: colors.mutedForeground }]}
      >
        {result.label}
      </Text>
      <Text
        style={[styles.resultRowValue, { color: colors.foreground }]}
        numberOfLines={2}
      >
        {isStatus
          ? result.unit
          : `${formatVal(result.value)}${result.unit ? " " + result.unit : ""}`}
      </Text>
    </View>
  );
}

// ─── BulletRow ────────────────────────────────────────────────────────────────

function BulletRow({
  text,
  color,
  mono,
}: {
  text: string;
  color: string;
  mono?: boolean;
}) {
  const colors = useColors();
  return (
    <View style={styles.bulletRow}>
      {mono ? null : (
        <Text style={[styles.bulletDot, { color }]}>•</Text>
      )}
      <Text
        style={[
          mono ? styles.monoText : styles.bulletText,
          { color: colors.foreground },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function CalcScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
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

  const inputRefs = useRef<(TextInput | null)[]>([]);

  const processedValues = useMemo(
    () => preProcessValues(values),
    [values],
  );

  const validationErrors = useMemo(
    () => validateInputs(calc?.inputs ?? [], values),
    [calc, values],
  );
  const hasErrors = Object.keys(validationErrors).length > 0;

  const results: CalculatorResult[] = useMemo(() => {
    if (!calc || hasErrors) return [];
    try {
      return calc.calculate(processedValues);
    } catch {
      return [];
    }
  }, [calc, processedValues, hasErrors]);

  const computedSteps: string[] = useMemo(() => {
    if (!calc?.computeSteps || hasErrors) return [];
    try {
      return calc.computeSteps(processedValues);
    } catch {
      return [];
    }
  }, [calc, processedValues, hasErrors]);

  const primaryResult = results.find((r) => r.highlight) ?? results[0];
  const breakdownResults = results.filter((r) => r !== primaryResult);
  const primaryIsNumeric =
    primaryResult &&
    !isNaN(primaryResult.value) &&
    primaryResult.value !== 0;

  const hasHowCalc =
    computedSteps.length > 0 ||
    (calc?.calculationSteps && calc.calculationSteps.length > 0) ||
    !!calc?.formula;

  const handleReset = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setValues(defaultValues);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, [defaultValues]);

  const handleCopy = useCallback(async () => {
    if (!primaryResult) return;
    const text = primaryIsNumeric
      ? `${formatVal(primaryResult.value)} ${primaryResult.unit}`
      : (primaryResult.unit ?? "—");
    try {
      await Clipboard.setStringAsync(text);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      Share.share({ message: `${calc?.name}: ${text}` });
    }
  }, [primaryResult, primaryIsNumeric, calc]);

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
        <Text style={{ color: colors.mutedForeground }}>
          Calculator not found
        </Text>
      </View>
    );
  }

  const numericInputs = calc.inputs.filter((i) => i.type !== "select");
  const diffColor = calc.difficulty
    ? DIFFICULTY_COLOR[calc.difficulty]
    : undefined;

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Description card ──────────────────────────────────── */}
        {(calc.description || calc.category || calc.difficulty) ? (
          <View
            style={[
              styles.descCard,
              {
                backgroundColor: tradeColor + "10",
                borderColor: tradeColor + "28",
              },
            ]}
          >
            <View style={styles.descMeta}>
              <Feather name="info" size={13} color={tradeColor} />
              {calc.category ? (
                <Text
                  style={[styles.categoryText, { color: tradeColor }]}
                >
                  {calc.category.toUpperCase()}
                </Text>
              ) : null}
              {diffColor ? (
                <View
                  style={[
                    styles.diffBadge,
                    {
                      backgroundColor: diffColor + "20",
                      borderColor: diffColor + "45",
                    },
                  ]}
                >
                  <Text style={[styles.diffText, { color: diffColor }]}>
                    {(calc.difficulty ?? "").toUpperCase()}
                  </Text>
                </View>
              ) : null}
            </View>
            {calc.description ? (
              <Text
                style={[styles.descText, { color: colors.foreground }]}
              >
                {calc.description}
              </Text>
            ) : null}
          </View>
        ) : null}

        {/* ── Inputs card ───────────────────────────────────────── */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.cardHeaderDot,
                { backgroundColor: tradeColor },
              ]}
            />
            <Text
              style={[styles.cardHeaderLabel, { color: tradeColor }]}
            >
              INPUTS
            </Text>
            {hasErrors && (
              <View style={styles.errorBadge}>
                <Feather name="alert-circle" size={11} color="#EF4444" />
                <Text style={styles.errorBadgeText}>
                  {Object.keys(validationErrors).length} error
                  {Object.keys(validationErrors).length > 1 ? "s" : ""}
                </Text>
              </View>
            )}
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
                      setValues((p) => ({ ...p, [input.id]: v }))
                    }
                    tradeColor={tradeColor}
                  />
                ) : (
                  <NumberField
                    input={input}
                    value={values[input.id] ?? ""}
                    onChange={(v) =>
                      setValues((p) => ({ ...p, [input.id]: v }))
                    }
                    inputRef={(el) => {
                      const ni = numericInputs.indexOf(input);
                      if (ni >= 0) inputRefs.current[ni] = el;
                    }}
                    onSubmit={() => {
                      const ni = numericInputs.indexOf(input);
                      inputRefs.current[ni + 1]?.focus();
                    }}
                    tradeColor={tradeColor}
                    error={validationErrors[input.id]}
                  />
                )}
                {!isLast && (
                  <View
                    style={[
                      styles.fieldDivider,
                      { backgroundColor: colors.border },
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>

        {/* ── Validation banner ─────────────────────────────────── */}
        {hasErrors && (
          <View
            style={[
              styles.validationBanner,
              {
                backgroundColor: "#EF444412",
                borderColor: "#EF444430",
              },
            ]}
          >
            <Feather name="alert-circle" size={14} color="#EF4444" />
            <Text style={styles.validationBannerText}>
              Fix the highlighted inputs to see results
            </Text>
          </View>
        )}

        {/* ── Results card ──────────────────────────────────────── */}
        {!hasErrors && results.length > 0 && (
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                paddingBottom: 0,
                overflow: "hidden",
              },
            ]}
          >
            {/* Section header */}
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.cardHeaderDot,
                  { backgroundColor: tradeColor },
                ]}
              />
              <Text
                style={[styles.cardHeaderLabel, { color: tradeColor }]}
              >
                RESULTS
              </Text>
            </View>

            {/* Primary result */}
            <View
              style={[
                styles.primaryBlock,
                {
                  backgroundColor: tradeColor + "0D",
                  borderBottomColor: tradeColor + "22",
                },
              ]}
            >
              <Text
                style={[styles.primaryLabel, { color: tradeColor }]}
              >
                {(primaryResult?.label ?? "").toUpperCase()}
              </Text>

              <View style={styles.primaryValueRow}>
                {primaryIsNumeric ? (
                  <>
                    <Text
                      style={[
                        styles.primaryValue,
                        { color: colors.foreground },
                      ]}
                      adjustsFontSizeToFit
                      numberOfLines={1}
                    >
                      {formatVal(primaryResult!.value)}
                    </Text>
                    <Text
                      style={[styles.primaryUnit, { color: tradeColor }]}
                    >
                      {"  "}
                      {primaryResult!.unit}
                    </Text>
                  </>
                ) : (
                  <Text
                    style={[
                      styles.primaryValue,
                      {
                        color: colors.mutedForeground,
                        fontSize: 20,
                        letterSpacing: 0,
                      },
                    ]}
                    numberOfLines={2}
                    adjustsFontSizeToFit
                  >
                    {primaryResult?.unit ?? "—"}
                  </Text>
                )}
              </View>

              {primaryIsNumeric && (
                <Pressable
                  style={({ pressed }) => [
                    styles.copyBtn,
                    {
                      backgroundColor: copied
                        ? tradeColor
                        : tradeColor + "1A",
                      borderColor: tradeColor + "45",
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

            {/* Breakdown table */}
            {breakdownResults.length > 0 && (
              <View style={styles.breakdownTable}>
                {breakdownResults.map((r, i) => (
                  <ResultRow
                    key={i}
                    result={r}
                    last={i === breakdownResults.length - 1}
                  />
                ))}
              </View>
            )}

            {/* ── How It Was Calculated ─────────────────────────── */}
            {hasHowCalc && (
              <CollapsibleSection
                icon="cpu"
                title="HOW IT WAS CALCULATED"
                color={tradeColor}
              >
                {calc.formula ? (
                  <View
                    style={[
                      styles.formulaBox,
                      {
                        backgroundColor: tradeColor + "0D",
                        borderColor: tradeColor + "30",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.formulaText,
                        { color: colors.foreground },
                      ]}
                    >
                      {calc.formula}
                    </Text>
                  </View>
                ) : null}

                {computedSteps.length > 0
                  ? computedSteps.map((s, i) => (
                      <BulletRow key={i} text={s} color={tradeColor} mono />
                    ))
                  : (calc.calculationSteps ?? []).map((s, i) => (
                      <BulletRow key={i} text={s} color={tradeColor} />
                    ))}
              </CollapsibleSection>
            )}

            {/* ── Warnings ──────────────────────────────────────── */}
            {calc.warnings && calc.warnings.length > 0 && (
              <CollapsibleSection
                icon="alert-triangle"
                title={`WARNINGS  (${calc.warnings.length})`}
                color="#F59E0B"
                startOpen
              >
                {calc.warnings.map((w, i) => (
                  <BulletRow key={i} text={w} color="#F59E0B" />
                ))}
              </CollapsibleSection>
            )}

            {/* ── Field Notes ───────────────────────────────────── */}
            {calc.tips && calc.tips.length > 0 && (
              <CollapsibleSection
                icon="tool"
                title="FIELD NOTES"
                color="#3B82F6"
              >
                {calc.tips.map((t, i) => (
                  <BulletRow key={i} text={t} color="#3B82F6" />
                ))}
              </CollapsibleSection>
            )}

            {/* bottom padding inside card */}
            <View style={{ height: 4 }} />
          </View>
        )}

        {/* ── Code references (separate card) ───────────────────── */}
        {calc.references && calc.references.length > 0 && !hasErrors && results.length > 0 && (
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                paddingBottom: 0,
                overflow: "hidden",
              },
            ]}
          >
            <CollapsibleSection
              icon="book-open"
              title="CODE REFERENCES"
              color={colors.mutedForeground}
            >
              {calc.references.map((r, i) => (
                <BulletRow key={i} text={r} color={colors.mutedForeground} />
              ))}
            </CollapsibleSection>
            <View style={{ height: 4 }} />
          </View>
        )}

        {/* bottom scroll padding */}
        <View style={{ height: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12 },

  // Description
  descCard: {
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  descMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  categoryText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.1,
  },
  diffBadge: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  diffText: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.8,
  },
  descText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },

  // Cards
  card: {
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
  cardHeaderDot: { width: 6, height: 6, borderRadius: 3 },
  cardHeaderLabel: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.2,
    flex: 1,
  },
  errorBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EF444415",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  errorBadgeText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: "#EF4444",
  },

  // Fields
  fieldWrap: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  fieldLabel: { fontSize: 15, fontFamily: "Inter_500Medium" },
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
  inlineErrorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  inlineErrorText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#EF4444",
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
  selectChipText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

  // Validation banner
  validationBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  validationBannerText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "#EF4444",
    flex: 1,
  },

  // Primary result block
  primaryBlock: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
  },
  primaryValue: {
    fontSize: 52,
    fontFamily: "Inter_700Bold",
    letterSpacing: -2,
    textAlign: "center",
  },
  primaryUnit: {
    fontSize: 22,
    fontFamily: "Inter_600SemiBold",
    paddingBottom: 6,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 6,
  },
  copyBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },

  // Breakdown table
  breakdownTable: {
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 12,
    gap: 8,
  },
  resultRowLabel: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  resultRowValue: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    textAlign: "right",
    flexShrink: 1,
  },

  // Collapsible section
  sectionDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.8,
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 5,
  },

  // Bullet / mono rows
  bulletRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  bulletDot: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Inter_700Bold",
    minWidth: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  monoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    lineHeight: 19,
  },

  // Formula box
  formulaBox: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    marginBottom: 6,
  },
  formulaText: {
    fontSize: 12,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    lineHeight: 19,
  },
});
