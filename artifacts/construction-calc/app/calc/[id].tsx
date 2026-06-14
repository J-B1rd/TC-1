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

import type { CalculatorInput, CalculatorResult, Difficulty } from "@/data/calculators";
import { getCalculatorById, getTradeById } from "@/data/calculators";
import { validateInputs, preProcessValues } from "@/data/validation";
import { useColors } from "@/hooks/useColors";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatVal(value: number): string {
  if (!isFinite(value) || isNaN(value)) return "—";
  if (Number.isInteger(value)) return value.toLocaleString();
  return value.toLocaleString(undefined, { maximumFractionDigits: 3 });
}

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  basic:        "#10B981",
  intermediate: "#F59E0B",
  advanced:     "#EF4444",
};

// ─── Number field ─────────────────────────────────────────────────────────────

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
              { borderLeftColor: focused ? tradeColor + "40" : colors.border },
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
        <View style={styles.errorRow}>
          <Feather name="alert-circle" size={11} color="#EF4444" />
          <Text style={styles.fieldError}>{error}</Text>
        </View>
      ) : input.hint ? (
        <Text style={[styles.fieldHint, { color: colors.mutedForeground }]}>
          {input.hint}
        </Text>
      ) : null}
    </View>
  );
}

// ─── Select field ─────────────────────────────────────────────────────────────

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

// ─── Collapsible info card ────────────────────────────────────────────────────

