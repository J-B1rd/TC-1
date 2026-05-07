import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { getTradeById } from "@/data/calculators";
import { useColors } from "@/hooks/useColors";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const colors = useColors();
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontFamily: "Inter_600SemiBold",
          color: colors.foreground,
        },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="trade/[id]"
        options={({ route }) => {
          const id = (route.params as { id?: string })?.id ?? "";
          const trade = getTradeById(id);
          return {
            title: trade?.name ?? "Trade",
            headerBackTitle: "Home",
          };
        }}
      />
      <Stack.Screen
        name="refs/[id]"
        options={({ route }) => {
          const id = (route.params as { id?: string })?.id ?? "";
          const trade = getTradeById(id);
          return {
            title: trade ? `${trade.name} References` : "References",
            headerBackTitle: "Home",
          };
        }}
      />
      <Stack.Screen
        name="calc/[id]"
        options={({ route }) => {
          const raw = (route.params as { id?: string })?.id ?? "";
          const parts = raw.split("--");
          const calcPart = parts[1] ?? "";
          const title = calcPart
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
          return {
            title: title || "Calculator",
            headerBackTitle: "Back",
          };
        }}
      />
      <Stack.Screen
        name="settings"
        options={{ title: "Settings", headerBackTitle: "Home" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView>
            <KeyboardProvider>
              <RootLayoutNav />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
