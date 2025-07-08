
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { database } from '@/config/firebase';
import { ref, set } from 'firebase/database';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface JoinProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectJoined: () => void;
}

const JoinProjectDialog: React.FC<JoinProjectDialogProps> = ({ 
  open, 
  onOpenChange, 
  onProjectJoined 
}) => {
  const { currentUser } = useAuth();
  const [passkey, setPasskey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passkey.trim() || !currentUser) return;

    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      // Step 3: Retrieve data from /passkeys/{enteredpasskey}
      const passkeyRef = ref(database, `passkeys/${passkey.trim()}`);
      const { get } = await import('firebase/database');
      const snapshot = await get(passkeyRef);
      
      if (!snapshot.exists()) {
        setStatus('error');
        setErrorMessage('Invalid passkey. Please check your passkey and try again.');
        return;
      }

      const passkeyData = snapshot.val();
      const projectId = passkeyData.ProjectID;

      if (!projectId) {
        setStatus('error');
        setErrorMessage('Invalid passkey data. Please contact the project owner.');
        return;
      }

      // Step 5: Add user to project users list
      const projectUserRef = ref(database, `Projects/${projectId}/Users/${currentUser.uid}`);
      await set(projectUserRef, true);

      // Step 6: Add project to user's projects list
      const userProjectRef = ref(database, `Users/${currentUser.uid}/Projects/${projectId}`);
      await set(userProjectRef, true);

      setStatus('success');
      onProjectJoined();
    } catch (error) {
      console.error('Error joining project:', error);
      setStatus('error');
      setErrorMessage('Failed to join project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPasskey('');
    setStatus('idle');
    setErrorMessage('');
    onOpenChange(false);
  };

  const renderContent = () => {
    if (status === 'success') {
      return (
        <div className="text-center py-6">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Successfully Joined Project</h3>
          <p className="text-gray-600">You have been added to the project and can now access it.</p>
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div className="text-center py-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
          <p className="text-red-600">{errorMessage}</p>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="passkey">Project Passkey</Label>
          <Input
            id="passkey"
            type="text"
            placeholder="Enter your project passkey"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            required
            disabled={isSubmitting}
          />
          <p className="text-sm text-gray-500">
            Contact the project owner for the passkey or check your email if you've already been contacted.
          </p>
        </div>
      </form>
    );
  };

  const renderFooter = () => {
    if (status === 'success' || status === 'error') {
      return (
        <Button onClick={handleClose} className="w-full">
          Close
        </Button>
      );
    }

    return (
      <div className="flex gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleClose}
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          onClick={handleSubmit}
          disabled={isSubmitting || !passkey.trim()}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Joining...
            </>
          ) : (
            'Join Project'
          )}
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Project</DialogTitle>
          <DialogDescription>
            Enter the passkey provided by the project owner to join the project.
          </DialogDescription>
        </DialogHeader>
        
        {renderContent()}
        
        <DialogFooter>
          {renderFooter()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinProjectDialog;
