import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { trades } from "@/data/calculators";
import { tradeReferences } from "@/data/references";
import { useColors } from "@/hooks/useColors";

function SettingRow({
  icon,
  label,
  value,
  accent,
}: {
  icon: string;
  label: string;
  value?: string;
  accent?: string;
}) {
  const colors = useColors();
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <View
        style={[
          styles.rowIcon,
          { backgroundColor: (accent ?? colors.primary) + "20" },
        ]}
      >
        <Feather
          name={icon as keyof typeof Feather.glyphMap}
          size={16}
          color={accent ?? colors.primary}
        />
      </View>
      <Text style={[styles.rowLabel, { color: colors.foreground }]}>
        {label}
      </Text>
      {value ? (
        <Text style={[styles.rowValue, { color: colors.mutedForeground }]}>
          {value}
        </Text>
      ) : null}
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  const colors = useColors();
  return (
    <Text style={[styles.sectionHeader, { color: colors.mutedForeground }]}>
      {title}
    </Text>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 20;

  const totalCalcs = trades.reduce((n, t) => n + t.calculators.length, 0);
  const totalRefs = Object.values(tradeReferences).reduce(
    (n, arr) => n + arr.length,
    0
  );
  const totalTrades = trades.length;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      {/* App identity card */}
      <View
        style={[
          styles.identityCard,
          { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" },
        ]}
      >
        <View style={[styles.appIcon, { backgroundColor: colors.primary }]}>
          <Feather name="tool" size={32} color="#fff" />
        </View>
        <Text style={[styles.appName, { color: colors.foreground }]}>
          Tradesman Toolkit
        </Text>
        <Text style={[styles.appTagline, { color: colors.mutedForeground }]}>
          Field Calculators · Fully Offline
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { value: totalTrades, label: "Trades" },
          { value: totalCalcs, label: "Calculators" },
          { value: totalRefs, label: "References" },
        ].map(({ value, label }) => (
          <View
            key={label}
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {value}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* Display */}
      <SectionHeader title="DISPLAY" />
      <View
        style={[
          styles.section,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <SettingRow
          icon="moon"
          label="Theme"
          value={
            scheme === "dark"
              ? "Dark (system)"
              : scheme === "light"
              ? "Light (system)"
              : "System default"
          }
          accent="#6366F1"
        />
        <View style={[styles.row, { borderBottomColor: "transparent" }]}>
          <View
            style={[styles.rowIcon, { backgroundColor: "#6366F120" }]}
          >
            <Feather name="info" size={16} color="#6366F1" />
          </View>
          <Text
            style={[
              styles.rowHint,
              { color: colors.mutedForeground },
            ]}
          >
            Theme follows your device's system setting. Change it in your
            phone's Display settings.
          </Text>
        </View>
      </View>

      {/* Units */}
      <SectionHeader title="UNITS" />
      <View
        style={[
          styles.section,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <SettingRow
          icon="ruler"
          label="Measurement System"
          value="Imperial (US)"
          accent="#0EA5E9"
        />
        <View style={[styles.row, { borderBottomColor: "transparent" }]}>
          <View
            style={[styles.rowIcon, { backgroundColor: "#0EA5E920" }]}
          >
            <Feather name="info" size={16} color="#0EA5E9" />
          </View>
          <Text style={[styles.rowHint, { color: colors.mutedForeground }]}>
            All calculators use US Imperial units (feet, inches, gallons, BTU).
          </Text>
        </View>
      </View>

      {/* Data */}
      <SectionHeader title="DATA & PRIVACY" />
      <View
        style={[
          styles.section,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <SettingRow
          icon="wifi-off"
          label="Works fully offline"
          value="No internet needed"
          accent="#10B981"
        />
        <SettingRow
          icon="lock"
          label="No data collected"
          value="All local"
          accent="#10B981"
        />
        <View style={[styles.row, { borderBottomColor: "transparent" }]}>
          <View
            style={[styles.rowIcon, { backgroundColor: "#10B98120" }]}
          >
            <Feather name="shield" size={16} color="#10B981" />
          </View>
          <Text style={[styles.rowHint, { color: colors.mutedForeground }]}>
            No accounts, no tracking, no analytics. Your inputs never leave
            your device.
          </Text>
        </View>
      </View>

      {/* About */}
      <SectionHeader title="ABOUT" />
      <View
        style={[
          styles.section,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <SettingRow icon="package" label="Version" value="1.0.0" />
        <SettingRow
          icon="book-open"
          label="NEC References"
          value="2023 Edition"
        />
        <SettingRow
          icon="home"
          label="IRC References"
          value="2021 Edition"
        />
        <SettingRow
          icon="alert-triangle"
          label="Disclaimer"
          accent="#F59E0B"
          label2="Always verify calculations with local codes and a licensed professional."
        />
      </View>

      <Text style={[styles.footer, { color: colors.mutedForeground }]}>
        Results are estimates. Always verify with local codes,{"\n"}
        manufacturer specs, and a licensed professional.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  identityCard: {
    margin: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
  },
  appIcon: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  appName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
  },
  statValue: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionHeader: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  section: {
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  rowValue: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  rowHint: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
  footer: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 18,
    marginTop: 24,
    marginHorizontal: 24,
  },
});
