import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getTradeById } from "@/data/calculators";
import { tradeReferences } from "@/data/references";
import { useColors } from "@/hooks/useColors";

export default function TradeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const trade = getTradeById(id ?? "");
  const refCount = tradeReferences[id ?? ""]?.length ?? 0;
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
            {/* Trade identity */}
            <View
              style={[
                styles.tradeHero,
                {
                  backgroundColor: trade.color + "14",
                  borderColor: trade.color + "2A",
                },
              ]}
            >
              <View
                style={[styles.heroIcon, { backgroundColor: trade.color + "25" }]}
              >
                <Feather
                  name={trade.icon as keyof typeof Feather.glyphMap}
                  size={28}
                  color={trade.color}
                />
              </View>
              <Text style={[styles.heroName, { color: colors.foreground }]}>
                {trade.name}
              </Text>
              <Text style={[styles.heroMeta, { color: colors.mutedForeground }]}>
                {trade.calculators.length} calculators
              </Text>

              {refCount > 0 && (
                <Pressable
                  onPress={() => router.push(`/refs/${trade.id}`)}
                  style={({ pressed }) => [
                    styles.refsBtn,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      opacity: pressed ? 0.7 : 1,
                    },
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

            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              CALCULATORS
            </Text>
          </View>
        }
        renderItem={({ item: calc }) => (
          <Pressable
            style={({ pressed }) => [
              styles.calcRow,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.75 : 1,
                transform: [{ scale: pressed ? 0.985 : 1 }],
              },
            ]}
            onPress={() => router.push(`/calc/${trade.id}--${calc.id}`)}
          >
            <View
              style={[styles.calcAccentDot, { backgroundColor: trade.color }]}
            />
            <View style={styles.calcText}>
              <Text style={[styles.calcName, { color: colors.foreground }]}>
                {calc.name}
              </Text>
              <Text
                style={[styles.calcDesc, { color: colors.mutedForeground }]}
                numberOfLines={2}
              >
                {calc.description}
              </Text>
            </View>
            <Feather
              name="chevron-right"
              size={16}
              color={colors.mutedForeground}
            />
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { padding: 14 },
  listHeader: { gap: 14, marginBottom: 4 },

  tradeHero: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    gap: 6,
  },
  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  heroName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  heroMeta: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  refsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 4,
  },
  refsBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },

  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
    marginLeft: 2,
  },

  calcRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  calcAccentDot: {
    width: 4,
    height: 36,
    borderRadius: 2,
    flexShrink: 0,
  },
  calcText: { flex: 1 },
  calcName: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 3,
  },
  calcDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
});
