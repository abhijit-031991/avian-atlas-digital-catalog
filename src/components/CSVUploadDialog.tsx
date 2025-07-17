
import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CSVUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string;
  onUploadComplete: () => void;
}

const CSVUploadDialog = ({ open, onOpenChange, deviceId, onUploadComplete }: CSVUploadDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    
    if (csvFile) {
      setFile(csvFile);
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please select a CSV file',
        variant: 'destructive'
      });
    }
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Please select a CSV file',
          variant: 'destructive'
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('deviceId', deviceId);

      const response = await fetch('https://n8n.arcturus-telemetry.in/webhook/fileUploads', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.tableUpdated === true) {
        toast({
          title: 'Success',
          description: 'CSV uploaded and processed successfully'
        });
        onUploadComplete();
        onOpenChange(false);
        setFile(null);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload CSV. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload CSV Data</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">Drop your CSV file here</p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>Browse Files</span>
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-start space-x-2 text-sm text-gray-600">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              Make sure your CSV file contains the required columns: timestamp, latitude, longitude, etc.
            </p>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex-1"
            >
              {uploading ? 'Uploading...' : 'Upload CSV'}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CSVUploadDialog;
