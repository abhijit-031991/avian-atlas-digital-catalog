import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Calendar, KeyRound, LogOut } from 'lucide-react';

const MyArcTrack = () => {
  const { currentUser, logout, updateUserProfile, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = displayName.trim();
    if (!trimmed) return;
    setProfileLoading(true);
    try {
      await updateUserProfile(trimmed);
      toast({ title: 'Profile updated', description: 'Your display name has been saved.' });
    } catch (err: any) {
      toast({ title: 'Update failed', description: err.message, variant: 'destructive' });
    }
    setProfileLoading(false);
  };

  const handleResetPassword = async () => {
    if (!currentUser.email) return;
    setResetLoading(true);
    try {
      await resetPassword(currentUser.email);
      toast({ title: 'Reset email sent', description: `Check ${currentUser.email} for the password reset link.` });
    } catch (err: any) {
      toast({ title: 'Failed to send reset email', description: err.message, variant: 'destructive' });
    }
    setResetLoading(false);
  };

  const handleLogout = async () => {
    try { await logout(); } catch (err) { console.error('Failed to log out', err); }
  };

  const memberSince = currentUser.metadata.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown';

  return (
    <div className="min-h-[calc(100vh-52px)] bg-background px-6 py-10">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header card */}
        <div className="bg-card border border-border rounded-lg px-5 py-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
            <User className="h-6 w-6 text-sky-600 dark:text-[#00d4ff]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {currentUser.displayName || currentUser.email?.split('@')[0] || 'Account'}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Mail className="h-3 w-3" />
              {currentUser.email}
            </p>
            <p className="text-xs text-muted-foreground/60 flex items-center gap-1 mt-0.5">
              <Calendar className="h-3 w-3" />
              Member since {memberSince}
            </p>
          </div>
        </div>

        {/* Profile section */}
        <section className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profile</p>
          </div>
          <form onSubmit={handleUpdateProfile} className="px-5 py-4 flex items-end gap-3">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="displayName" className="text-xs text-muted-foreground">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
              />
            </div>
            <Button type="submit" disabled={profileLoading || !displayName.trim()}>
              {profileLoading ? 'Saving...' : 'Save'}
            </Button>
          </form>
        </section>

        {/* Security section */}
        <section className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Security</p>
          </div>
          <div className="px-5 py-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Email Address</Label>
              <Input value={currentUser.email || ''} disabled />
              <p className="text-xs text-muted-foreground/60">Email address cannot be changed.</p>
            </div>
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm text-foreground flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-muted-foreground" />
                  Password
                </p>
                <p className="text-xs text-muted-foreground/60 mt-0.5 ml-6">Send a reset link to your email address.</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleResetPassword} disabled={resetLoading}>
                {resetLoading ? 'Sending...' : 'Send Reset Email'}
              </Button>
            </div>
          </div>
        </section>

        {/* Danger zone */}
        <section className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Danger Zone</p>
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground flex items-center gap-2">
                <LogOut className="h-4 w-4 text-muted-foreground" />
                Sign Out
              </p>
              <p className="text-xs text-muted-foreground/60 mt-0.5 ml-6">You will be returned to the home page.</p>
            </div>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default MyArcTrack;
