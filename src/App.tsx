import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/auth/AuthForm";
import { MoodTracker } from "@/components/mood-tracker/MoodTracker";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

function AppContent() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return <AuthForm />;
    }

    return <MoodTracker />;
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