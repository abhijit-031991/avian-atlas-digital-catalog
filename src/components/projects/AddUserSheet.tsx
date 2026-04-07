import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface AddUserSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  devices: string[];
}

const AddUserSheet: React.FC<AddUserSheetProps> = ({ open, onOpenChange, projectId, devices }) => {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'viewer'>('viewer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !currentUser) return;

    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const payload = {
        newUser: email.trim(),
        addedBy: currentUser.uid,
        ProjectID: projectId,
        Devices: devices.length > 0 ? devices : null,
        role,
      };

      const response = await fetch('https://n8n.arcturus-telemetry.in/webhook/addUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(`Server responded with ${response.status}: ${response.statusText}`);
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error — could not reach the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setRole('viewer');
    setStatus('idle');
    setErrorMessage('');
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="w-[380px] sm:w-[420px] bg-[#0f1623] border-l border-[#1e2d45] text-primaryoreground"
      >
        <SheetHeader className="border-border border-[#1e2d45] pb-4">
          <SheetTitle className="text-primaryoreground">Add User to Project</SheetTitle>
          <SheetDescription className="text-muted-foreground text-sm">
            The user will receive a passkey and setup instructions by email.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {status === 'success' ? (
            <div className="flex flex-col items-center text-center py-10 gap-3">
              <CheckCircle className="h-12 w-12 text-emerald-400" />
              <p className="text-sm font-semibold text-primaryoreground">Invitation Sent</p>
              <p className="text-xs text-muted-foreground">
                Passkey and setup instructions have been emailed to the user.
              </p>
              <Button onClick={handleClose} className="mt-4 bg-[#00d4ff] text-[#0a0f1a] hover:bg-[#00bce0] font-semibold">
                Done
              </Button>
            </div>
          ) : status === 'error' ? (
            <div className="flex flex-col items-center text-center py-10 gap-3">
              <AlertCircle className="h-12 w-12 text-red-400" />
              <p className="text-sm font-semibold text-primaryoreground">Failed to Send</p>
              <p className="text-xs text-red-400">{errorMessage}</p>
              <Button
                variant="outline"
                onClick={() => setStatus('idle')}
                className="mt-4 border-[#1e2d45] bg-transparent text-primaryoreground/80 hover:bg-[#1a2235]"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="add-user-email" className="text-xs text-muted-foreground">
                  Email Address
                </Label>
                <Input
                  id="add-user-email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-[#1a2235] border-[#1e2d45] text-primaryoreground placeholder:text-muted-foreground/60
                             focus-visible:ring-[#00d4ff33] focus-visible:border-[#00d4ff66]"
                />
              </div>

              {/* Role picker */}
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground">Role</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(v) => setRole(v as 'admin' | 'viewer')}
                  className="space-y-2"
                >
                  <label
                    htmlFor="role-admin"
                    className={[
                      'flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors',
                      role === 'admin'
                        ? 'border-[#7c3aed66] bg-[#7c3aed0d]'
                        : 'border-[#1e2d45] hover:border-[#2a3a56] hover:bg-[#1a2235]',
                    ].join(' ')}
                  >
                    <RadioGroupItem
                      value="admin"
                      id="role-admin"
                      className="mt-0.5 border-slate-600 text-[#7c3aed]"
                    />
                    <div>
                      <p className="text-sm font-medium text-primaryoreground">Admin</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Can add/remove users and devices. Cannot delete the project or change the Owner.
                      </p>
                    </div>
                  </label>

                  <label
                    htmlFor="role-viewer"
                    className={[
                      'flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors',
                      role === 'viewer'
                        ? 'border-[#64748b66] bg-[#64748b0d]'
                        : 'border-[#1e2d45] hover:border-[#2a3a56] hover:bg-[#1a2235]',
                    ].join(' ')}
                  >
                    <RadioGroupItem
                      value="viewer"
                      id="role-viewer"
                      className="mt-0.5 border-slate-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-primaryoreground">Viewer</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Read-only access. Can view device data and tracking but cannot make changes.
                      </p>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 border-[#1e2d45] bg-transparent text-primaryoreground/80 hover:bg-[#1a2235]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !email.trim()}
                  className="flex-1 bg-[#00d4ff] text-[#0a0f1a] hover:bg-[#00bce0] font-semibold"
                >
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending...</>
                  ) : (
                    'Send Invite'
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddUserSheet;
