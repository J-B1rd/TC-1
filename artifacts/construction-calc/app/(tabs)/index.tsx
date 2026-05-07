import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
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

import { trades } from "@/data/calculators";
import { tradeReferences } from "@/data/references";
import { useColors } from "@/hooks/useColors";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 20;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 16,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Tradesman Toolkit
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            Field Calculators
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.settingsBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.75 : 1 },
          ]}
          onPress={() => router.push("/settings")}
          hitSlop={8}
          accessibilityLabel="Settings"
        >
          <Feather name="settings" size={20} color="#fff" />
        </Pressable>
      </View>

      {/* ── Trade list ─────────────────────────────────────────────────── */}
      <FlatList
        data={trades}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item: trade }) => {
          const refCount = tradeReferences[trade.id]?.length ?? 0;
          return (
            <View
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              {/* Trade identity row */}
              <View style={styles.cardTop}>
                <View
                  style={[
                    styles.cardIcon,
                    { backgroundColor: trade.color + "22" },
                  ]}
                >
                  <Feather
                    name={trade.icon as keyof typeof Feather.glyphMap}
                    size={24}
                    color={trade.color}
                  />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardName, { color: colors.foreground }]}>
                    {trade.name}
                  </Text>
                  <Text
                    style={[styles.cardMeta, { color: colors.mutedForeground }]}
                  >
                    {trade.calculators.length} calculators
                    {refCount > 0 ? `  ·  ${refCount} references` : ""}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />

              {/* Action buttons */}
              <View style={styles.cardActions}>
                <Pressable
                  style={({ pressed }) => [
                    styles.actionBtn,
                    styles.actionBtnLeft,
                    {
                      backgroundColor: trade.color + "18",
                      borderColor: trade.color + "40",
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                  onPress={() => router.push(`/trade/${trade.id}`)}
                >
                  <Feather name="cpu" size={14} color={trade.color} />
                  <Text style={[styles.actionBtnText, { color: trade.color }]}>
                    Calculators
                  </Text>
                  <View
                    style={[
                      styles.actionBadge,
                      { backgroundColor: trade.color + "30" },
                    ]}
                  >
                    <Text
                      style={[styles.actionBadgeText, { color: trade.color }]}
                    >
                      {trade.calculators.length}
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.actionBtn,
                    styles.actionBtnRight,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                  onPress={() => router.push(`/refs/${trade.id}`)}
                >
                  <Feather
                    name="book-open"
                    size={14}
                    color={colors.mutedForeground}
                  />
                  <Text
                    style={[
                      styles.actionBtnText,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    References
                  </Text>
                  {refCount > 0 && (
                    <View
                      style={[
                        styles.actionBadge,
                        { backgroundColor: colors.muted },
                      ]}
                    >
                      <Text
                        style={[
                          styles.actionBadgeText,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        {refCount}
                      </Text>
                    </View>
                  )}
                </Pressable>
              </View>

              {/* Color accent bar */}
              <View
                style={[styles.accentBar, { backgroundColor: trade.color }]}
              />
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: { flex: 1 },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    padding: 14,
    paddingTop: 14,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  cardIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: { flex: 1 },
  cardName: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
  },
  cardMeta: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 14,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
    padding: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  actionBtnLeft: {},
  actionBtnRight: {},
  actionBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  actionBadge: {
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 20,
    alignItems: "center",
  },
  actionBadgeText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
  },
  accentBar: {
    height: 3,
  },
});
