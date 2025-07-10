
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { database } from '@/config/firebase';
import { ref, get, update } from 'firebase/database';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface DeviceSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string | null;
}

interface DeviceSettings {
  [key: string]: any;
}

const DeviceSettingsDialog: React.FC<DeviceSettingsDialogProps> = ({
  open,
  onOpenChange,
  deviceId,
}) => {
  const [settings, setSettings] = useState<DeviceSettings>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && deviceId) {
      fetchDeviceSettings();
    }
  }, [open, deviceId]);

  const fetchDeviceSettings = async () => {
    if (!deviceId) return;

    setLoading(true);
    try {
      const settingsRef = ref(database, `tags/${deviceId}/settings`);
      const snapshot = await get(settingsRef);
      
      if (snapshot.exists()) {
        setSettings(snapshot.val());
      } else {
        setSettings({});
        toast({
          title: "No Settings Found",
          description: "No settings found for this device",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch device settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    if (!deviceId) return;

    setSaving(true);
    try {
      const settingsRef = ref(database, `tags/${deviceId}/settings`);
      await update(settingsRef, settings);
      
      toast({
        title: "Success",
        description: "Device settings updated successfully",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update device settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const renderSettingInput = (key: string, value: any) => {
    const inputType = typeof value === 'number' ? 'number' : 'text';
    
    return (
      <div key={key} className="space-y-2">
        <Label htmlFor={key} className="text-sm font-medium">
          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
        </Label>
        <Input
          id={key}
          type={inputType}
          value={value?.toString() || ''}
          onChange={(e) => handleSettingChange(key, e.target.value)}
          placeholder={`Enter ${key}`}
        />
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Device Settings - {deviceId}</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading settings...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.keys(settings).length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No settings available for this device
              </p>
            ) : (
              <div className="space-y-4">
                {Object.entries(settings).map(([key, value]) =>
                  renderSettingInput(key, value)
                )}
              </div>
            )}
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveSettings} 
                disabled={saving || Object.keys(settings).length === 0}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeviceSettingsDialog;
