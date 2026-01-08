import { useState } from 'react';
import { useMoodData } from '@/hooks/useMoodData';
import { useAuth } from '@/contexts/AuthContext';
import { MoodCalendar } from './MoodCalendar';
import { MoodStats } from './MoodStats';
import { MoodTrends } from './MoodTrends';
import { Button } from '@/components/ui/button';
import { UserSettings } from '@/components/auth/UserSettings';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { HugeiconsIcon } from '@hugeicons/react';
import { Logout01Icon, Settings01Icon } from '@hugeicons/core-free-icons';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function MoodTracker() {
    const { getMood, getComment, setMood, getStats, entries, loading } = useMoodData();
    const { user, signOut } = useAuth();
    const [settingsOpen, setSettingsOpen] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-muted-foreground">Loading your moods...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Mood Tracker</h1>
                        <p className="text-muted-foreground mt-1">
                            Track your daily mood and discover patterns in your emotional well-being
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground hidden sm:block mr-2">
                            {user?.user_metadata?.full_name || user?.email}
                        </span>
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSettingsOpen(true)}
                            title="Settings"
                        >
                            <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} />
                        </Button>
                        <Button variant="outline" size="sm" onClick={signOut}>
                            <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} />
                            <span className="hidden sm:inline ml-1">Sign out</span>
                        </Button>
                    </div>
                </div>

                {/* Main content - responsive grid */}
                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                    {/* Left column - Calendar and Trends */}
                    <div className="flex flex-col gap-6">
                        {/* Calendar section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Calendar</CardTitle>
                                <CardDescription>
                                    Click on a day to log how you felt
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <MoodCalendar getMood={getMood} getComment={getComment} setMood={setMood} />
                            </CardContent>
                        </Card>

                        {/* Trends section */}
                        <MoodTrends entries={entries} />
                    </div>

                    {/* Right column - Stats */}
                    <MoodStats getStats={getStats} />
                </div>
            </div>

            {/* Settings Dialog */}
            <UserSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
        </div>
    );
}
