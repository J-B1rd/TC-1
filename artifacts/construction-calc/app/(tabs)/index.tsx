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
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { trades } from "@/data/calculators";
import { useColors } from "@/hooks/useColors";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 20;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
        <View style={[styles.iconBadge, { backgroundColor: colors.primary }]}>
          <Feather name="tool" size={20} color="#fff" />
        </View>
      </View>

      <FlatList
        data={trades}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[
          styles.grid,
          { paddingBottom: bottomPad },
        ]}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: trade }) => (
          <Pressable
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.75 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
            onPress={() => router.push(`/trade/${trade.id}`)}
          >
            <View
              style={[styles.cardIcon, { backgroundColor: trade.color + "22" }]}
            >
              <Feather
                name={trade.icon as keyof typeof Feather.glyphMap}
                size={26}
                color={trade.color}
              />
            </View>
            <Text style={[styles.cardName, { color: colors.foreground }]}>
              {trade.name}
            </Text>
            <Text
              style={[styles.cardCount, { color: colors.mutedForeground }]}
            >
              {trade.calculators.length}{" "}
              {trade.calculators.length === 1 ? "calc" : "calcs"}
            </Text>
            <View
              style={[styles.cardAccent, { backgroundColor: trade.color }]}
            />
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: {
    flex: 1,
  },
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
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    padding: 12,
    paddingTop: 16,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
  },
  cardCount: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  cardAccent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
});