function InfoCard({
  icon,
  title,
  items,
  color,
  startOpen = false,
  mono = false,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  items: string[];
  color: string;
  startOpen?: boolean;
  mono?: boolean;
}) {
  const [open, setOpen] = useState(startOpen);
  const colors = useColors();

  return (
    <View style={[styles.infoCard, { borderColor: color + "35" }]}>
      <Pressable
        style={[styles.infoCardHeader, { backgroundColor: color + "15" }]}
        onPress={() => {
          Haptics.selectionAsync();
          setOpen((o) => !o);
        }}
        hitSlop={4}
      >
        <Feather name={icon} size={13} color={color} />
        <Text style={[styles.infoCardTitle, { color }]}>{title}</Text>
        <View style={{ flex: 1 }} />
        <Feather
          name={open ? "chevron-up" : "chevron-down"}
          size={13}
          color={color}
        />
      </Pressable>
      {open && (
        <View style={[styles.infoCardBody, { borderTopColor: color + "25" }]}>
          {items.map((item, i) => (
            <View key={i} style={styles.infoCardRow}>
              <Text style={[styles.infoCardBullet, { color }]}>
                {mono ? "" : "•"}
              </Text>
              <Text
                style={[
                  mono ? styles.infoCardMono : styles.infoCardItem,
                  { color: colors.foreground },
                ]}
              >
                {item}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Formula box ─────────────────────────────────────────────────────────────

function FormulaCard({
  formula,
  steps,
  color,
}: {
  formula?: string;
  steps?: string[];
  color: string;
}) {
  const [open, setOpen] = useState(false);
  const colors = useColors();
  if (!formula && (!steps || steps.length === 0)) return null;

  return (
    <View style={[styles.infoCard, { borderColor: color + "35" }]}>
      <Pressable
        style={[styles.infoCardHeader, { backgroundColor: color + "12" }]}
        onPress={() => {
          Haptics.selectionAsync();
          setOpen((o) => !o);
        }}
        hitSlop={4}
      >
        <Feather name="code" size={13} color={color} />
        <Text style={[styles.infoCardTitle, { color }]}>
          How It&apos;s Calculated
        </Text>
        <View style={{ flex: 1 }} />
        <Feather
          name={open ? "chevron-up" : "chevron-down"}
          size={13}
          color={color}
        />
      </Pressable>
      {open && (
        <View style={[styles.infoCardBody, { borderTopColor: color + "25" }]}>
          {formula ? (
            <View
              style={[
                styles.formulaBox,
                { backgroundColor: color + "10", borderColor: color + "30" },
              ]}
            >
              <Text style={[styles.formulaText, { color: colors.foreground }]}>
                {formula}
              </Text>
            </View>
          ) : null}
          {steps?.map((step, i) => (
            <View key={i} style={styles.infoCardRow}>
              <Text style={[styles.infoCardItem, { color: colors.foreground }]}>
                {step}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function CalcScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [tradeId, calcId] = (id ?? "").split("--");
  const trade = getTradeById(tradeId);
  const calc  = getCalculatorById(tradeId, calcId);

  const tradeColor = trade?.color ?? "#FF6B00";

  const defaultValues = useMemo(() => {
    const init: Record<string, string> = {};
    calc?.inputs.forEach((inp) => { init[inp.id] = inp.defaultValue ?? ""; });
    return init;
  }, [calc]);

  const [values, setValues] = useState<Record<string, string>>(defaultValues);
  const [copied, setCopied] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Fraction-aware pre-processing: "3/4" → "0.75" before passing to calculate()
  const processedValues = useMemo(() => preProcessValues(values), [values]);

  // Validation errors (keyed by input id)
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

  const primaryResult    = results.find((r) => r.highlight) ?? results[0];
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
  const primaryIsValid =
    primaryResult && !isNaN(primaryResult.value) && primaryResult.value !== 0;
  const diffColor = calc.difficulty
    ? DIFFICULTY_COLOR[calc.difficulty]
    : undefined;

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* ── Scrollable area ──────────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Description / category / difficulty */}
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
            <View style={styles.descTop}>
              <Feather name="info" size={13} color={tradeColor} />
              {calc.category ? (
                <Text style={[styles.categoryText, { color: tradeColor }]}>
                  {calc.category.toUpperCase()}
                </Text>
              ) : null}
              {diffColor ? (
                <View
                  style={[
                    styles.diffBadge,
                    {
                      backgroundColor: diffColor + "20",
                      borderColor: diffColor + "40",
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
              <Text style={[styles.descText, { color: colors.foreground }]}>
                {calc.description}
              </Text>
            ) : null}
          </View>
        ) : null}

        {/* Inputs card */}
        <View
          style={[
            styles.inputsCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.cardHeader}>
            <View
              style={[styles.cardHeaderDot, { backgroundColor: tradeColor }]}
            />
            <Text style={[styles.cardHeaderLabel, { color: tradeColor }]}>
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
                    autoFocus={false}
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

        {/* ── Supplementary info cards ─────────────────────────────── */}

        {calc.warnings && calc.warnings.length > 0 && (
          <InfoCard
            icon="alert-triangle"
            title={`Warnings  (${calc.warnings.length})`}
            items={calc.warnings}
            color="#F59E0B"
            startOpen
          />
        )}

        <FormulaCard
          formula={calc.formula}
          steps={calc.calculationSteps}
          color={tradeColor}
        />

        {calc.tips && calc.tips.length > 0 && (
          <InfoCard
            icon="zap"
            title="Pro Tips"
            items={calc.tips}
            color="#3B82F6"
          />
        )}

        {calc.references && calc.references.length > 0 && (
          <InfoCard
            icon="book-open"
            title="Code References"
            items={calc.references}
            color={colors.mutedForeground}
          />
        )}
      </ScrollView>

      {/* ── Sticky results panel ─────────────────────────────────────── */}
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
        {/* Validation error summary */}
        {hasErrors && (
          <View
            style={[
              styles.validationBanner,
              { backgroundColor: "#EF444415", borderColor: "#EF444435" },
            ]}
          >
            <Feather name="alert-circle" size={13} color="#EF4444" />
            <Text style={styles.validationBannerText}>
              Fix the highlighted inputs above to see results
            </Text>
          </View>
        )}

        {/* Primary result */}
        {!hasErrors && primaryResult ? (
          <View
            style={[
              styles.primaryResult,
              {
                backgroundColor: tradeColor + "10",
                borderColor: tradeColor + "25",
              },
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
                    {"  "}
                    {primaryResult.unit}
                  </Text>
                </>
              ) : (
                <Text
                  style={[
                    styles.primaryValue,
                    { color: colors.mutedForeground, fontSize: 22 },
                  ]}
                  adjustsFontSizeToFit
                  numberOfLines={1}
                >
                  {primaryResult.unit || "Enter values above"}
                </Text>
              )}
            </View>

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
        ) : !hasErrors ? (
          <View
            style={[
              styles.primaryResult,
              { backgroundColor: colors.muted, borderColor: colors.border },
            ]}
          >
            <Text
              style={[
                styles.primaryValue,
                { color: colors.mutedForeground, fontSize: 28 },
              ]}
            >
              Enter values above
            </Text>
          </View>
        ) : null}

        {/* Secondary results */}
        {!hasErrors && secondaryResults.length > 0 && (
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
                  <Text
                    style={[
                      styles.secondaryLabel,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {r.label}
                  </Text>
                  <Text
                    style={[
                      styles.secondaryValue,
                      { color: colors.foreground },
                    ]}
                    numberOfLines={2}
                  >
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen:        { flex: 1 },
  center:        { flex: 1, alignItems: "center", justifyContent: "center" },
  scroll:        { flex: 1 },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 8 },

  // ── Description card
  descCard: {
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  descTop: {
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

  // ── Inputs card
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

  // ── Fields
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
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  fieldError: {
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
  selectChipText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },

  // ── Info cards
  infoCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  infoCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  infoCardTitle: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.6,
  },
  infoCardBody: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  infoCardRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  infoCardBullet: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "Inter_700Bold",
    minWidth: 10,
  },
  infoCardItem: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  infoCardMono: {
    flex: 1,
    fontSize: 12,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    lineHeight: 19,
  },
  formulaBox: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    marginBottom: 4,
  },
  formulaText: {
    fontSize: 13,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    lineHeight: 20,
  },

  // ── Results panel
  validationBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  validationBannerText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "#EF4444",
    flex: 1,
  },
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
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    textAlign: "right",
    flexShrink: 1,
  },
});
