
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Download, Upload, Filter, RefreshCw } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface DataPoint {
  pointid: number;
  id: number;
  timestamp: number;
  locktime: number;
  latitude: number;
  longitude: number;
  hdop: number | null;
  count: number;
  satellites: number | null;
  speed: number | null;
  activity: boolean | null;
  ax: number | null;
  ay: number | null;
  az: number | null;
  created_at: string | null;
}

interface DataTableProps {
  deviceId: string | null;
  deviceName: string;
  projectName: string;
}

const DataTable = ({ deviceId, deviceName, projectName }: DataTableProps) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchData = async () => {
    if (!deviceId) return;
    
    setLoading(true);
    try {
      // This would typically fetch from your Supabase device table
      // For now, we'll simulate some data with all fields
      const simulatedData: DataPoint[] = [
        {
          pointid: 1,
          id: 1001,
          timestamp: Date.now() - 86400000,
          locktime: 1234567890,
          latitude: 28.6139,
          longitude: 77.2090,
          hdop: 1.2,
          count: 100,
          satellites: 8,
          speed: 25,
          activity: true,
          ax: 0.1,
          ay: 0.2,
          az: 9.8,
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          pointid: 2,
          id: 1002,
          timestamp: Date.now() - 43200000,
          locktime: 1234567891,
          latitude: 28.6129,
          longitude: 77.2080,
          hdop: 1.5,
          count: 101,
          satellites: 7,
          speed: 30,
          activity: false,
          ax: 0.05,
          ay: 0.15,
          az: 9.85,
          created_at: new Date(Date.now() - 43200000).toISOString()
        },
        {
          pointid: 3,
          id: 1003,
          timestamp: Date.now() - 21600000,
          locktime: 1234567892,
          latitude: 28.6149,
          longitude: 77.2100,
          hdop: 0.9,
          count: 102,
          satellites: 9,
          speed: 15,
          activity: true,
          ax: -0.02,
          ay: 0.18,
          az: 9.79,
          created_at: new Date(Date.now() - 21600000).toISOString()
        }
      ];
      
      setData(simulatedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch device data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [deviceId]);

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        // Here you would parse the CSV and upload to your backend
        toast({
          title: 'Success',
          description: 'CSV file uploaded successfully'
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to process CSV file',
          variant: 'destructive'
        });
      }
    };
    reader.readAsText(file);
  };

  const exportData = () => {
    const csvContent = [
      ['Point ID', 'ID', 'Timestamp', 'Locktime', 'Latitude', 'Longitude', 'HDOP', 'Count', 'Satellites', 'Speed', 'Activity', 'AX', 'AY', 'AZ', 'Created At'],
      ...data.map(row => [
        row.pointid,
        row.id,
        row.timestamp,
        row.locktime,
        row.latitude,
        row.longitude,
        row.hdop,
        row.count,
        row.satellites,
        row.speed,
        row.activity,
        row.ax,
        row.ay,
        row.az,
        row.created_at
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deviceId}_data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredData = data.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.latitude.toString().includes(searchTerm) ||
      item.longitude.toString().includes(searchTerm) ||
      item.id.toString().includes(searchTerm);
    
    const itemDate = new Date(item.timestamp);
    const matchesDateRange = (!startDate || itemDate >= startDate) && 
                           (!endDate || itemDate <= endDate);
    
    return matchesSearch && matchesDateRange;
  });

  if (!deviceId) {
    return (
      <Card className="flex-1">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center text-gray-500">
            <Filter className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Select a device to view data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              {deviceName} Data
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{projectName}</Badge>
              <Badge variant="secondary">{filteredData.length} records</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <label className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-1" />
                  Upload CSV
                </span>
              </Button>
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <Input
            placeholder="Search coordinates or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {startDate ? format(startDate, 'MMM dd') : 'Start Date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {endDate ? format(endDate, 'MMM dd') : 'End Date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border max-h-96 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="h-8">
                <TableHead className="w-16 text-xs">Point ID</TableHead>
                <TableHead className="w-20 text-xs">ID</TableHead>
                <TableHead className="w-32 text-xs">Timestamp</TableHead>
                <TableHead className="w-24 text-xs">Locktime</TableHead>
                <TableHead className="w-24 text-xs">Latitude</TableHead>
                <TableHead className="w-24 text-xs">Longitude</TableHead>
                <TableHead className="w-16 text-xs">HDOP</TableHead>
                <TableHead className="w-16 text-xs">Count</TableHead>
                <TableHead className="w-16 text-xs">Satellites</TableHead>
                <TableHead className="w-16 text-xs">Speed</TableHead>
                <TableHead className="w-20 text-xs">Activity</TableHead>
                <TableHead className="w-16 text-xs">AX</TableHead>
                <TableHead className="w-16 text-xs">AY</TableHead>
                <TableHead className="w-16 text-xs">AZ</TableHead>
                <TableHead className="w-32 text-xs">Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={15} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Loading data...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={15} className="text-center py-8 text-gray-500">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, index) => (
                  <TableRow key={index} className="h-8">
                    <TableCell className="text-xs py-1">{row.pointid}</TableCell>
                    <TableCell className="text-xs py-1">{row.id}</TableCell>
                    <TableCell className="font-mono text-xs py-1">
                      {new Date(row.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-xs py-1">{row.locktime}</TableCell>
                    <TableCell className="font-mono text-xs py-1">{row.latitude.toFixed(6)}</TableCell>
                    <TableCell className="font-mono text-xs py-1">{row.longitude.toFixed(6)}</TableCell>
                    <TableCell className="text-xs py-1">{row.hdop?.toFixed(2) || 'N/A'}</TableCell>
                    <TableCell className="text-xs py-1">{row.count}</TableCell>
                    <TableCell className="text-xs py-1">{row.satellites || 'N/A'}</TableCell>
                    <TableCell className="text-xs py-1">{row.speed ? `${row.speed} km/h` : 'N/A'}</TableCell>
                    <TableCell className="py-1">
                      <Badge variant={row.activity ? "default" : "secondary"} className="text-xs">
                        {row.activity ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs py-1">{row.ax?.toFixed(2) || 'N/A'}</TableCell>
                    <TableCell className="text-xs py-1">{row.ay?.toFixed(2) || 'N/A'}</TableCell>
                    <TableCell className="text-xs py-1">{row.az?.toFixed(2) || 'N/A'}</TableCell>
                    <TableCell className="font-mono text-xs py-1">
                      {row.created_at ? new Date(row.created_at).toLocaleString() : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;
