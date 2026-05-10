import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

import { trades as defaultTrades } from "@/data/calculators";

const STORAGE_KEY = "@tradesman_trade_order_v1";

export function useTradeOrder() {
  const [orderedIds, setOrderedIds] = useState<string[]>(
    defaultTrades.map((t) => t.id)
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((val) => {
        if (val) {
          try {
            const ids = JSON.parse(val) as string[];
            const allIds = defaultTrades.map((t) => t.id);
            // Preserve stored order, append any new trades not yet saved
            const merged = [
              ...ids.filter((id) => allIds.includes(id)),
              ...allIds.filter((id) => !ids.includes(id)),
            ];
            setOrderedIds(merged);
          } catch {
            // corrupted storage — fall back to default
          }
        }
      })
      .finally(() => setLoaded(true));
  }, []);

  const saveOrder = useCallback((ids: string[]) => {
    setOrderedIds(ids);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, []);

  const resetOrder = useCallback(() => {
    const ids = defaultTrades.map((t) => t.id);
    setOrderedIds(ids);
    AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const orderedTrades = orderedIds
    .map((id) => defaultTrades.find((t) => t.id === id))
    .filter((t): t is (typeof defaultTrades)[number] => Boolean(t));

  return { orderedTrades, saveOrder, resetOrder, loaded };
}
