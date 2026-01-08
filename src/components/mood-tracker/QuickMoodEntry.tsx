import * as React from 'react';
import { cn } from '@/lib/utils';
import { MoodIcon } from './MoodIcon';
import type { MoodType } from '@/types';
import { MOOD_CONFIGS, getMoodConfig } from '@/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Cancel01Icon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { toast } from 'sonner';

interface QuickMoodEntryProps {
    todayMood: MoodType | null;
    onMoodSelect: (mood: MoodType) => void;
}

export function QuickMoodEntry({ todayMood, onMoodSelect }: QuickMoodEntryProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [justSaved, setJustSaved] = React.useState(false);

    const handleMoodSelect = (mood: MoodType) => {
        onMoodSelect(mood);
        setJustSaved(true);
        setIsOpen(false);

        const moodConfig = getMoodConfig(mood);
        toast.success(`Logged as ${moodConfig.label}`, {
            description: "Today's mood saved",
        });

        // Reset the "just saved" state after animation
        setTimeout(() => setJustSaved(false), 2000);
    };

    const today = new Date();
    const todayFormatted = today.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 animate-fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Quick Entry Panel */}
            <div className={cn(
                "fixed bottom-24 right-4 z-50 transition-all duration-300 ease-out",
                isOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 translate-y-4 pointer-events-none"
            )}>
                <div className="bg-card rounded-2xl shadow-2xl border border-border p-4 w-72">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm font-medium">How are you feeling?</p>
                            <p className="text-xs text-muted-foreground">{todayFormatted}</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 rounded-full hover:bg-muted transition-colors"
                        >
                            <HugeiconsIcon icon={Cancel01Icon} size={18} className="text-muted-foreground" />
                        </button>
                    </div>

                    {/* Mood Grid */}
                    <div className="grid grid-cols-3 gap-2">
                        {MOOD_CONFIGS.map((config) => {
                            const isSelected = todayMood === config.type;
                            return (
                                <button
                                    key={config.type}
                                    onClick={() => handleMoodSelect(config.type)}
                                    className={cn(
                                        "flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200",
                                        "hover:scale-105 active:scale-95",
                                        "ring-1 ring-border",
                                        isSelected && "ring-2 ring-primary"
                                    )}
                                    style={{
                                        backgroundColor: `var(--mood-${config.type})`,
                                    }}
                                >
                                    <MoodIcon mood={config.type} size={20} className="text-foreground/80" />
                                    <span className="text-[10px] font-medium text-foreground/90 leading-tight">
                                        {config.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Current mood indicator */}
                    {todayMood && (
                        <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: `var(--mood-${todayMood})` }}
                            />
                            <span>Currently: <strong className="text-foreground">{getMoodConfig(todayMood).label}</strong></span>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 right-4 z-50",
                    "w-14 h-14 rounded-full shadow-lg",
                    "flex items-center justify-center",
                    "transition-all duration-300 ease-out",
                    "hover:scale-110 hover:shadow-xl active:scale-95",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    isOpen && "rotate-45",
                    justSaved && "animate-bounce"
                )}
                style={{
                    backgroundColor: todayMood
                        ? `var(--mood-${todayMood})`
                        : 'var(--primary)',
                }}
                title={todayMood ? `Today: ${getMoodConfig(todayMood).label}` : "Log today's mood"}
            >
                {todayMood && !isOpen ? (
                    <MoodIcon mood={todayMood} size={24} className="text-foreground" />
                ) : justSaved ? (
                    <HugeiconsIcon
                        icon={CheckmarkCircle02Icon}
                        size={24}
                        className="text-primary-foreground"
                    />
                ) : (
                    <HugeiconsIcon
                        icon={isOpen ? Cancel01Icon : Add01Icon}
                        size={24}
                        className={cn(
                            "transition-transform duration-300",
                            todayMood ? "text-foreground" : "text-primary-foreground"
                        )}
                    />
                )}
            </button>

            {/* Tooltip when no mood logged */}
            {!todayMood && !isOpen && (
                <div className={cn(
                    "fixed bottom-[88px] right-4 z-50",
                    "bg-popover text-popover-foreground",
                    "px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium",
                    "animate-fade-in-up",
                    "after:content-[''] after:absolute after:top-full after:right-5",
                    "after:border-4 after:border-transparent after:border-t-popover"
                )}>
                    Log today's mood
                </div>
            )}
        </>
    );
}
