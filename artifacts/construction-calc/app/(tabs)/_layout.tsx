import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { useColors } from "@/hooks/useColors";

export default function TabLayout() {
  const colors = useColors();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: Platform.OS === "ios" ? 58 : 52,
          paddingBottom: Platform.OS === "ios" ? 10 : 6,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 10,
          letterSpacing: 0.2,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trades",
          tabBarIcon: ({ color }) => (
            <Feather name="grid" size={19} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: "Calculator",
          tabBarIcon: ({ color }) => (
            <Feather name="cpu" size={19} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
