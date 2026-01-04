import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface UserSettingsProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UserSettings({ open, onOpenChange }: UserSettingsProps) {
    const { user, updateProfile, updatePassword } = useAuth();
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const inputClassName = cn(
        "w-full h-10 px-3 text-sm rounded-lg",
        "bg-background border border-border",
        "placeholder:text-muted-foreground/50",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
    );

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await updateProfile(fullName);
            if (error) {
                toast.error('Failed to update profile', { description: error.message });
            } else {
                toast.success('Profile updated successfully');
                onOpenChange(false);
            }
        } catch (err) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const { error } = await updatePassword(newPassword);
            if (error) {
                toast.error('Failed to update password', { description: error.message });
            } else {
                toast.success('Password updated successfully');
                setNewPassword('');
                setConfirmPassword('');
                onOpenChange(false);
            }
        } catch (err) {
            toast.error('Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Update your profile information and password
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-6 mt-4">
                    {/* Profile Section */}
                    <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                        <h3 className="text-sm font-medium">Profile</h3>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="email" className="text-xs text-muted-foreground">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className={cn(inputClassName, "opacity-60")}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="fullName" className="text-xs text-muted-foreground">
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className={inputClassName}
                                placeholder="Your name"
                            />
                        </div>

                        <Button type="submit" disabled={loading} size="sm">
                            Update Profile
                        </Button>
                    </form>

                    <div className="border-t border-border" />

                    {/* Password Section */}
                    <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
                        <h3 className="text-sm font-medium">Change Password</h3>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="newPassword" className="text-xs text-muted-foreground">
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={inputClassName}
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="confirmNewPassword" className="text-xs text-muted-foreground">
                                Confirm New Password
                            </label>
                            <input
                                id="confirmNewPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={inputClassName}
                                placeholder="••••••••"
                            />
                            <p className="text-xs text-muted-foreground">
                                Must be at least 8 characters long.
                            </p>
                        </div>

                        <Button type="submit" disabled={loading} size="sm">
                            Update Password
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
