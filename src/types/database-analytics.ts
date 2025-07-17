export interface DataPoint {
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

export interface Project {
  id: string;
  name: string;
  devices: { [key: string]: any };
}

export interface DeviceInfo {
  id: string;
  name: string;
  projectName: string;
}

export type ViewMode = 'table' | 'map';

export type SortConfig = {
  key: keyof DataPoint;
  direction: 'asc' | 'desc';
} | null;

export interface DatabaseAnalyticsState {
  selectedDevice: DeviceInfo | null;
  viewMode: ViewMode;
  data: DataPoint[];
  filteredData: DataPoint[];
  loading: boolean;
  tableExists: boolean;
}