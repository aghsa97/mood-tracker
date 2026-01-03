// Mood types for the mood tracker application

export type MoodType =
  | "exceptional"
  | "stable"
  | "meh"
  | "tired"
  | "stressed"
  | "low";

export interface MoodEntry {
  date: string; // ISO date string (YYYY-MM-DD)
  mood: MoodType;
}

export interface MoodConfig {
  type: MoodType;
  label: string;
  description: string;
}

export const MOOD_CONFIGS: MoodConfig[] = [
  {
    type: "exceptional",
    label: "Exceptional",
    description: "High joy, big wins, excitement",
  },
  {
    type: "stable",
    label: "Stable",
    description: "Productivity, calm, satisfaction",
  },
  {
    type: "meh",
    label: "Meh",
    description: "Boredom, routine, lack of direction",
  },
  {
    type: "tired",
    label: "Tired",
    description: "Low energy, sleepiness, withdrawal",
  },
  {
    type: "stressed",
    label: "Stressed",
    description: "Pressure, deadlines, overwhelmed",
  },
  {
    type: "low",
    label: "Low",
    description: "Sadness, grief, heavy fatigue",
  },
];

// Helper to get mood config by type
export const getMoodConfig = (type: MoodType): MoodConfig => {
  return MOOD_CONFIGS.find((config) => config.type === type)!;
};

// Date helper - uses local timezone to avoid UTC date shift issues
export const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
