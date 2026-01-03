import * as React from 'react';
import { cn } from '@/lib/utils';
import type { MoodType } from '@/types';
import { formatDateKey } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { MoodPicker } from './MoodPicker';
import { MoodIcon } from './MoodIcon';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    ArrowLeft01Icon,
    ArrowRight01Icon,
} from '@hugeicons/core-free-icons';

interface MoodCalendarProps {
    getMood: (date: Date) => MoodType | null;
    getComment: (date: Date) => string;
    setMood: (date: Date, mood: MoodType | null, comment?: string) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

export function MoodCalendar({ getMood, getComment, setMood }: MoodCalendarProps) {
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [selectedDay, setSelectedDay] = React.useState<Date | null>(null);
    const [pendingMood, setPendingMood] = React.useState<MoodType | null>(null);
    const [pendingComment, setPendingComment] = React.useState('');

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get days in month and first day of month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();

    // Generate calendar days
    const calendarDays: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(new Date(year, month, day));
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
        setSelectedDay(null);
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
        setSelectedDay(null);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
        setSelectedDay(null);
    };

    const handleDayClick = (date: Date) => {
        if (date > today) return; // Don't allow future dates
        if (selectedDay && formatDateKey(selectedDay) === formatDateKey(date)) {
            setSelectedDay(null);
            setPendingMood(null);
            setPendingComment('');
        } else {
            setSelectedDay(date);
            setPendingMood(getMood(date));
            setPendingComment(getComment(date));
        }
    };

    const handleMoodSelect = (mood: MoodType | null) => {
        if (mood === null && selectedDay) {
            setMood(selectedDay, null);
            setSelectedDay(null);
            setPendingMood(null);
            setPendingComment('');
        } else {
            setPendingMood(mood);
        }
    };

    const handleSave = () => {
        if (selectedDay && pendingMood) {
            setMood(selectedDay, pendingMood, pendingComment);
            setSelectedDay(null);
            setPendingMood(null);
            setPendingComment('');
        }
    };

    const isToday = (date: Date) => {
        return formatDateKey(date) === formatDateKey(today);
    };

    const isFuture = (date: Date) => {
        return date > today;
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                        <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
                    </Button>
                    <h2 className="text-lg font-semibold min-w-[180px] text-center">
                        {MONTHS[month]} {year}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                        <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
                    </Button>
                </div>
                <Button variant="outline" size="sm" onClick={goToToday}>
                    Today
                </Button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1">
                {WEEKDAYS.map((day) => (
                    <div
                        key={day}
                        className="text-center text-xs font-medium text-muted-foreground py-2"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                    if (!date) {
                        return <div key={`empty-${index}`} className="aspect-square" />;
                    }

                    const mood = getMood(date);
                    const isSelected = selectedDay && formatDateKey(selectedDay) === formatDateKey(date);
                    const dayIsToday = isToday(date);
                    const dayIsFuture = isFuture(date);

                    return (
                        <button
                            key={formatDateKey(date)}
                            onClick={() => handleDayClick(date)}
                            disabled={dayIsFuture}
                            className={cn(
                                'aspect-square rounded-lg flex flex-col items-center justify-center relative',
                                'transition-all duration-200',
                                'hover:ring-2 hover:ring-primary/50',
                                'focus:outline-none focus:ring-2 focus:ring-primary',
                                dayIsFuture && 'opacity-30 cursor-not-allowed hover:ring-0',
                                isSelected && 'ring-2 ring-primary',
                                !mood && !dayIsFuture && 'bg-muted/50 hover:bg-muted'
                            )}
                            style={mood ? { backgroundColor: `color-mix(in oklch, var(--mood-${mood}) 50%, transparent)` } : undefined}
                        >
                            {mood && (
                                <MoodIcon
                                    mood={mood}
                                    size={12}
                                    className="absolute top-1 right-1 text-foreground/70"
                                />
                            )}
                            <span
                                className={cn(
                                    'text-sm font-medium',
                                    dayIsToday && 'underline underline-offset-2',
                                    mood ? 'text-foreground/90' : 'text-foreground'
                                )}
                            >
                                {date.getDate()}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Mood picker dialog */}
            <Dialog open={!!selectedDay} onOpenChange={(open) => {
                if (!open) {
                    setSelectedDay(null);
                    setPendingMood(null);
                    setPendingComment('');
                }
            }}>
                <DialogContent>
                    {selectedDay && (
                        <MoodPicker
                            selectedMood={pendingMood}
                            comment={pendingComment}
                            onSelect={handleMoodSelect}
                            onCommentChange={setPendingComment}
                            onSave={handleSave}
                            date={selectedDay}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
