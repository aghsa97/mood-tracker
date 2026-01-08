import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
    ChartContainer,
    ChartTooltip,
    type ChartConfig,
} from '@/components/ui/chart';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { MoodType } from '@/types';
import { MOOD_CONFIGS, getMoodConfig } from '@/types';
import { MoodIcon } from './MoodIcon';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { Fire02Icon } from '@hugeicons/core-free-icons';

interface MoodTrendsProps {
    entries: Record<string, { mood: MoodType; comment?: string }>;
}

type TimeRange = '7d' | '30d' | '90d' | 'year';

// Map mood types to numeric values for charting (higher = better mood)
const MOOD_VALUES: Record<MoodType, number> = {
    exceptional: 6,
    stable: 5,
    meh: 4,
    tired: 3,
    stressed: 2,
    low: 1,
};

// Reverse mapping for tooltip display
const VALUE_TO_MOOD: Record<number, MoodType> = {
    6: 'exceptional',
    5: 'stable',
    4: 'meh',
    3: 'tired',
    2: 'stressed',
    1: 'low',
};

const chartConfig = {
    mood: {
        label: 'Mood',
        color: 'var(--primary)',
    },
} satisfies ChartConfig;

export function MoodTrends({ entries }: MoodTrendsProps) {
    const [timeRange, setTimeRange] = React.useState<TimeRange>('30d');

    // Generate chart data based on time range
    const chartData = React.useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        let daysToShow: number;
        switch (timeRange) {
            case '7d':
                daysToShow = 7;
                break;
            case '30d':
                daysToShow = 30;
                break;
            case '90d':
                daysToShow = 90;
                break;
            case 'year':
                daysToShow = 365;
                break;
        }

        const data: Array<{
            date: string;
            dateLabel: string;
            mood: number | null;
            moodType: MoodType | null;
        }> = [];

        for (let i = daysToShow - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${day}`;

            const entry = entries[dateKey];
            const moodValue = entry ? MOOD_VALUES[entry.mood] : null;

            // Format label based on time range
            let dateLabel: string;
            if (timeRange === '7d') {
                dateLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
            } else if (timeRange === '30d') {
                dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            } else if (timeRange === '90d') {
                dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            } else {
                dateLabel = date.toLocaleDateString('en-US', { month: 'short' });
            }

            data.push({
                date: dateKey,
                dateLabel,
                mood: moodValue,
                moodType: entry?.mood || null,
            });
        }

        return data;
    }, [entries, timeRange]);

    // Filter out null values for the chart (connect the dots)
    const filledChartData = React.useMemo(() => {
        return chartData.filter((d) => d.mood !== null);
    }, [chartData]);

    // Calculate statistics
    const stats = React.useMemo(() => {
        const validEntries = chartData.filter((d) => d.mood !== null);
        if (validEntries.length === 0) {
            return {
                average: null,
                trend: null,
                daysTracked: 0,
                streak: 0,
            };
        }

        const sum = validEntries.reduce((acc, d) => acc + (d.mood || 0), 0);
        const average = sum / validEntries.length;

        // Calculate trend (compare first half to second half)
        const midpoint = Math.floor(validEntries.length / 2);
        if (validEntries.length >= 4) {
            const firstHalf = validEntries.slice(0, midpoint);
            const secondHalf = validEntries.slice(midpoint);
            const firstAvg = firstHalf.reduce((acc, d) => acc + (d.mood || 0), 0) / firstHalf.length;
            const secondAvg = secondHalf.reduce((acc, d) => acc + (d.mood || 0), 0) / secondHalf.length;
            const trend = secondAvg - firstAvg;
            return {
                average,
                trend,
                daysTracked: validEntries.length,
                streak: calculateStreak(chartData),
            };
        }

        return {
            average,
            trend: null,
            daysTracked: validEntries.length,
            streak: calculateStreak(chartData),
        };
    }, [chartData]);

    // Calculate current streak
    function calculateStreak(data: typeof chartData): number {
        let streak = 0;
        for (let i = data.length - 1; i >= 0; i--) {
            if (data[i].mood !== null) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    // Get average mood type
    const averageMoodType = stats.average
        ? VALUE_TO_MOOD[Math.round(stats.average)]
        : null;

    // Custom tooltip content
    const CustomTooltip = ({
        active,
        payload,
    }: {
        active?: boolean;
        payload?: Array<{ payload: { date: string; moodType: MoodType | null } }>;
    }) => {
        if (!active || !payload?.length) return null;

        const data = payload[0].payload;
        if (!data.moodType) return null;

        const moodConfig = getMoodConfig(data.moodType);
        const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });

        return (
            <div className="rounded-lg border border-border bg-background px-3 py-2 shadow-lg">
                <p className="text-xs text-muted-foreground mb-1">{formattedDate}</p>
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: `var(--mood-${data.moodType})` }}
                    />
                    <span className="text-sm font-medium">{moodConfig.label}</span>
                    <MoodIcon mood={data.moodType} size={14} className="text-muted-foreground" />
                </div>
            </div>
        );
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle>Mood Trends</CardTitle>
                    <CardDescription>Track your emotional patterns over time</CardDescription>
                </div>
                <div className="flex gap-1">
                    {(['7d', '30d', '90d', 'year'] as const).map((range) => (
                        <Button
                            key={range}
                            variant={timeRange === range ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setTimeRange(range)}
                            className="text-xs px-2 h-7"
                        >
                            {range === 'year' ? '1Y' : range.toUpperCase()}
                        </Button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">Days Tracked</span>
                        <span className="text-lg font-semibold">{stats.daysTracked}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">Current Streak</span>
                        <span className="text-lg font-semibold flex items-center gap-1">
                            {stats.streak}
                            {stats.streak > 0 && (
                                <HugeiconsIcon icon={Fire02Icon} size={18} className="text-orange-500" />
                            )}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">Trend</span>
                        <span className="text-lg font-semibold">
                            {stats.trend !== null ? (
                                <span
                                    className={cn(
                                        stats.trend > 0.2
                                            ? 'text-green-500'
                                            : stats.trend < -0.2
                                                ? 'text-red-500'
                                                : 'text-muted-foreground'
                                    )}
                                >
                                    {stats.trend > 0.2 ? '↑ Improving' : stats.trend < -0.2 ? '↓ Declining' : '→ Stable'}
                                </span>
                            ) : (
                                <span className="text-muted-foreground">—</span>
                            )}
                        </span>
                    </div>
                </div>

                {/* Average mood indicator */}
                {averageMoodType && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">Average mood:</span>
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: `var(--mood-${averageMoodType})` }}
                        />
                        <span className="text-sm font-medium">
                            {getMoodConfig(averageMoodType).label}
                        </span>
                        <MoodIcon mood={averageMoodType} size={16} className="text-muted-foreground" />
                    </div>
                )}

                {/* Chart */}
                {filledChartData.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-[200px] w-full">
                        <AreaChart
                            data={filledChartData}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="dateLabel"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tick={{ fontSize: 11 }}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                domain={[0.5, 6.5]}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => VALUE_TO_MOOD[value]?.slice(0, 3) || ''}
                                tick={{ fontSize: 10 }}
                                ticks={[1, 2, 3, 4, 5, 6]}
                            />
                            <ChartTooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="mood"
                                stroke="var(--primary)"
                                strokeWidth={2}
                                fill="url(#moodGradient)"
                                dot={(props) => {
                                    const { cx, cy, payload } = props;
                                    if (!payload.moodType) return <circle cx={0} cy={0} r={0} />;
                                    return (
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={4}
                                            fill={`var(--mood-${payload.moodType})`}
                                            stroke="var(--background)"
                                            strokeWidth={2}
                                        />
                                    );
                                }}
                                activeDot={(props) => {
                                    const { cx, cy, payload } = props;
                                    if (!payload.moodType) return <circle cx={0} cy={0} r={0} />;
                                    return (
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={6}
                                            fill={`var(--mood-${payload.moodType})`}
                                            stroke="var(--background)"
                                            strokeWidth={2}
                                        />
                                    );
                                }}
                            />
                        </AreaChart>
                    </ChartContainer>
                ) : (
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                        <p>No mood data for this period. Start tracking to see trends!</p>
                    </div>
                )}

                {/* Mood scale legend */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-[10px] text-muted-foreground">Low</span>
                    <div className="flex gap-1">
                        {MOOD_CONFIGS.slice().reverse().map((config) => (
                            <div
                                key={config.type}
                                className="w-5 h-2 rounded-sm"
                                style={{ backgroundColor: `var(--mood-${config.type})` }}
                                title={config.label}
                            />
                        ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">High</span>
                </div>
            </CardContent>
        </Card>
    );
}
