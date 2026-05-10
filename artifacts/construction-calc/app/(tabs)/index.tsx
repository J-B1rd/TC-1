import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { Trade } from "@/data/calculators";
import { tradeReferences } from "@/data/references";
import { useColors } from "@/hooks/useColors";
import { useTradeOrder } from "@/hooks/useTradeOrder";

// ─── Animated Trade Card ──────────────────────────────────────────────────────

function TradeCard({
  trade,
  drag,
  isActive,
  editMode,
  onLongPress,
}: {
  trade: Trade;
  drag?: () => void;
  isActive?: boolean;
  editMode: boolean;
  onLongPress?: () => void;
}) {
  const colors = useColors();
  const refCount = tradeReferences[trade.id]?.length ?? 0;
  const rot = useSharedValue(0);

  useEffect(() => {
    if (editMode && !isActive) {
      // subtle wiggle — small angle, slow speed, randomised start delay
      const delay = Math.random() * 120;
      const timer = setTimeout(() => {
        rot.value = withRepeat(
          withSequence(
            withTiming(-0.45, { duration: 130 }),
            withTiming(0.45, { duration: 130 })
          ),
          -1,
          false
        );
      }, delay);
      return () => clearTimeout(timer);
    } else {
      cancelAnimation(rot);
      rot.value = withTiming(0, { duration: 200 });
    }
  }, [editMode, isActive]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rot.value}deg` }],
  }));

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={editMode ? undefined : () => {}} // swallow tap in edit mode
        onLongPress={onLongPress}
        delayLongPress={400}
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: isActive ? trade.color : colors.border,
            shadowColor: isActive ? trade.color : "#000",
            shadowOpacity: isActive ? 0.2 : 0.05,
            shadowRadius: isActive ? 12 : 3,
            shadowOffset: { width: 0, height: isActive ? 6 : 1 },
            elevation: isActive ? 10 : 1,
          },
        ]}
      >
        {/* Top row: icon + info + drag handle (edit mode) */}
        <View style={styles.cardTop}>
          <View style={[styles.tradeIcon, { backgroundColor: trade.color + "1A" }]}>
            <Feather
              name={trade.icon as keyof typeof Feather.glyphMap}
              size={22}
              color={trade.color}
            />
          </View>
          <View style={styles.tradeInfo}>
            <Text style={[styles.tradeName, { color: colors.foreground }]}>
              {trade.name}
            </Text>
            <Text style={[styles.tradeMeta, { color: colors.mutedForeground }]}>
              {trade.calculators.length} calcs
              {refCount > 0 ? `  ·  ${refCount} refs` : ""}
            </Text>
          </View>
          {editMode && drag ? (
            <Pressable onPressIn={drag} hitSlop={12} style={styles.dragHandle}>
              <Feather name="menu" size={20} color={colors.mutedForeground} />
            </Pressable>
          ) : null}
        </View>

        {/* Bottom section — always same height for consistent card size */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {editMode ? (
          // Placeholder row — same height as action buttons, keeps card size stable
          <View style={styles.editHint}>
            <Feather name="move" size={13} color={colors.mutedForeground} />
            <Text style={[styles.editHintText, { color: colors.mutedForeground }]}>
              Grab ≡ to drag  ·  long-press any card to reorder
            </Text>
          </View>
        ) : (
          <View style={styles.cardActions}>
            <Pressable
              style={({ pressed }) => [
                styles.actionBtn,
                {
                  backgroundColor: trade.color + "15",
                  borderColor: trade.color + "35",
                  opacity: pressed ? 0.65 : 1,
                },
              ]}
              onPress={() => router.push(`/trade/${trade.id}`)}
            >
              <Feather name="cpu" size={13} color={trade.color} />
              <Text style={[styles.actionLabel, { color: trade.color }]}>
                Calculators
              </Text>
              <View style={[styles.badge, { backgroundColor: trade.color + "25" }]}>
                <Text style={[styles.badgeText, { color: trade.color }]}>
                  {trade.calculators.length}
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.actionBtn,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  opacity: pressed ? 0.65 : 1,
                },
              ]}
              onPress={() => router.push(`/refs/${trade.id}`)}
            >
              <Feather name="book-open" size={13} color={colors.mutedForeground} />
              <Text style={[styles.actionLabel, { color: colors.mutedForeground }]}>
                References
              </Text>
              {refCount > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.muted }]}>
                  <Text style={[styles.badgeText, { color: colors.mutedForeground }]}>
                    {refCount}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        )}

        <View style={[styles.accentBar, { backgroundColor: trade.color }]} />
      </Pressable>
    </Animated.View>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({
  editMode,
  onDone,
  onReset,
}: {
  editMode: boolean;
  onDone: () => void;
  onReset: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <>
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
            {editMode ? "Drag to reorder  ·  Done when finished" : "Field Calculators"}
          </Text>
        </View>

        <View style={styles.headerActions}>
          {editMode ? (
            <>
              <Pressable
                onPress={onReset}
                style={({ pressed }) => [
                  styles.headerBtn,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text style={[styles.headerBtnText, { color: colors.mutedForeground }]}>
                  Reset
                </Text>
              </Pressable>
              <Pressable
                onPress={onDone}
                style={({ pressed }) => [
                  styles.headerBtn,
                  {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text style={[styles.headerBtnText, { color: "#fff" }]}>Done</Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              onPress={() => router.push("/settings")}
              style={({ pressed }) => [
                styles.iconBtn,
                {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              hitSlop={8}
              accessibilityLabel="Settings"
            >
              <Feather name="settings" size={18} color="#fff" />
            </Pressable>
          )}
        </View>
      </View>

      {editMode && (
        <View
          style={[
            styles.editBanner,
            {
              backgroundColor: colors.primary + "12",
              borderBottomColor: colors.primary + "25",
            },
          ]}
        >
          <Feather name="info" size={12} color={colors.primary} />
          <Text style={[styles.editBannerText, { color: colors.primary }]}>
            Long-press any card to start reordering, or grab the ≡ handle
          </Text>
        </View>
      )}
    </>
  );
}

// ─── Native draggable list ────────────────────────────────────────────────────

function NativeList({
  trades,
  editMode,
  onReorder,
  bottomPad,
  onEnterEdit,
}: {
  trades: Trade[];
  editMode: boolean;
  onReorder: (ids: string[]) => void;
  bottomPad: number;
  onEnterEdit: () => void;
}) {
  const [DraggableFlatList, setDFL] = useState<any>(null);
  const [ScaleDecorator, setSD] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      import("react-native-draggable-flatlist").then((m) => m.default),
      import("react-native-draggable-flatlist").then((m) => m.ScaleDecorator),
    ]).then(([dfl, sd]) => {
      setDFL(() => dfl);
      setSD(() => sd);
    });
  }, []);

  // Fall back to regular FlatList while loading or if import fails
  if (!DraggableFlatList || !ScaleDecorator) {
    return (
      <FlatList
        data={trades}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ padding: 14, paddingTop: 12, paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <TradeCard trade={item} editMode={editMode} onLongPress={onEnterEdit} />
        )}
      />
    );
  }

  return (
    <DraggableFlatList
      data={trades}
      onDragEnd={({ data }: { data: Trade[] }) =>
        onReorder(data.map((t: Trade) => t.id))
      }
      keyExtractor={(item: Trade) => item.id}
      contentContainerStyle={{ padding: 14, paddingTop: 12, paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
      activationDistance={editMode ? 4 : 9999}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      renderItem={({
        item,
        drag,
        isActive,
      }: {
        item: Trade;
        drag: () => void;
        isActive: boolean;
      }) => (
        <ScaleDecorator activeScale={1.03}>
          <TradeCard
            trade={item}
            drag={drag}
            isActive={isActive}
            editMode={editMode}
            onLongPress={() => {
              onEnterEdit();
              // Small delay so edit mode renders before drag starts
              setTimeout(drag, 80);
            }}
          />
        </ScaleDecorator>
      )}
    />
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { orderedTrades, saveOrder, resetOrder } = useTradeOrder();
  const [editMode, setEditMode] = useState(false);

  // Tab bar is ~49pt + device bottom inset; add extra to guarantee last card visible
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 90;

  const handleDone = useCallback(() => setEditMode(false), []);
  const handleEnterEdit = useCallback(() => setEditMode(true), []);
  const handleReset = useCallback(() => {
    resetOrder();
    setEditMode(false);
  }, [resetOrder]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Header
        editMode={editMode}
        onDone={handleDone}
        onReset={handleReset}
      />

      {Platform.OS === "web" ? (
        <FlatList
          data={orderedTrades}
          keyExtractor={(t) => t.id}
          contentContainerStyle={{ padding: 14, paddingTop: 12, paddingBottom: bottomPad }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <TradeCard
              trade={item}
              editMode={editMode}
              onLongPress={handleEnterEdit}
            />
          )}
        />
      ) : (
        <NativeList
          trades={orderedTrades}
          editMode={editMode}
          onReorder={saveOrder}
          bottomPad={bottomPad}
          onEnterEdit={handleEnterEdit}
        />
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: { flex: 1 },
  headerTitle: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  headerSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2, textTransform: "uppercase", letterSpacing: 0.8 },
  headerActions: { flexDirection: "row", gap: 8, alignItems: "center" },
  iconBtn: { width: 40, height: 40, borderRadius: 11, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  headerBtn: { borderRadius: 11, borderWidth: 1, paddingHorizontal: 16, height: 40, alignItems: "center", justifyContent: "center" },
  headerBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },

  editBanner: {
    flexDirection: "row", alignItems: "center", gap: 7,
    paddingHorizontal: 18, paddingVertical: 9, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  editBannerText: { fontSize: 12, fontFamily: "Inter_500Medium", flex: 1 },

  card: { borderRadius: 18, borderWidth: 1, overflow: "hidden" },
  cardTop: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  tradeIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  tradeInfo: { flex: 1 },
  tradeName: { fontSize: 16, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  tradeMeta: { fontSize: 12, fontFamily: "Inter_400Regular" },
  dragHandle: { padding: 6 },

  divider: { height: StyleSheet.hairlineWidth, marginHorizontal: 14 },

  // Edit-mode placeholder — same height as cardActions so card doesn't shrink
  editHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    padding: 10,
    minHeight: 47, // matches cardActions row height
  },
  editHintText: { fontSize: 12, fontFamily: "Inter_400Regular" },

  cardActions: { flexDirection: "row", gap: 8, padding: 10 },
  actionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, borderRadius: 10, borderWidth: 1, paddingVertical: 9, paddingHorizontal: 8,
  },
  actionLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  badge: { borderRadius: 6, paddingHorizontal: 5, paddingVertical: 1, minWidth: 20, alignItems: "center" },
  badgeText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  accentBar: { height: 3 },
});
