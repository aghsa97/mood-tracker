import { HugeiconsIcon } from '@hugeicons/react';
import {
    StarIcon,
    CheckmarkCircle01Icon,
    MinusSignCircleIcon,
    Moon02Icon,
    Alert02Icon,
    SadIcon,
} from '@hugeicons/core-free-icons';
import type { MoodType } from '@/types';

// Map mood types to their corresponding icons
const MOOD_ICONS = {
    exceptional: StarIcon,
    stable: CheckmarkCircle01Icon,
    meh: MinusSignCircleIcon,
    tired: Moon02Icon,
    stressed: Alert02Icon,
    low: SadIcon,
} as const;

interface MoodIconProps {
    mood: MoodType;
    className?: string;
    size?: number;
}

export function MoodIcon({ mood, className, size = 18 }: MoodIconProps) {
    const Icon = MOOD_ICONS[mood];

    return (
        <HugeiconsIcon
            icon={Icon}
            strokeWidth={2}
            className={className}
            size={size}
        />
    );
}
