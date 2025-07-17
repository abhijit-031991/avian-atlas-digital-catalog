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
import { CalendarIcon, Download, Upload, Filter, RefreshCw, Database, Plus, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import CSVUploadDialog from './CSVUploadDialog';

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
  onDataChange?: (data: DataPoint[]) => void;
}

type SortConfig = {
  key: keyof DataPoint;
  direction: 'asc' | 'desc';
} | null;

const DataTable = ({ deviceId, deviceName, projectName, onDataChange }: DataTableProps) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [tableExists, setTableExists] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'pointid', direction: 'asc' });
  const { toast } = useToast();

  const fetchData = async () => {
    if (!deviceId) return;
    
    setLoading(true);
    try {
      // Query the device-specific table using type assertion
      const { data: deviceData, error } = await supabase
        .from(deviceId as any)
        .select('*')
        .order('pointid', { ascending: true });

      if (error) {
        // Check if error is because table doesn't exist
        if (error.code === '42P01') {
          console.log(`Table ${deviceId} does not exist`);
          setTableExists(false);
          setData([]);
        } else {
          throw error;
        }
      } else {
        setTableExists(true);
        const typedData = (deviceData as unknown) as DataPoint[] || [];
        setData(typedData);
        onDataChange?.(typedData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch device data',
        variant: 'destructive'
      });
      setTableExists(false);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [deviceId]);

  const handleUploadComplete = () => {
    // Refetch data after upload
    fetchData();
  };

  const handleSort = (key: keyof DataPoint) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey: keyof DataPoint) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ArrowUpDown className="h-3 w-3 ml-1 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="h-3 w-3 ml-1 text-blue-600" /> : 
      <ArrowDown className="h-3 w-3 ml-1 text-blue-600" />;
  };

  const exportData = () => {
    if (data.length === 0) {
      toast({
        title: 'No data',
        description: 'No data available to export',
        variant: 'destructive'
      });
      return;
    }

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

  const filteredAndSortedData = React.useMemo(() => {
    let filtered = data.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.latitude.toString().includes(searchTerm) ||
        item.longitude.toString().includes(searchTerm) ||
        item.id.toString().includes(searchTerm);
      
      const itemDate = new Date(item.timestamp);
      const matchesDateRange = (!startDate || itemDate >= startDate) && 
                             (!endDate || itemDate <= endDate);
      
      return matchesSearch && matchesDateRange;
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, startDate, endDate, sortConfig]);

  // Notify parent component when filtered data changes
  React.useEffect(() => {
    onDataChange?.(filteredAndSortedData);
  }, [filteredAndSortedData, onDataChange]);

  if (!deviceId) {
    return (
      <Card className="flex-1">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center text-gray-500">
            <Database className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No Device Selected</h3>
            <p className="text-sm mb-4">Choose a device from the sidebar to view its data</p>
            <div className="text-xs text-gray-400">
              <p>Don't have any devices yet?</p>
              <p className="mt-1">Create your first project and add a device to get started</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tableExists && !loading) {
    return (
      <Card className="flex-1">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center text-gray-500">
            <Database className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No Data Available</h3>
            <p className="text-sm mb-4">This device doesn't have any data yet</p>
            <Button onClick={() => setShowUploadDialog(true)} className="mt-2">
              <Upload className="h-4 w-4 mr-2" />
              Upload CSV Data
            </Button>
            <p className="text-xs text-gray-400 mt-2">
              Upload a properly formatted CSV file to populate the data table
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                {deviceName} Data
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{projectName}</Badge>
                <Badge variant="secondary">{filteredAndSortedData.length} records</Badge>
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
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportData}
                disabled={data.length === 0}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowUploadDialog(true)}
              >
                <Upload className="h-4 w-4 mr-1" />
                Upload CSV
              </Button>
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
          <div className="w-full overflow-x-auto">
            <div className="rounded-md border min-w-[1400px]">
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow className="h-8">
                      <TableHead className="w-16 text-xs font-medium">
                        <Button variant="ghost" size="sm" onClick={() => handleSort('pointid')} className="p-0 h-auto font-medium text-xs flex items-center">
                          Point ID {getSortIcon('pointid')}
                        </Button>
                      </TableHead>
                      <TableHead className="w-20 text-xs font-medium">
                        <Button variant="ghost" size="sm" onClick={() => handleSort('id')} className="p-0 h-auto font-medium text-xs flex items-center">
                          ID {getSortIcon('id')}
                        </Button>
                      </TableHead>
                      <TableHead className="w-32 text-xs font-medium">
                        <Button variant="ghost" size="sm" onClick={() => handleSort('timestamp')} className="p-0 h-auto font-medium text-xs flex items-center">
                          Timestamp {getSortIcon('timestamp')}
                        </Button>
                      </TableHead>
                      <TableHead className="w-24 text-xs font-medium">
                        <Button variant="ghost" size="sm" onClick={() => handleSort('locktime')} className="p-0 h-auto font-medium text-xs flex items-center">
                          Locktime {getSortIcon('locktime')}
                        </Button>
                      </TableHead>
                      <TableHead className="w-24 text-xs font-medium">
                        <Button variant="ghost" size="sm" onClick={() => handleSort('latitude')} className="p-0 h-auto font-medium text-xs flex items-center">
                          Latitude {getSortIcon('latitude')}
                        </Button>
                      </TableHead>
                      <TableHead className="w-24 text-xs font-medium">
                        <Button variant="ghost" size="sm" onClick={() => handleSort('longitude')} className="p-0 h-auto font-medium text-xs flex items-center">
                          Longitude {getSortIcon('longitude')}
                        </Button>
                      </TableHead>
                      <TableHead className="w-16 text-xs font-medium">
                        <Button variant="ghost" size="sm" onClick={() => handleSort('hdop')} className="p-0 h-auto font-medium text-xs flex items-center">
                          HDOP {getSortIcon('hdop')}
                        </Button>
                      </TableHead>
                      <TableHead className="w-16 text-xs font-medium">
                        <Button variant="ghost" size="sm" onClick={() => handleSort('count')} className="p-0 h-auto font-medium text-xs flex items-center">
                          Count {getSortIcon('count')}
                        </Button>
                      </TableHead>
                      <TableHead className="w-20 text-xs font-medium">
                        <Button variant="ghost" size="sm" onClick={() => handleSort('satellites')} className="p-0 h-auto font-medium text-xs flex items-center">
                          Satellites {getSortIcon('satellites')}
                        </Button>
                      </TableHead>
                      <TableHead className="w-16 text-xs font-medium">
                        <Button variant="ghost" size="sm" onClick={() => handleSort('speed')} className="p-0 h-auto font-medium text-xs flex items-center">
                          Speed {getSortIcon('speed')}
                        </Button>
                      </TableHead>
                      <TableHead className="w-20 text-xs font-medium">
                        <Button variant="ghost" size="sm" onClick={() => handleSort('activity')} className="p-0 h-auto font-medium text-xs flex items-center">
                          Activity {getSortIcon('activity')}
                        </Button>
                      </TableHead>
                      <TableHead className="w-16 text-xs font-medium">
                        <Button variant="ghost" size="sm" onClick={() => handleSort('ax')} className="p-0 h-auto font-medium text-xs flex items-center">
                          AX {getSortIcon('ax')}
                        </Button>
                      </TableHead>
                      <TableHead className="w-16 text-xs font-medium">
                        <Button variant="ghost" size="sm" onClick={() => handleSort('ay')} className="p-0 h-auto font-medium text-xs flex items-center">
                          AY {getSortIcon('ay')}
                        </Button>
                      </TableHead>
                      <TableHead className="w-16 text-xs font-medium">
                        <Button variant="ghost" size="sm" onClick={() => handleSort('az')} className="p-0 h-auto font-medium text-xs flex items-center">
                          AZ {getSortIcon('az')}
                        </Button>
                      </TableHead>
                      <TableHead className="w-32 text-xs font-medium">
                        <Button variant="ghost" size="sm" onClick={() => handleSort('created_at')} className="p-0 h-auto font-medium text-xs flex items-center">
                          Created At {getSortIcon('created_at')}
                        </Button>
                      </TableHead>
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
                    ) : filteredAndSortedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={15} className="text-center py-8 text-gray-500">
                          {data.length === 0 ? (
                            <div>
                              <p>No data found for this device</p>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setShowUploadDialog(true)}
                                className="mt-2"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Upload Data
                              </Button>
                            </div>
                          ) : (
                            'No data matches your search criteria'
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAndSortedData.map((row, index) => (
                        <TableRow key={index} className="h-6">
                          <TableCell className="text-xs py-1 px-2">{row.pointid}</TableCell>
                          <TableCell className="text-xs py-1 px-2">{row.id}</TableCell>
                          <TableCell className="font-mono text-xs py-1 px-2">
                            {new Date(row.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell className="font-mono text-xs py-1 px-2">{row.locktime}</TableCell>
                          <TableCell className="font-mono text-xs py-1 px-2">{row.latitude.toFixed(6)}</TableCell>
                          <TableCell className="font-mono text-xs py-1 px-2">{row.longitude.toFixed(6)}</TableCell>
                          <TableCell className="text-xs py-1 px-2">{row.hdop?.toFixed(2) || 'N/A'}</TableCell>
                          <TableCell className="text-xs py-1 px-2">{row.count}</TableCell>
                          <TableCell className="text-xs py-1 px-2">{row.satellites || 'N/A'}</TableCell>
                          <TableCell className="text-xs py-1 px-2">{row.speed ? `${row.speed} km/h` : 'N/A'}</TableCell>
                          <TableCell className="py-1 px-2">
                            <Badge variant={row.activity ? "default" : "secondary"} className="text-xs px-1 py-0">
                              {row.activity ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs py-1 px-2">{row.ax?.toFixed(2) || 'N/A'}</TableCell>
                          <TableCell className="text-xs py-1 px-2">{row.ay?.toFixed(2) || 'N/A'}</TableCell>
                          <TableCell className="text-xs py-1 px-2">{row.az?.toFixed(2) || 'N/A'}</TableCell>
                          <TableCell className="font-mono text-xs py-1 px-2">
                            {row.created_at ? new Date(row.created_at).toLocaleString() : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <CSVUploadDialog 
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        deviceId={deviceId}
        onUploadComplete={handleUploadComplete}
      />
    </>
  );
};

export default DataTable;
