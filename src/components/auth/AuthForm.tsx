import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { MoonCloudIcon, ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import { toast } from 'sonner';

type AuthMode = 'signin' | 'signup' | 'forgot';

export function AuthForm() {
    const { signIn, signUp, resetPassword } = useAuth();
    const [mode, setMode] = useState<AuthMode>('signin');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (mode === 'signup' && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (mode === 'signup' && password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            if (mode === 'forgot') {
                const { error } = await resetPassword(email);
                if (error) {
                    toast.error('Failed to send reset link', { description: error.message });
                } else {
                    toast.success('Check your email for a password reset link');
                }
            } else {
                const { error } = mode === 'signin'
                    ? await signIn(email, password)
                    : await signUp(email, password, fullName);

                if (error) {
                    toast.error(error.message);
                } else if (mode === 'signup') {
                    toast.success('Account created! Check your email to verify.');
                }
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const inputClassName = cn(
        "w-full h-10 px-3 text-sm rounded-lg",
        "bg-background border border-border",
        "placeholder:text-muted-foreground/50",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
    );

    const getTitle = () => {
        switch (mode) {
            case 'signin': return 'Welcome back';
            case 'signup': return 'Create your account';
            case 'forgot': return 'Reset your password';
        }
    };

    const getSubtitle = () => {
        switch (mode) {
            case 'signin': return 'Sign in to continue tracking your mood';
            case 'signup': return 'Enter your email below to create your account';
            case 'forgot': return 'Enter your email and we\'ll send you a reset link';
        }
    };

    const getButtonText = () => {
        if (loading) return 'Loading...';
        switch (mode) {
            case 'signin': return 'Login';
            case 'signup': return 'Create Account';
            case 'forgot': return 'Send Reset Link';
        }
    };

    return (
        <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
                <HugeiconsIcon icon={MoonCloudIcon} size={28} strokeWidth={2} />
                <span className="text-lg font-semibold">Mood Tracker</span>
            </div>

            {/* Card */}
            <div className="w-full max-w-md bg-background rounded-xl p-8 shadow-sm ring-1 ring-border">
                {/* Back button for forgot password */}
                {mode === 'forgot' && (
                    <button
                        type="button"
                        onClick={() => setMode('signin')}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
                    >
                        <HugeiconsIcon icon={ArrowLeft02Icon} size={16} strokeWidth={2} />
                        Back to login
                    </button>
                )}

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {getTitle()}
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {getSubtitle()}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Full Name - Signup only */}
                    {mode === 'signup' && (
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="fullName" className="text-sm font-medium">
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className={inputClassName}
                                placeholder="John Doe"
                            />
                        </div>
                    )}

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={inputClassName}
                            placeholder="m@example.com"
                        />
                    </div>

                    {/* Password - Single field for signin */}
                    {mode === 'signin' && (
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setMode('forgot')}
                                    className="text-xs text-muted-foreground hover:text-foreground"
                                >
                                    Forgot your password?
                                </button>
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className={inputClassName}
                            />
                        </div>
                    )}

                    {/* Password fields side by side for signup */}
                    {mode === 'signup' && (
                        <div className="flex flex-col gap-1.5">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="password" className="text-sm font-medium">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        className={inputClassName}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        className={inputClassName}
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Must be at least 8 characters long.
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="text-sm text-green-600 bg-green-500/10 px-3 py-2 rounded-lg">
                            {success}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        size="lg"
                        className="w-full mt-2"
                    >
                        {getButtonText()}
                    </Button>

                    {mode !== 'forgot' && (
                        <p className="text-center text-sm text-muted-foreground">
                            {mode === 'signin' ? (
                                <>
                                    Don't have an account?{' '}
                                    <Button
                                        type="button"
                                        onClick={() => setMode('signup')}
                                        variant={"link"}
                                        className="px-0 text-sm"
                                    >
                                        Sign up
                                    </Button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{' '}
                                    <Button
                                        type="button"
                                        onClick={() => setMode('signin')}
                                        variant={"link"}
                                        className="px-0 text-sm"
                                    >
                                        Login
                                    </Button>
                                </>
                            )}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
