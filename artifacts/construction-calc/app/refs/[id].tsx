import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
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
import { type ReferenceItem, tradeReferences } from "@/data/references";
import { useColors } from "@/hooks/useColors";

function ReferenceCard({
  item,
  tradeColor,
  defaultOpen,
}: {
  item: ReferenceItem;
  tradeColor: string;
  defaultOpen?: boolean;
}) {
  const colors = useColors();
  const [open, setOpen] = useState(defaultOpen ?? false);

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
        <View style={[styles.refIconBg, { backgroundColor: tradeColor + "22" }]}>
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
            <View style={[styles.table, { borderColor: colors.border }]}>
              <View
                style={[
                  styles.tableHeaderRow,
                  { backgroundColor: tradeColor + "18", borderColor: colors.border },
                ]}
              >
                <Text style={[styles.tableHeaderCell, styles.cell1, { color: tradeColor }]}>
                  {item.table.headers[0]}
                </Text>
                <Text style={[styles.tableHeaderCell, styles.cell2, { color: tradeColor }]}>
                  {item.table.headers[1]}
                </Text>
              </View>
              {item.table.rows.map(([col1, col2], idx) => (
                <View
                  key={idx}
                  style={[
                    styles.tableRow,
                    {
                      backgroundColor: idx % 2 === 0 ? colors.card : colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.tableCell, styles.cell1, { color: colors.foreground }]}>
                    {col1}
                  </Text>
                  <Text style={[styles.tableCell, styles.cell2, { color: colors.mutedForeground }]}>
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
                  <View style={[styles.bulletDot, { backgroundColor: tradeColor }]} />
                  <Text style={[styles.bulletText, { color: colors.mutedForeground }]}>
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

export default function RefsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const trade = getTradeById(id ?? "");
  const refs = tradeReferences[id ?? ""] ?? [];
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 20;

  if (!trade) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.mutedForeground }}>No references found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={refs}
        keyExtractor={(_, i) => String(i)}
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
            <View style={[styles.tradeIconBg, { backgroundColor: trade.color + "2A" }]}>
              <Feather
                name={trade.icon as keyof typeof Feather.glyphMap}
                size={28}
                color={trade.color}
              />
            </View>
            <Text style={[styles.tradeTitle, { color: colors.foreground }]}>
              {trade.name}
            </Text>
            <Text style={[styles.tradeSub, { color: colors.mutedForeground }]}>
              {refs.length} reference{refs.length !== 1 ? "s" : ""}
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <ReferenceCard
            item={item}
            tradeColor={trade.color}
            defaultOpen={index === 0}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="book-open" size={32} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No references for this trade yet
            </Text>
          </View>
        }
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
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  tradeTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  tradeSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  refCard: {
    borderRadius: 14,
    borderWidth: 1,
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
  table: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cell1: { flex: 1, paddingVertical: 7, paddingHorizontal: 10 },
  cell2: { flex: 1, paddingVertical: 7, paddingHorizontal: 10 },
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
  bulletList: { gap: 8 },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 5, flexShrink: 0 },
  bulletText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  empty: { alignItems: "center", gap: 12, paddingTop: 60 },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
