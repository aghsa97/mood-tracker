import { useState, useEffect, useCallback } from "react";
import type { MoodType, MoodEntry } from "@/types";
import { formatDateKey } from "@/types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface DayEntry {
  mood: MoodType;
  comment?: string;
}

export function useMoodData() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Record<string, DayEntry>>({});
  const [loading, setLoading] = useState(true);

  // Load entries from Supabase when user changes
  useEffect(() => {
    if (!user) {
      setEntries({});
      setLoading(false);
      return;
    }

    const loadEntries = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("mood_entries")
          .select("date, mood, comment")
          .eq("user_id", user.id);

        if (error) throw error;

        const entriesMap: Record<string, DayEntry> = {};
        data?.forEach((entry) => {
          entriesMap[entry.date] = {
            mood: entry.mood as MoodType,
            comment: entry.comment || "",
          };
        });
        setEntries(entriesMap);
      } catch (error) {
        console.error("Failed to load mood entries:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, [user]);

  const getMood = useCallback(
    (date: Date): MoodType | null => {
      const key = formatDateKey(date);
      return entries[key]?.mood || null;
    },
    [entries]
  );

  const getComment = useCallback(
    (date: Date): string => {
      const key = formatDateKey(date);
      return entries[key]?.comment || "";
    },
    [entries]
  );

  const setMood = useCallback(
    async (date: Date, mood: MoodType | null, comment?: string) => {
      if (!user) return;

      const key = formatDateKey(date);

      try {
        if (mood === null) {
          // Delete entry
          const { error } = await supabase
            .from("mood_entries")
            .delete()
            .eq("user_id", user.id)
            .eq("date", key);

          if (error) throw error;

          setEntries((prev) => {
            const newEntries = { ...prev };
            delete newEntries[key];
            return newEntries;
          });
        } else {
          // Upsert entry
          const { error } = await supabase.from("mood_entries").upsert(
            {
              user_id: user.id,
              date: key,
              mood,
              comment: comment ?? entries[key]?.comment ?? "",
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: "user_id,date",
            }
          );

          if (error) throw error;

          setEntries((prev) => ({
            ...prev,
            [key]: {
              mood,
              comment: comment ?? prev[key]?.comment ?? "",
            },
          }));
        }
      } catch (error) {
        console.error("Failed to save mood:", error);
      }
    },
    [user, entries]
  );

  const getAllMoods = useCallback(
    (year: number): MoodEntry[] => {
      return Object.entries(entries)
        .filter(([dateStr]) => dateStr.startsWith(String(year)))
        .map(([date, entry]) => ({ date, mood: entry.mood }));
    },
    [entries]
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
    getAllMoods,
    getStats,
    entries,
    loading,
  };
}
