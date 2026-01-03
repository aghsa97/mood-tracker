import { cn } from '@/lib/utils';
import type { MoodType } from '@/types';
import { MOOD_CONFIGS, getMoodConfig } from '@/types';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { MoodIcon } from './MoodIcon';

interface MoodStatsProps {
    getStats: (year: number) => {
        distribution: Record<MoodType, number>;
        totalEntries: number;
        mostCommon: MoodType | null;
    };
}

export function MoodStats({ getStats }: MoodStatsProps) {
    const currentYear = new Date().getFullYear();
    const stats = getStats(currentYear);

    const maxCount = Math.max(...Object.values(stats.distribution), 1);

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle>Mood Statistics</CardTitle>
                <CardDescription>{currentYear} Overview</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                {/* Total entries */}
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Days tracked</span>
                    <span className="text-2xl font-semibold">{stats.totalEntries}</span>
                </div>

                {/* Most common mood */}
                {stats.mostCommon && (
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">Most common mood</span>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: `var(--mood-${stats.mostCommon})` }}
                            />
                            <span className="text-sm font-medium">
                                {getMoodConfig(stats.mostCommon).label}
                            </span>
                            <MoodIcon mood={stats.mostCommon} size={16} className="text-muted-foreground" />
                        </div>
                    </div>
                )}

                {/* Distribution chart */}
                <div className="flex flex-col gap-3">
                    <span className="text-xs text-muted-foreground">Distribution</span>
                    <div className="flex flex-col gap-2">
                        {MOOD_CONFIGS.map((config) => {
                            const count = stats.distribution[config.type];
                            const percentage = stats.totalEntries > 0
                                ? Math.round((count / stats.totalEntries) * 100)
                                : 0;
                            const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;

                            return (
                                <div key={config.type} className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <MoodIcon mood={config.type} size={14} className="text-muted-foreground" />
                                            <span className="text-muted-foreground">{config.label}</span>
                                        </div>
                                        <span className="font-medium tabular-nums">
                                            {count} <span className="text-muted-foreground">({percentage}%)</span>
                                        </span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                'h-full rounded-full transition-all duration-500',
                                                count === 0 && 'opacity-0'
                                            )}
                                            style={{
                                                width: `${barWidth}%`,
                                                backgroundColor: `var(--mood-${config.type})`,
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-2 pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">Mood Legend</span>
                    <div className="grid grid-cols-2 gap-2">
                        {MOOD_CONFIGS.map((config) => (
                            <div key={config.type} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-sm shrink-0"
                                    style={{ backgroundColor: `var(--mood-${config.type})` }}
                                />
                                <span className="text-xs text-muted-foreground truncate">
                                    {config.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
