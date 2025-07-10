
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DeviceDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device: {
    deviceId: string;
    lastContact: number;
    lastGPSFix?: number;
    accuracy: number;
    timeToFix?: number;
  } | null;
}

const DeviceDetailsDialog: React.FC<DeviceDetailsDialogProps> = ({
  open,
  onOpenChange,
  device,
}) => {
  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (!device) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Device Details - {device.deviceId}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Last Seen</label>
              <p className="text-sm">{formatDate(device.lastContact)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Last GPS Fix</label>
              <p className="text-sm">{device.lastGPSFix ? formatDate(device.lastGPSFix) : 'Unknown'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">GPS Accuracy</label>
              <p className="text-sm">{device.accuracy || 'Unknown'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Time to Fix</label>
              <p className="text-sm">{device.timeToFix || 'Unknown'}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeviceDetailsDialog;
