import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DataPoint } from '@/types/database-analytics';

export const useDeviceData = (deviceId: string | null) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableExists, setTableExists] = useState(false);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    if (!deviceId) {
      setData([]);
      setTableExists(false);
      return;
    }

    setLoading(true);
    try {
      const { data: deviceData, error } = await supabase
        .from(deviceId as any)
        .select('*')
        .order('timestamp', { ascending: true });

      if (error) {
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
  }, [deviceId, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    tableExists,
    refreshData
  };
};