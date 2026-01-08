import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Sun02Icon, Moon02Icon } from '@hugeicons/core-free-icons';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch by only rendering after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" disabled>
                <div className="h-5 w-5" />
            </Button>
        );
    }

    const isDark = resolvedTheme === 'dark';

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="relative overflow-hidden"
        >
            <HugeiconsIcon
                icon={isDark ? Sun02Icon : Moon02Icon}
                size={20}
                strokeWidth={2}
                className="transition-transform duration-300"
            />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
