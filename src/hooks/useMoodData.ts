import { useState, useEffect, useCallback } from "react";
import type { MoodType, MoodEntry } from "@/types";
import { formatDateKey } from "@/types";

const STORAGE_KEY = "mood-tracker-data";

interface MoodData {
  entries: Record<string, MoodType>;
}

const loadData = (): MoodData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load mood data:", e);
  }
  return { entries: {} };
};

const saveData = (data: MoodData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save mood data:", e);
  }
};

export function useMoodData() {
  const [data, setData] = useState<MoodData>(() => loadData());

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveData(data);
  }, [data]);

  const getMood = useCallback(
    (date: Date): MoodType | null => {
      const key = formatDateKey(date);
      return data.entries[key] || null;
    },
    [data.entries]
  );

  const setMood = useCallback((date: Date, mood: MoodType | null) => {
    const key = formatDateKey(date);
    setData((prev) => {
      const newEntries = { ...prev.entries };
      if (mood === null) {
        delete newEntries[key];
      } else {
        newEntries[key] = mood;
      }
      return { entries: newEntries };
    });
  }, []);

  const getAllMoods = useCallback(
    (year: number): MoodEntry[] => {
      return Object.entries(data.entries)
        .filter(([dateStr]) => dateStr.startsWith(String(year)))
        .map(([date, mood]) => ({ date, mood }));
    },
    [data.entries]
  );

  const getMoodsForMonth = useCallback(
    (year: number, month: number): Record<string, MoodType> => {
      const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
      const result: Record<string, MoodType> = {};
      Object.entries(data.entries).forEach(([dateStr, mood]) => {
        if (dateStr.startsWith(prefix)) {
          result[dateStr] = mood;
        }
      });
      return result;
    },
    [data.entries]
  );

  const getStats = useCallback(
    (year: number) => {
      const moods = getAllMoods(year);
      const distribution: Record<MoodType, number> = {
        exceptional: 0,
        stable: 0,
        meh: 0,
        tired: 0,
        stressed: 0,
        low: 0,
      };

      moods.forEach(({ mood }) => {
        distribution[mood]++;
      });

      const totalEntries = moods.length;
      const mostCommon = Object.entries(distribution).sort(
        ([, a], [, b]) => b - a
      )[0];

      return {
        distribution,
        totalEntries,
        mostCommon: mostCommon?.[1] > 0 ? (mostCommon[0] as MoodType) : null,
      };
    },
    [getAllMoods]
  );

  return {
    getMood,
    setMood,
    getAllMoods,
    getMoodsForMonth,
    getStats,
    entries: data.entries,
  };
}
