import { useState } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/auth/AuthForm";
import { MoodTracker } from "@/components/mood-tracker/MoodTracker";
import { LandingPage } from "@/components/landing/LandingPage";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

function AppContent() {
    const { user, loading } = useAuth();
    const [showAuth, setShowAuth] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    if (user) {
        return <MoodTracker />;
    }

    if (showAuth) {
        return <AuthForm onBack={() => setShowAuth(false)} />;
    }

    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
}

export function App() {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
                <AppContent />
                <Toaster position="bottom-center" richColors />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;