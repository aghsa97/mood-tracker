import { cn } from '@/lib/utils';
import { MOOD_CONFIGS } from '@/types';
import type { MoodType } from '@/types';
import { Button } from '@/components/ui/button';
import { MoodIcon } from './MoodIcon';

interface MoodPickerProps {
    selectedMood: MoodType | null;
    onSelect: (mood: MoodType | null) => void;
    date: Date;
}

export function MoodPicker({ selectedMood, onSelect, date }: MoodPickerProps) {
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="flex flex-col gap-4 p-1">
            <div className="text-center">
                <p className="text-sm font-medium text-foreground">{formattedDate}</p>
                <p className="text-xs text-muted-foreground">How did you feel?</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {MOOD_CONFIGS.map((config) => (
                    <button
                        key={config.type}
                        onClick={() => onSelect(config.type)}
                        className={cn(
                            'flex items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-all',
                            'hover:scale-[1.02] active:scale-[0.98]',
                            'ring-1 ring-border',
                            selectedMood === config.type && 'ring-2 ring-primary'
                        )}
                        style={{
                            backgroundColor: `var(--mood-${config.type})`,
                        }}
                    >
                        <MoodIcon mood={config.type} className="text-foreground/80" />
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-foreground/90">
                                {config.label}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            {selectedMood && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelect(null)}
                    className="text-muted-foreground"
                >
                    Clear mood
                </Button>
            )}
        </div>
    );
}
