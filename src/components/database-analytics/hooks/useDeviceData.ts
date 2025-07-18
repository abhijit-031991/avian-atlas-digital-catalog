import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DataPoint } from '@/types/database-analytics';

export const useDeviceData = (deviceId: string | null) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableExists, setTableExists] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const fetchAllData = useCallback(async () => {
    if (!deviceId) {
      setData([]);
      setTableExists(false);
      setTotalCount(0);
      return;
    }

    setLoading(true);
    try {
      // First get the total count
      const { count, error: countError } = await supabase
        .from(deviceId as any)
        .select('*', { count: 'exact', head: true });

      if (countError) {
        if (countError.code === '42P01') {
          console.log(`Table ${deviceId} does not exist`);
          setTableExists(false);
          setData([]);
          setTotalCount(0);
          return;
        } else {
          throw countError;
        }
      }

      setTotalCount(count || 0);
      setTableExists(true);

      // Fetch all data in batches if there are many records
      const batchSize = 1000;
      const totalBatches = Math.ceil((count || 0) / batchSize);
      let allData: DataPoint[] = [];

      for (let i = 0; i < totalBatches; i++) {
        const { data: batchData, error: batchError } = await supabase
          .from(deviceId as any)
          .select('*')
          .order('timestamp', { ascending: true })
          .range(i * batchSize, (i + 1) * batchSize - 1);

        if (batchError) {
          throw batchError;
        }

        allData = [...allData, ...(batchData as unknown as DataPoint[] || [])];
      }

      setData(allData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch device data',
        variant: 'destructive'
      });
      setTableExists(false);
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [deviceId, toast]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const refreshData = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    data,
    loading,
    tableExists,
    totalCount,
    refreshData
  };
};