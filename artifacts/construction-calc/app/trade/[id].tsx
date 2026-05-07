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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={trade.calculators}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View
              style={[
                styles.tradeHeader,
                {
                  backgroundColor: trade.color + "18",
                  borderColor: trade.color + "33",
                },
              ]}
            >
              <View
                style={[
                  styles.tradeIconBg,
                  { backgroundColor: trade.color + "2A" },
                ]}
              >
                <Feather
                  name={trade.icon as keyof typeof Feather.glyphMap}
                  size={32}
                  color={trade.color}
                />
              </View>
              <Text style={[styles.tradeTitle, { color: colors.foreground }]}>
                {trade.name}
              </Text>
              <Text style={[styles.tradeSub, { color: colors.mutedForeground }]}>
                {trade.calculators.length} calculators
              </Text>

              {/* Quick link to references */}
              {refCount > 0 && (
                <Pressable
                  style={({ pressed }) => [
                    styles.refsLink,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                  onPress={() => router.push(`/refs/${trade.id}`)}
                >
                  <Feather name="book-open" size={13} color={trade.color} />
                  <Text style={[styles.refsLinkText, { color: trade.color }]}>
                    View {refCount} Field Reference{refCount !== 1 ? "s" : ""}
                  </Text>
                  <Feather
                    name="chevron-right"
                    size={13}
                    color={trade.color}
                  />
                </Pressable>
              )}
            </View>

            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              CALCULATORS
            </Text>
          </>
        }
        renderItem={({ item: calc }) => (
          <Pressable
            style={({ pressed }) => [
              styles.calcRow,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.7 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
            onPress={() => router.push(`/calc/${trade.id}--${calc.id}`)}
          >
            <View style={styles.calcRowLeft}>
              <Text style={[styles.calcName, { color: colors.foreground }]}>
                {calc.name}
              </Text>
              <Text
                style={[styles.calcDesc, { color: colors.mutedForeground }]}
              >
                {calc.description}
              </Text>
            </View>
            <Feather
              name="chevron-right"
              size={18}
              color={colors.mutedForeground}
            />
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { padding: 16, gap: 0 },
  tradeHeader: {
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
  },
  tradeIconBg: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  tradeTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  tradeSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 14,
  },
  refsLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  refsLinkText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 2,
  },
  calcRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
  },
  calcRowLeft: { flex: 1, marginRight: 8 },
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
