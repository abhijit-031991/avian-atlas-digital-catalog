
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { database } from '@/config/firebase';
import { ref, update } from 'firebase/database';
import { useToast } from '@/hooks/use-toast';

interface ChangeIconDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string | null;
  currentIcon: string;
  onIconChange: (newIcon: string) => void;
}

const availableIcons = [
  'antelope.png', 'bat.png', 'bear.png', 'bison.png', 'cow.png', 
  'deer.png', 'dog.png', 'eagle.png', 'elephant.png', 'fox.png',
  'gorilla.png', 'hyena.png', 'leopard.png', 'lion.png', 'monkey.png',
  'otter.png', 'rhinoceros.png', 'sheep.png', 'sloth.png', 'tiger.png',
  'turtle.png', 'vulture.png'
];

const ChangeIconDialog: React.FC<ChangeIconDialogProps> = ({
  open,
  onOpenChange,
  deviceId,
  currentIcon,
  onIconChange,
}) => {
  const [selectedIcon, setSelectedIcon] = useState(currentIcon);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleIconChange = async () => {
    if (!deviceId || !selectedIcon) return;

    setLoading(true);
    try {
      const deviceRef = ref(database, `tags/${deviceId}/recent`);
      await update(deviceRef, { img: selectedIcon });
      
      onIconChange(selectedIcon);
      toast({
        title: "Success",
        description: "Device icon updated successfully",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating icon:', error);
      toast({
        title: "Error",
        description: "Failed to update device icon",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Change Device Icon</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-4">
            {availableIcons.map((icon) => (
              <button
                key={icon}
                onClick={() => setSelectedIcon(icon)}
                className={`p-3 border-2 rounded-lg hover:bg-gray-50 transition-colors ${
                  selectedIcon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <img
                  src={`/tracking/markers/${icon}`}
                  alt={icon.replace('.png', '')}
                  className="w-8 h-8 mx-auto"
                />
                <p className="text-xs mt-1 text-center truncate">
                  {icon.replace('.png', '')}
                </p>
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleIconChange} disabled={loading}>
              {loading ? 'Updating...' : 'Update Icon'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeIconDialog;
