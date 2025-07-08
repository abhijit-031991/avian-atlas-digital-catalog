
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
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ open, onOpenChange, projectId }) => {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState('');
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
        addedBy: currentUser.uid
      };

      const response = await fetch('https://65.1.242.158:1880/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(`Failed to add user: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error: Failed to connect to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setStatus('idle');
    setErrorMessage('');
    onOpenChange(false);
  };

  const renderContent = () => {
    if (status === 'success') {
      return (
        <div className="text-center py-6">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">User Added Successfully</h3>
          <p className="text-gray-600">Passkey and instructions successfully emailed to user</p>
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
          <Label htmlFor="email">User Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter user's email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
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
          disabled={isSubmitting || !email.trim()}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding User...
            </>
          ) : (
            'Add User'
          )}
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add User to Project</DialogTitle>
          <DialogDescription>
            Add a new user to this project. They will receive login instructions via email.
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

export default AddUserDialog;
