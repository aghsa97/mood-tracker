import { useMoodData } from '@/hooks/useMoodData';
import { MoodCalendar } from './MoodCalendar';
import { MoodStats } from './MoodStats';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export function MoodTracker() {
    const { getMood, setMood, getStats } = useMoodData();

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Mood Tracker</h1>
                    <p className="text-muted-foreground mt-1">
                        Track your daily mood and discover patterns in your emotional well-being
                    </p>
                </div>

                {/* Main content - responsive grid */}
                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                    {/* Calendar section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Calendar</CardTitle>
                            <CardDescription>
                                Click on a day to log how you felt
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MoodCalendar getMood={getMood} setMood={setMood} />
                        </CardContent>
                    </Card>

                    {/* Stats section */}
                    <MoodStats getStats={getStats} />
                </div>
            </div>
        </div>
    );
}
