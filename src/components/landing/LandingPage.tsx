import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    MoonCloudIcon,
    SparklesIcon,
    ChartLineData01Icon,
    Calendar03Icon,
    ShieldKeyIcon,
    ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import { MOOD_CONFIGS } from '@/types';

interface LandingPageProps {
    onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
    const [hoveredMood, setHoveredMood] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-background overflow-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
                <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={MoonCloudIcon} size={24} strokeWidth={2} />
                        <span className="font-semibold">Mood Tracker</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Button variant="ghost" size="sm" onClick={onGetStarted}>
                            Sign In
                        </Button>
                        <Button size="sm" onClick={onGetStarted}>
                            Get Started
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 relative">
                {/* Animated background gradient */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-40 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="container max-w-6xl mx-auto relative">
                    <div className="text-center max-w-3xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
                            <HugeiconsIcon icon={SparklesIcon} size={16} />
                            <span>Track. Reflect. Grow.</span>
                        </div>

                        {/* Main headline */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up">
                            Understand Your
                            <span className="block mt-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                Emotional Journey
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up delay-100">
                            A beautiful, private space to log your daily moods, discover patterns,
                            and nurture your mental well-being.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
                            <Button size="lg" className="text-lg px-8 h-14 group" onClick={onGetStarted}>
                                Start Tracking Free
                                <HugeiconsIcon
                                    icon={ArrowRight01Icon}
                                    size={20}
                                    className="ml-2 group-hover:translate-x-1 transition-transform"
                                />
                            </Button>
                            <p className="text-sm text-muted-foreground">
                                No credit card required
                            </p>
                        </div>
                    </div>

                    {/* Mood Preview Animation */}
                    <div className="mt-16 flex justify-center gap-3 sm:gap-4 animate-fade-in-up delay-300">
                        {MOOD_CONFIGS.map((config, index) => (
                            <div
                                key={config.type}
                                className={cn(
                                    "relative w-12 h-12 sm:w-16 sm:h-16 rounded-2xl cursor-pointer",
                                    "transition-all duration-300 ease-out",
                                    "hover:scale-110 hover:-translate-y-2",
                                    hoveredMood === index && "scale-110 -translate-y-2"
                                )}
                                style={{
                                    backgroundColor: `var(--mood-${config.type})`,
                                    animationDelay: `${index * 100}ms`
                                }}
                                onMouseEnter={() => setHoveredMood(index)}
                                onMouseLeave={() => setHoveredMood(null)}
                            >
                                {hoveredMood === index && (
                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium bg-popover px-2 py-1 rounded shadow-lg">
                                        {config.label}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-muted/30">
                <div className="container max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Simple yet powerful
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Everything you need to understand your emotional patterns, nothing you don't.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Calendar03Icon,
                                title: "Daily Check-ins",
                                description: "Log your mood with a single tap. Add notes when you want to remember why.",
                                color: "bg-blue-500/10 text-blue-500"
                            },
                            {
                                icon: ChartLineData01Icon,
                                title: "Visual Insights",
                                description: "Beautiful charts reveal trends you might miss. See your week, month, or year at a glance.",
                                color: "bg-green-500/10 text-green-500"
                            },
                            {
                                icon: ShieldKeyIcon,
                                title: "Private & Secure",
                                description: "Your data is encrypted and yours alone. We never sell or share your information.",
                                color: "bg-purple-500/10 text-purple-500"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="group p-8 rounded-2xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                            >
                                <div className={cn(
                                    "w-14 h-14 rounded-xl flex items-center justify-center mb-6",
                                    feature.color
                                )}>
                                    <HugeiconsIcon icon={feature.icon} size={28} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Proof / Stats */}
            <section className="py-20 px-4">
                <div className="container max-w-4xl mx-auto">
                    <div className="grid grid-cols-3 gap-8 text-center">
                        {[
                            { value: "10K+", label: "Moods Logged" },
                            { value: "500+", label: "Happy Users" },
                            { value: "100%", label: "Free Forever" },
                        ].map((stat, index) => (
                            <div key={index}>
                                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-muted-foreground mt-2">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="container max-w-4xl mx-auto">
                    <div className="relative rounded-3xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 p-12 sm:p-16 text-center overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-4 right-8 w-20 h-20 rounded-full bg-primary/20 blur-2xl" />
                        <div className="absolute bottom-4 left-8 w-16 h-16 rounded-full bg-purple-500/20 blur-2xl" />

                        <h2 className="text-3xl sm:text-4xl font-bold mb-4 relative">
                            Start your journey today
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto relative">
                            Join others who are taking control of their emotional well-being.
                            It only takes a minute to begin.
                        </p>
                        <Button size="lg" className="text-lg px-8 h-14 relative" onClick={onGetStarted}>
                            Create Free Account
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-border/50">
                <div className="container max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <HugeiconsIcon icon={MoonCloudIcon} size={20} strokeWidth={2} />
                        <span className="text-sm">© 2026 Mood Tracker. All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                        <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                        <a href="#" className="hover:text-foreground transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
