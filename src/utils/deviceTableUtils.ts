import { supabase } from '@/integrations/supabase/client';

export interface DeviceTrackingData {
  timestamp: number;
  locktime: number;
  latitude: number;
  longitude: number;
  hdop: number;
  count: number;
  satellites: number;
  speed: number;
  activity: boolean;
  ax: number;
  ay: number;
  az: number;
}

// Helper function to make direct API calls to PostgREST for dynamic tables
const makeDirectQuery = async (method: 'GET' | 'POST', tableName: string, body?: any) => {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;

  if (!token) {
    throw new Error('Authentication required');
  }

  const baseUrl = 'https://ppofcmrhlzkokdgrfkye.supabase.co/rest/v1';
  const headers = {
    'Authorization': `Bearer ${token}`,
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwb2ZjbXJobHprb2tkZ3Jma3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MTYwNjAsImV4cCI6MjA2Nzk5MjA2MH0.BgmtKoMeh1cCGRgJAFDjtxAsk-wCS0uLu5t0IQM36_Y',
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
  };

  const url = `${baseUrl}/${tableName}`;
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
};

/**
 * Insert tracking data for a specific device
 */
export const insertDeviceData = async (deviceId: string, data: DeviceTrackingData) => {
  // Sanitize device ID for table name
  const sanitizedDeviceId = deviceId.replace(/[^a-zA-Z0-9_]/g, '_');
  const tableName = `device_${sanitizedDeviceId}`;

  try {
    await makeDirectQuery('POST', tableName, data);
    return true;
  } catch (error) {
    throw new Error(`Failed to insert data for device ${deviceId}: ${error}`);
  }
};

/**
 * Get tracking data for a specific device
 */
export const getDeviceData = async (deviceId: string, limit = 100) => {
  // Sanitize device ID for table name
  const sanitizedDeviceId = deviceId.replace(/[^a-zA-Z0-9_]/g, '_');
  const tableName = `device_${sanitizedDeviceId}`;

  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (!token) {
      throw new Error('Authentication required');
    }

    const baseUrl = 'https://ppofcmrhlzkokdgrfkye.supabase.co/rest/v1';
    const url = `${baseUrl}/${tableName}?order=timestamp.desc&limit=${limit}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwb2ZjbXJobHprb2tkZ3Jma3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MTYwNjAsImV4cCI6MjA2Nzk5MjA2MH0.BgmtKoMeh1cCGRgJAFDjtxAsk-wCS0uLu5t0IQM36_Y',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch data for device ${deviceId}: ${error}`);
  }
};

/**
 * Get latest tracking data for a specific device
 */
export const getLatestDeviceData = async (deviceId: string) => {
  // Sanitize device ID for table name
  const sanitizedDeviceId = deviceId.replace(/[^a-zA-Z0-9_]/g, '_');
  const tableName = `device_${sanitizedDeviceId}`;

  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (!token) {
      throw new Error('Authentication required');
    }

    const baseUrl = 'https://ppofcmrhlzkokdgrfkye.supabase.co/rest/v1';
    const url = `${baseUrl}/${tableName}?order=timestamp.desc&limit=1`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwb2ZjbXJobHprb2tkZ3Jma3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MTYwNjAsImV4cCI6MjA2Nzk5MjA2MH0.BgmtKoMeh1cCGRgJAFDjtxAsk-wCS0uLu5t0IQM36_Y',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    throw new Error(`Failed to fetch latest data for device ${deviceId}: ${error}`);
  }
};

/**
 * Check if a device table exists by attempting to query it
 */
export const checkDeviceTableExists = async (deviceId: string): Promise<boolean> => {
  try {
    const sanitizedDeviceId = deviceId.replace(/[^a-zA-Z0-9_]/g, '_');
    const tableName = `device_${sanitizedDeviceId}`;

    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (!token) {
      return false;
    }

    const baseUrl = 'https://ppofcmrhlzkokdgrfkye.supabase.co/rest/v1';
    const url = `${baseUrl}/${tableName}?limit=1`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwb2ZjbXJobHprb2tkZ3Jma3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MTYwNjAsImV4cCI6MjA2Nzk5MjA2MH0.BgmtKoMeh1cCGRgJAFDjtxAsk-wCS0uLu5t0IQM36_Y',
        'Content-Type': 'application/json'
      }
    });

    return response.ok;
  } catch {
    return false;
  }
};