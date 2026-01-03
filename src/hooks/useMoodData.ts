import { useState, useEffect, useCallback } from "react";
import type { MoodType, MoodEntry } from "@/types";
import { formatDateKey } from "@/types";

const STORAGE_KEY = "mood-tracker-data";

interface DayEntry {
  mood: MoodType;
  comment?: string;
}

interface MoodData {
  entries: Record<string, DayEntry>;
}

const loadData = (): MoodData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migration: convert old format (string) to new format (object)
      if (parsed.entries) {
        const migrated: Record<string, DayEntry> = {};
        for (const [key, value] of Object.entries(parsed.entries)) {
          if (typeof value === "string") {
            // Old format: just mood string
            migrated[key] = { mood: value as MoodType };
          } else {
            // New format: object with mood and comment
            migrated[key] = value as DayEntry;
          }
        }
        return { entries: migrated };
      }
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
      return data.entries[key]?.mood || null;
    },
    [data.entries]
  );

  const getComment = useCallback(
    (date: Date): string => {
      const key = formatDateKey(date);
      return data.entries[key]?.comment || "";
    },
    [data.entries]
  );

  const setMood = useCallback(
    (date: Date, mood: MoodType | null, comment?: string) => {
      const key = formatDateKey(date);
      setData((prev) => {
        const newEntries = { ...prev.entries };
        if (mood === null) {
          delete newEntries[key];
        } else {
          newEntries[key] = {
            mood,
            comment: comment ?? prev.entries[key]?.comment ?? "",
          };
        }
        return { entries: newEntries };
      });
    },
    []
  );

  const setComment = useCallback((date: Date, comment: string) => {
    const key = formatDateKey(date);
    setData((prev) => {
      const existing = prev.entries[key];
      if (!existing) return prev; // No mood set, can't add comment
      return {
        entries: {
          ...prev.entries,
          [key]: { ...existing, comment },
        },
      };
    });
  }, []);

  const getAllMoods = useCallback(
    (year: number): MoodEntry[] => {
      return Object.entries(data.entries)
        .filter(([dateStr]) => dateStr.startsWith(String(year)))
        .map(([date, entry]) => ({ date, mood: entry.mood }));
    },
    [data.entries]
  );

  const getMoodsForMonth = useCallback(
    (year: number, month: number): Record<string, MoodType> => {
      const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
      const result: Record<string, MoodType> = {};
      Object.entries(data.entries).forEach(([dateStr, entry]) => {
        if (dateStr.startsWith(prefix)) {
          result[dateStr] = entry.mood;
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
    getComment,
    setMood,
    setComment,
    getAllMoods,
    getMoodsForMonth,
    getStats,
    entries: data.entries,
  };
}
