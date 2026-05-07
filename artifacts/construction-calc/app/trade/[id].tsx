import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getTradeById } from "@/data/calculators";
import { type ReferenceItem, tradeReferences } from "@/data/references";
import { useColors } from "@/hooks/useColors";

function ReferenceCard({
  item,
  tradeColor,
}: {
  item: ReferenceItem;
  tradeColor: string;
}) {
  const colors = useColors();
  const [open, setOpen] = useState(false);

  return (
    <View
      style={[
        styles.refCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Pressable
        style={styles.refHeader}
        onPress={() => setOpen((v) => !v)}
        hitSlop={8}
      >
        <View
          style={[styles.refIconBg, { backgroundColor: tradeColor + "22" }]}
        >
          <Feather
            name={item.icon as keyof typeof Feather.glyphMap}
            size={16}
            color={tradeColor}
          />
        </View>
        <Text
          style={[styles.refTitle, { color: colors.foreground }]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Feather
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.mutedForeground}
        />
      </Pressable>

      {open && (
        <View style={styles.refBody}>
          {item.table && (
            <View
              style={[
                styles.table,
                { borderColor: colors.border },
              ]}
            >
              {/* Header row */}
              <View
                style={[
                  styles.tableRow,
                  styles.tableHeaderRow,
                  { backgroundColor: tradeColor + "18", borderColor: colors.border },
                ]}
              >
                <Text
                  style={[
                    styles.tableHeaderCell,
                    styles.tableCell1,
                    { color: tradeColor },
                  ]}
                >
                  {item.table.headers[0]}
                </Text>
                <Text
                  style={[
                    styles.tableHeaderCell,
                    styles.tableCell2,
                    { color: tradeColor },
                  ]}
                >
                  {item.table.headers[1]}
                </Text>
              </View>
              {/* Data rows */}
              {item.table.rows.map(([col1, col2], idx) => (
                <View
                  key={idx}
                  style={[
                    styles.tableRow,
                    {
                      backgroundColor:
                        idx % 2 === 0
                          ? colors.card
                          : colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tableCell,
                      styles.tableCell1,
                      { color: colors.foreground },
                    ]}
                  >
                    {col1}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.tableCell2,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {col2}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {item.bullets && (
            <View style={styles.bulletList}>
              {item.bullets.map((b, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <View
                    style={[styles.bulletDot, { backgroundColor: tradeColor }]}
                  />
                  <Text
                    style={[styles.bulletText, { color: colors.mutedForeground }]}
                  >
                    {b}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default function TradeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const trade = getTradeById(id ?? "");
  const refs = tradeReferences[id ?? ""] ?? [];

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
              style={[styles.tradeIconBg, { backgroundColor: trade.color + "2A" }]}
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
          </View>
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
        ListFooterComponent={
          refs.length > 0 ? (
            <View style={styles.refSection}>
              <View style={styles.refSectionHeader}>
                <Feather name="book-open" size={15} color={trade.color} />
                <Text
                  style={[styles.refSectionTitle, { color: trade.color }]}
                >
                  Field References
                </Text>
              </View>
              {refs.map((item, idx) => (
                <ReferenceCard
                  key={idx}
                  item={item}
                  tradeColor={trade.color}
                />
              ))}
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    padding: 16,
    gap: 0,
  },
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
  },
  calcRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
  },
  calcRowLeft: {
    flex: 1,
    marginRight: 8,
  },
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
  // ── Reference section ──────────────────────────────────────────────────────
  refSection: {
    marginTop: 24,
  },
  refSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    paddingLeft: 2,
  },
  refSectionTitle: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  refCard: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
    overflow: "hidden",
  },
  refHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 10,
  },
  refIconBg: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  refTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  refBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  // ── Table ──────────────────────────────────────────────────────────────────
  table: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tableHeaderRow: {},
  tableCell1: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  tableCell2: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  tableHeaderCell: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableCell: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
  // ── Bullets ───────────────────────────────────────────────────────────────
  bulletList: {
    gap: 8,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 5,
    flexShrink: 0,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
});
