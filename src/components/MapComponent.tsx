import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Route, Layers, Target, Clock, Zap, SlidersHorizontal,
  Flame, Hexagon, Star, MapPin, Tag, Loader2, ArrowRight,
} from 'lucide-react';
import { database } from '@/config/firebase';
import { ref, onValue } from 'firebase/database';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router-dom';
import DeviceDetailsDialog from './DeviceDetailsDialog';
import ChangeIconDialog from './ChangeIconDialog';
import DeviceSettingsDialog from './DeviceSettingsDialog';
import { supabase } from '@/integrations/supabase/client';
import { escapeHtml } from '@/lib/utils';
import { DataPoint } from '@/types/database-analytics';

declare global {
  interface Window {
    google: any;
    showDeviceDetails: (deviceId: string) => void;
    showChangeIcon: (deviceId: string) => void;
    showDeviceSettings: (deviceId: string) => void;
    downloadDeviceData: (deviceId: string) => void;
  }
}

// ── Public types ───────────────────────────────────────────────────────────────
export interface DeviceData {
  deviceId: string;
  lat: number;
  lng: number;
  battery: number;
  signal: string;
  lastContact: number;
  accuracy: number;
  dataCount: number;
  img?: string;
  lastGPSFix?: number;
  timeToFix?: number;
}

export interface BaseStationData {
  stationId: string;
  lat: number;
  lng: number;
  lastHeartbeat: string | number;
  signal?: number;
  status?: string;
  // Extended heartbeat fields
  lteStatus?: string;
  uptimeS?: number;
  fwVersion?: number;
  flashUsedPct?: number;
  flashUnsent?: number;
  lastRxAgoMs?: number;
  uniqueDevices?: number;
  batteryPct?: number;
}

interface MapComponentProps {
  onDevicesChange?: (devices: DeviceData[]) => void;
  onBaseStationsChange?: (stations: BaseStationData[]) => void;
  focusDevice?: string | null;
  focusStation?: string | null;
  onDeviceSelect?: (deviceId: string) => void;
}

// ── Layer types ───────────────────────────────────────────────────────────────
interface LayerState {
  trail: boolean;
  sessions: boolean;
  hdopCircles: boolean;
  lockTimeColor: boolean;
  gapMarkers: boolean;
  timeFilter: boolean;
  heatmap: boolean;
  convexHull: boolean;
  concaveHull: boolean;
  pointMarkers: boolean;
  pointLabels: boolean;
}

const DEFAULT_LAYERS: LayerState = {
  trail: true,
  sessions: false,
  hdopCircles: false,
  lockTimeColor: false,
  gapMarkers: false,
  timeFilter: false,
  heatmap: false,
  convexHull: false,
  concaveHull: false,
  pointMarkers: false,
  pointLabels: false,
};

// ── Constants ─────────────────────────────────────────────────────────────────
const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const BASE_STATION_ICON = '/tracking/markers/signal-tower.png';
const SESSION_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ec4899',
  '#8b5cf6', '#06b6d4', '#ef4444', '#84cc16',
  '#f97316', '#a855f7',
];
const GAP_THRESHOLD_SECS = 2 * 3600;

// ── Helpers ───────────────────────────────────────────────────────────────────
function getInfoWindowTheme() {
  const dark = document.documentElement.classList.contains('dark');
  return dark ? {
    bg: '#0f1623', text: '#e2e8f0', border: '#1e2d45',
    muted: '#64748b', badge: '#1a2235', accent: '#00d4ff', accentFg: '#0a0f1a',
    btnAlt: '#1a2235', btnAltText: '#e2e8f0', btnAltBorder: '#1e2d45',
  } : {
    bg: '#ffffff', text: '#111827', border: '#e5e7eb',
    muted: '#6b7280', badge: '#f3f4f6', accent: '#0284c7', accentFg: '#ffffff',
    btnAlt: '#f3f4f6', btnAltText: '#374151', btnAltBorder: '#d1d5db',
  };
}

function getLockTimeColor(locktime: number): string {
  if (locktime < 20) return '#22c55e';
  if (locktime < 60) return '#f59e0b';
  return '#ef4444';
}

function detectSessions(pts: DataPoint[]): number[] {
  const out: number[] = [];
  let idx = 0, prev = -Infinity;
  for (const p of pts) { if (p.count < prev) idx++; out.push(idx); prev = p.count; }
  return out;
}

type Pt = { lat: number; lng: number };
function cross(O: Pt, A: Pt, B: Pt) {
  return (A.lng - O.lng) * (B.lat - O.lat) - (A.lat - O.lat) * (B.lng - O.lng);
}
function computeConvexHull(pts: Pt[]): Pt[] {
  if (pts.length < 3) return pts;
  const s = [...pts].sort((a, b) => a.lng !== b.lng ? a.lng - b.lng : a.lat - b.lat);
  const lower: Pt[] = [], upper: Pt[] = [];
  for (const p of s) { while (lower.length >= 2 && cross(lower[lower.length-2], lower[lower.length-1], p) <= 0) lower.pop(); lower.push(p); }
  for (let i = s.length - 1; i >= 0; i--) { const p = s[i]; while (upper.length >= 2 && cross(upper[upper.length-2], upper[upper.length-1], p) <= 0) upper.pop(); upper.push(p); }
  upper.pop(); lower.pop();
  return [...lower, ...upper];
}
function computeConcaveHull(pts: Pt[], sectors = 72): Pt[] {
  if (pts.length < 4) return computeConvexHull(pts);
  const cx = pts.reduce((s, p) => s + p.lat, 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p.lng, 0) / pts.length;
  const buckets: (Pt | null)[] = new Array(sectors).fill(null);
  const dists: number[] = new Array(sectors).fill(0);
  for (const p of pts) {
    const angle = Math.atan2(p.lat - cx, p.lng - cy);
    const i = Math.abs(Math.floor(((angle + Math.PI) / (2 * Math.PI)) * sectors) % sectors);
    const d = Math.hypot(p.lat - cx, p.lng - cy);
    if (d > dists[i]) { buckets[i] = p; dists[i] = d; }
  }
  return buckets.filter(Boolean) as Pt[];
}
function makeSvgUrl(svg: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

// ── Component ─────────────────────────────────────────────────────────────────
const MapComponent: React.FC<MapComponentProps> = ({
  onDevicesChange, onBaseStationsChange, focusDevice, focusStation, onDeviceSelect,
}) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Live map refs
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const bsMarkersRef = useRef<{ [key: string]: any }>({});
  const infoWindowRef = useRef<any>(null);
  const devicesRef = useRef<DeviceData[]>([]);
  const baseStationsRef = useRef<BaseStationData[]>([]);

  // Historical layer refs
  const trailRef = useRef<any>(null);
  const sessionLinesRef = useRef<any[]>([]);
  const hdopCirclesRef = useRef<any[]>([]);
  const lockMarkersRef = useRef<any[]>([]);
  const gapMarkersRef = useRef<any[]>([]);
  const heatmapRef = useRef<any>(null);
  const convexRef = useRef<any>(null);
  const concaveRef = useRef<any>(null);
  const pointMarkersRef = useRef<any[]>([]);
  const pointLabelsRef = useRef<any[]>([]);
  const histEndMarkersRef = useRef<any[]>([]);

  // Live state
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [changeIconDialogOpen, setChangeIconDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [selectedDeviceData, setSelectedDeviceData] = useState<DeviceData | null>(null);

  // Historical / layer state
  const [layers, setLayers] = useState<LayerState>(DEFAULT_LAYERS);
  const [historicalData, setHistoricalData] = useState<DataPoint[]>([]);
  const [displayPoints, setDisplayPoints] = useState<DataPoint[]>([]);
  const [timeRange, setTimeRange] = useState<number[]>([0, 100]);
  const [histLoading, setHistLoading] = useState(false);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);

  // ── Load Google Maps ────────────────────────────────────────────────────────
  useEffect(() => {
    if (window.google) { setMapLoaded(true); return; }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=geometry,visualization`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    script.onerror = () => setError('Failed to load Google Maps');
    document.head.appendChild(script);
  }, []);

  // ── Initialize map ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 20.5937, lng: 78.9629 },
      zoom: 4,
      mapTypeId: 'satellite',
      mapTypeControl: true,
      mapTypeControlOptions: { position: window.google.maps.ControlPosition.TOP_RIGHT },
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_BOTTOM },
    });
    infoWindowRef.current = new window.google.maps.InfoWindow();
  }, [mapLoaded]);

  // ── Subscribe to tracking devices ───────────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;
    const deviceUnsubs: Record<string, () => void> = {};
    const latestData: Record<string, DeviceData> = {};
    function flush() {
      const list = Object.values(latestData);
      devicesRef.current = list;
      setDevices([...list]);
      onDevicesChange?.([...list]);
      setLoading(false);
    }
    const userDevicesRef = ref(database, `Users/${currentUser.uid}/Devices`);
    const unsubList = onValue(userDevicesRef, (snap) => {
      if (!snap.exists()) {
        Object.values(deviceUnsubs).forEach(fn => fn());
        Object.keys(deviceUnsubs).forEach(k => delete deviceUnsubs[k]);
        devicesRef.current = []; setDevices([]); onDevicesChange?.([]); setLoading(false);
        return;
      }
      const currentIds = new Set(Object.keys(snap.val()));
      Object.keys(deviceUnsubs).forEach(id => {
        if (!currentIds.has(id)) { deviceUnsubs[id](); delete deviceUnsubs[id]; delete latestData[id]; }
      });
      currentIds.forEach(deviceId => {
        if (deviceUnsubs[deviceId]) return;
        deviceUnsubs[deviceId] = onValue(ref(database, `tags/${deviceId}/recent`), snap2 => {
          if (!snap2.exists()) return;
          const d = snap2.val();
          latestData[deviceId] = {
            deviceId, lat: d.Lat ?? 0, lng: d.Lng ?? 0,
            battery: d.Battery ?? 0, signal: d.Signal ?? 'No Signal',
            lastContact: d.tts ?? 0, accuracy: d.hdop ?? 0,
            dataCount: 0, img: d.img ?? 'deer.png',
          };
          flush();
        });
      });
    });
    return () => { unsubList(); Object.values(deviceUnsubs).forEach(fn => fn()); };
  }, [currentUser]);

  // ── Subscribe to base stations ──────────────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;
    const bsData: Record<string, BaseStationData> = {};
    const unsubBS = onValue(ref(database, 'baseStations'), snap => {
      if (!snap.exists()) { baseStationsRef.current = []; onBaseStationsChange?.([]); return; }
      snap.forEach(child => {
        const stationId = child.key!;
        const hb = child.child('heartBeat').val() || {};
        bsData[stationId] = {
          stationId, lat: hb.Lat ?? hb.lat ?? 0, lng: hb.Lng ?? hb.lng ?? 0,
          lastHeartbeat: hb.timestamp ?? hb.ts ?? 0,
          signal: hb.Signal ?? hb.signal, status: hb.status ?? 'unknown',
          lteStatus: hb.lte_status, uptimeS: hb.uptime_s, fwVersion: hb.fw_version,
          flashUsedPct: hb.flash_used_pct, flashUnsent: hb.flash_unsent,
          lastRxAgoMs: hb.last_rx_ago_ms, uniqueDevices: hb.unique_devices,
          batteryPct: hb.battery_pct,
        };
      });
      const list = Object.values(bsData);
      baseStationsRef.current = list;
      onBaseStationsChange?.([...list]);
    });
    return () => unsubBS();
  }, [currentUser]);

  // ── Update device markers ───────────────────────────────────────────────────
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const currentIds = new Set(devices.map(d => d.deviceId));
    Object.keys(markersRef.current).forEach(id => {
      if (!currentIds.has(id)) { markersRef.current[id].setMap(null); delete markersRef.current[id]; }
    });
    devices.forEach(device => {
      if (device.lat === 0 && device.lng === 0) return;
      const pos = { lat: device.lat, lng: device.lng };
      if (markersRef.current[device.deviceId]) {
        markersRef.current[device.deviceId].setPosition(pos);
      } else {
        const marker = new window.google.maps.Marker({
          position: pos, map: mapInstanceRef.current, title: device.deviceId,
          icon: { url: `/tracking/markers/${device.img}`, scaledSize: new window.google.maps.Size(35, 35), anchor: new window.google.maps.Point(17, 35) },
        });
        marker.addListener('click', () => showDeviceInfoWindow(device, marker));
        markersRef.current[device.deviceId] = marker;
      }
    });
  }, [devices, mapLoaded]);

  // ── Update base station markers ─────────────────────────────────────────────
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const unsubBS = onValue(ref(database, 'baseStations'), snap => {
      Object.values(bsMarkersRef.current).forEach(m => m.setMap(null));
      Object.keys(bsMarkersRef.current).forEach(k => delete bsMarkersRef.current[k]);
      if (!snap.exists()) return;
      snap.forEach(child => {
        const stationId = child.key!;
        const hb = child.child('heartBeat').val() || {};
        const lat = hb.Lat ?? hb.lat ?? 0, lng = hb.Lng ?? hb.lng ?? 0;
        if (lat === 0 && lng === 0) return;
        const station: BaseStationData = {
          stationId, lat, lng, lastHeartbeat: hb.timestamp ?? hb.ts ?? 0,
          signal: hb.Signal ?? hb.signal, status: hb.status ?? 'unknown',
          lteStatus: hb.lte_status, uptimeS: hb.uptime_s, fwVersion: hb.fw_version,
          flashUsedPct: hb.flash_used_pct, flashUnsent: hb.flash_unsent,
          lastRxAgoMs: hb.last_rx_ago_ms, uniqueDevices: hb.unique_devices,
          batteryPct: hb.battery_pct,
        };
        const marker = new window.google.maps.Marker({
          position: { lat, lng }, map: mapInstanceRef.current, title: `Base Station: ${stationId}`,
          icon: { url: BASE_STATION_ICON, scaledSize: new window.google.maps.Size(38, 38), anchor: new window.google.maps.Point(19, 38) },
        });
        marker.addListener('click', () => showBaseStationInfoWindow(station, marker));
        bsMarkersRef.current[stationId] = marker;
      });
    });
    return () => unsubBS();
  }, [mapLoaded]);

  // ── Pan to focusDevice ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!focusDevice || !mapInstanceRef.current) return;
    const device = devicesRef.current.find(d => d.deviceId === focusDevice);
    if (!device || (device.lat === 0 && device.lng === 0)) return;
    mapInstanceRef.current.panTo({ lat: device.lat, lng: device.lng });
    mapInstanceRef.current.setZoom(12);
    const marker = markersRef.current[focusDevice];
    if (marker) showDeviceInfoWindow(device, marker);
  }, [focusDevice]);

  // ── Pan to focusStation ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!focusStation || !mapInstanceRef.current) return;
    const station = baseStationsRef.current.find(s => s.stationId === focusStation);
    if (!station || (station.lat === 0 && station.lng === 0)) return;
    mapInstanceRef.current.panTo({ lat: station.lat, lng: station.lng });
    mapInstanceRef.current.setZoom(12);
    const marker = bsMarkersRef.current[focusStation];
    if (marker) showBaseStationInfoWindow(station, marker);
  }, [focusStation]);

  // ── Window functions for info window buttons ────────────────────────────────
  useEffect(() => {
    window.showDeviceDetails = (deviceId: string) => {
      const device = devicesRef.current.find(d => d.deviceId === deviceId);
      if (device) { setSelectedDeviceData({ ...device }); setDetailsDialogOpen(true); }
    };
    window.showChangeIcon = (deviceId: string) => {
      const device = devicesRef.current.find(d => d.deviceId === deviceId);
      if (device) { setSelectedDeviceData(device); setChangeIconDialogOpen(true); }
    };
    window.showDeviceSettings = (deviceId: string) => { setSelectedDevice(deviceId); setSettingsDialogOpen(true); };
    window.downloadDeviceData = downloadDeviceData;
    return () => {
      delete (window as any).showDeviceDetails;
      delete (window as any).showChangeIcon;
      delete (window as any).showDeviceSettings;
      delete (window as any).downloadDeviceData;
    };
  }, []);

  // ── Fetch historical data when focusDevice changes ──────────────────────────
  useEffect(() => {
    if (!focusDevice) {
      setHistoricalData([]);
      setActiveDeviceId(null);
      return;
    }
    if (focusDevice === activeDeviceId) return; // same device, no refetch

    setHistLoading(true);
    setHistoricalData([]);
    setActiveDeviceId(focusDevice);

    (async () => {
      try {
        const { data, error } = await supabase
          .from(focusDevice as any)
          .select('pointid,id,timestamp,locktime,latitude,longitude,hdop,count,satellites,speed,activity,ax,ay,az,created_at')
          .order('timestamp', { ascending: true });

        if (error) {
          if (error.code !== '42P01') console.warn('Historical data fetch error:', error);
          setHistoricalData([]);
        } else {
          const valid = (data as unknown as DataPoint[] || []).filter(
            p => p.latitude && p.longitude && !isNaN(p.latitude) && !isNaN(p.longitude)
          );
          setHistoricalData(valid);
        }
      } catch {
        setHistoricalData([]);
      } finally {
        setHistLoading(false);
        setTimeRange([0, 100]);
      }
    })();
  }, [focusDevice]);

  // ── Time filter ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!historicalData.length) { setDisplayPoints([]); return; }
    if (!layers.timeFilter) { setDisplayPoints(historicalData); return; }
    const lo = Math.floor((timeRange[0] / 100) * (historicalData.length - 1));
    const hi = Math.ceil((timeRange[1] / 100) * (historicalData.length - 1));
    setDisplayPoints(historicalData.slice(lo, hi + 1));
  }, [historicalData, timeRange, layers.timeFilter]);

  // ── Clear all historical layer objects ──────────────────────────────────────
  const clearAllHistoricalLayers = useCallback(() => {
    trailRef.current?.setMap(null); trailRef.current = null;
    sessionLinesRef.current.forEach(l => l.setMap(null)); sessionLinesRef.current = [];
    hdopCirclesRef.current.forEach(c => c.setMap(null)); hdopCirclesRef.current = [];
    lockMarkersRef.current.forEach(m => m.setMap(null)); lockMarkersRef.current = [];
    gapMarkersRef.current.forEach(m => m.setMap(null)); gapMarkersRef.current = [];
    heatmapRef.current?.setMap(null); heatmapRef.current = null;
    convexRef.current?.setMap(null); convexRef.current = null;
    concaveRef.current?.setMap(null); concaveRef.current = null;
    pointMarkersRef.current.forEach(m => m.setMap(null)); pointMarkersRef.current = [];
    pointLabelsRef.current.forEach(m => m.setMap(null)); pointLabelsRef.current = [];
    histEndMarkersRef.current.forEach(m => m.setMap(null)); histEndMarkersRef.current = [];
  }, []);

  // ── Layer renderers ─────────────────────────────────────────────────────────
  const renderTrail = (pts: DataPoint[]) => {
    const map = mapInstanceRef.current;
    if (!map || pts.length < 2) return;
    trailRef.current = new window.google.maps.Polyline({
      path: pts.map(p => ({ lat: p.latitude, lng: p.longitude })),
      geodesic: true, strokeColor: '#FBBF24', strokeOpacity: 0.9, strokeWeight: 2.5, map,
    });
  };

  const renderSessions = (pts: DataPoint[]) => {
    const map = mapInstanceRef.current;
    if (!map || pts.length < 2) return;
    const ids = detectSessions(pts);
    const groups = new Map<number, DataPoint[]>();
    pts.forEach((p, i) => { const s = ids[i]; if (!groups.has(s)) groups.set(s, []); groups.get(s)!.push(p); });
    groups.forEach((grp, idx) => {
      if (grp.length < 2) return;
      sessionLinesRef.current.push(new window.google.maps.Polyline({
        path: grp.map(p => ({ lat: p.latitude, lng: p.longitude })),
        geodesic: true, strokeColor: SESSION_COLORS[idx % SESSION_COLORS.length],
        strokeOpacity: 0.9, strokeWeight: 3, map,
      }));
    });
  };

  const renderHdopCircles = (pts: DataPoint[]) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    pts.forEach(p => {
      if (p.hdop == null) return;
      hdopCirclesRef.current.push(new window.google.maps.Circle({
        center: { lat: p.latitude, lng: p.longitude }, radius: p.hdop * 30,
        strokeColor: '#60a5fa', strokeOpacity: 0.6, strokeWeight: 1,
        fillColor: '#3b82f6', fillOpacity: 0.12, map,
      }));
    });
  };

  const renderLockTimeMarkers = (pts: DataPoint[]) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    pts.forEach(p => {
      const c = getLockTimeColor(p.locktime ?? 999);
      const svg = `<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="5" fill="${c}" stroke="white" stroke-width="1.5"/></svg>`;
      lockMarkersRef.current.push(new window.google.maps.Marker({
        position: { lat: p.latitude, lng: p.longitude }, map,
        icon: { url: makeSvgUrl(svg), scaledSize: new window.google.maps.Size(12, 12), anchor: new window.google.maps.Point(6, 6) },
        title: `Lock: ${p.locktime ?? '?'}s`,
      }));
    });
  };

  const renderGapMarkers = (pts: DataPoint[]) => {
    const map = mapInstanceRef.current;
    if (!map || pts.length < 2) return;
    for (let i = 1; i < pts.length; i++) {
      const gap = pts[i].timestamp - pts[i - 1].timestamp;
      if (gap < GAP_THRESHOLD_SECS) continue;
      const hrs = Math.round(gap / 3600);
      const lat = (pts[i].latitude + pts[i - 1].latitude) / 2;
      const lng = (pts[i].longitude + pts[i - 1].longitude) / 2;
      const svg = `<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="10" fill="#f59e0b" stroke="white" stroke-width="2"/><polygon points="13,3 6,13 10.5,13 9,19 16,9 11.5,9" fill="white"/></svg>`;
      const m = new window.google.maps.Marker({
        position: { lat, lng }, map,
        icon: { url: makeSvgUrl(svg), scaledSize: new window.google.maps.Size(22, 22), anchor: new window.google.maps.Point(11, 11) },
        title: `Gap: ~${hrs}h`, zIndex: 10,
      });
      const iw = new window.google.maps.InfoWindow({
        content: `<div style="font-size:12px;font-family:system-ui"><b>⚡ Data gap</b><br/>~${hrs} hours between fixes</div>`,
      });
      m.addListener('click', () => iw.open(map, m));
      gapMarkersRef.current.push(m);
    }
  };

  const renderHeatmap = (pts: DataPoint[]) => {
    const map = mapInstanceRef.current;
    if (!map || !window.google?.maps?.visualization) return;
    heatmapRef.current = new window.google.maps.visualization.HeatmapLayer({
      data: pts.map(p => new window.google.maps.LatLng(p.latitude, p.longitude)),
      map, radius: 30, opacity: 0.7,
    });
  };

  const renderConvexHull = (pts: DataPoint[]) => {
    const map = mapInstanceRef.current;
    if (!map || pts.length < 3) return;
    convexRef.current = new window.google.maps.Polygon({
      paths: computeConvexHull(pts.map(p => ({ lat: p.latitude, lng: p.longitude }))),
      strokeColor: '#00d4ff', strokeOpacity: 0.8, strokeWeight: 2,
      fillColor: '#00d4ff', fillOpacity: 0.07, map,
    });
  };

  const renderConcaveHull = (pts: DataPoint[]) => {
    const map = mapInstanceRef.current;
    if (!map || pts.length < 4) return;
    concaveRef.current = new window.google.maps.Polygon({
      paths: computeConcaveHull(pts.map(p => ({ lat: p.latitude, lng: p.longitude }))),
      strokeColor: '#a855f7', strokeOpacity: 0.8, strokeWeight: 2,
      fillColor: '#a855f7', fillOpacity: 0.1, map,
    });
  };

  const renderPointMarkers = (pts: DataPoint[]) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const svg = `<svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg"><circle cx="4" cy="4" r="3.5" fill="#94a3b8" stroke="white" stroke-width="1"/></svg>`;
    pts.forEach(p => {
      const m = new window.google.maps.Marker({
        position: { lat: p.latitude, lng: p.longitude }, map,
        icon: { url: makeSvgUrl(svg), scaledSize: new window.google.maps.Size(8, 8), anchor: new window.google.maps.Point(4, 4) },
        title: `Point ${p.pointid}`, zIndex: 1,
      });
      const iw = new window.google.maps.InfoWindow({
        content: `<div style="font-size:12px;font-family:system-ui"><b>Point ${p.pointid}</b><br/><span style="color:#6b7280">${new Date(p.timestamp * 1000).toLocaleString()}</span><br/>Lat: ${p.latitude.toFixed(6)}, Lng: ${p.longitude.toFixed(6)}<br/>HDOP: ${p.hdop ?? 'N/A'} · Lock: ${p.locktime ?? '?'}s</div>`,
      });
      m.addListener('click', () => iw.open(map, m));
      pointMarkersRef.current.push(m);
    });
  };

  const renderPointLabels = (pts: DataPoint[]) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    pts.forEach(p => {
      pointLabelsRef.current.push(new window.google.maps.Marker({
        position: { lat: p.latitude, lng: p.longitude }, map,
        label: { text: String(p.pointid), color: '#f1f5f9', fontSize: '10px', fontWeight: '600', fontFamily: 'monospace' },
        icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 0 },
        title: `Point ${p.pointid}`, zIndex: 20,
      }));
    });
  };

  const renderEndpoints = (pts: DataPoint[]) => {
    const map = mapInstanceRef.current;
    if (!map || pts.length === 0) return;
    const startSvg = `<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="10" fill="#22c55e" stroke="white" stroke-width="2.5"/><circle cx="11" cy="11" r="4" fill="white"/></svg>`;
    histEndMarkersRef.current.push(new window.google.maps.Marker({
      position: { lat: pts[0].latitude, lng: pts[0].longitude }, map,
      icon: { url: makeSvgUrl(startSvg), scaledSize: new window.google.maps.Size(22, 22), anchor: new window.google.maps.Point(11, 11) },
      title: `Start: ${new Date(pts[0].timestamp * 1000).toLocaleString()}`, zIndex: 100,
    }));
    if (pts.length > 1) {
      const last = pts[pts.length - 1];
      const endSvg = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#EF4444" stroke="white" stroke-width="3"/><circle cx="12" cy="12" r="4" fill="white"/></svg>`;
      histEndMarkersRef.current.push(new window.google.maps.Marker({
        position: { lat: last.latitude, lng: last.longitude }, map,
        icon: { url: makeSvgUrl(endSvg), scaledSize: new window.google.maps.Size(24, 24), anchor: new window.google.maps.Point(12, 12) },
        title: `Latest: ${new Date(last.timestamp * 1000).toLocaleString()}`, zIndex: 100,
      }));
    }
  };

  // ── Main layer render effect ────────────────────────────────────────────────
  useEffect(() => {
    clearAllHistoricalLayers();
    if (!mapLoaded || displayPoints.length === 0) return;
    if (layers.trail) renderTrail(displayPoints);
    if (layers.sessions) renderSessions(displayPoints);
    if (layers.hdopCircles) renderHdopCircles(displayPoints);
    if (layers.lockTimeColor) renderLockTimeMarkers(displayPoints);
    if (layers.gapMarkers) renderGapMarkers(displayPoints);
    if (layers.heatmap) renderHeatmap(displayPoints);
    if (layers.convexHull) renderConvexHull(displayPoints);
    if (layers.concaveHull) renderConcaveHull(displayPoints);
    if (layers.pointMarkers) renderPointMarkers(displayPoints);
    if (layers.pointLabels) renderPointLabels(displayPoints);
    renderEndpoints(displayPoints);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayPoints, layers, mapLoaded]);

  // ── Info windows ────────────────────────────────────────────────────────────
  const showDeviceInfoWindow = (device: DeviceData, marker: any) => {
    const t = getInfoWindowTheme();
    const id = escapeHtml(device.deviceId);
    const bat = escapeHtml(String(device.battery));
    const sig = escapeHtml(String(device.signal));
    const lastContactStr = device.lastContact ? new Date(device.lastContact * 1000).toLocaleString() : 'Unknown';
    const batColor = device.battery > 20 ? '#22c55e' : '#ef4444';
    const content = `
      <div style="font-family:system-ui,sans-serif;min-width:260px;padding:8px;background:${t.bg};color:${t.text};border-radius:6px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid ${t.border};">
          <h3 style="margin:0;color:${t.accent};font-weight:600;font-size:14px;font-family:monospace;">${id}</h3>
          <div style="display:flex;gap:6px;">
            <div style="text-align:center;padding:3px 6px;background:${t.badge};border-radius:4px;border:1px solid ${t.border};">
              <div style="font-size:10px;color:${t.muted};">BAT</div>
              <div style="font-size:12px;font-weight:600;color:${batColor};">${bat}%</div>
            </div>
            <div style="text-align:center;padding:3px 6px;background:${t.badge};border-radius:4px;border:1px solid ${t.border};">
              <div style="font-size:10px;color:${t.muted};">SIG</div>
              <div style="font-size:12px;font-weight:600;color:${t.text};">${sig}</div>
            </div>
          </div>
        </div>
        <div style="font-size:11px;color:${t.muted};margin-bottom:10px;">Last contact: ${escapeHtml(lastContactStr)}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <button onclick="window.showDeviceDetails('${id}')" style="background:${t.accent};color:${t.accentFg};border:none;padding:7px;border-radius:4px;font-size:11px;font-weight:600;cursor:pointer;">Details</button>
          <button onclick="window.downloadDeviceData('${id}')" style="background:${t.btnAlt};color:${t.btnAltText};border:1px solid ${t.btnAltBorder};padding:7px;border-radius:4px;font-size:11px;cursor:pointer;">Download</button>
          <button onclick="window.showChangeIcon('${id}')" style="background:${t.btnAlt};color:${t.btnAltText};border:1px solid ${t.btnAltBorder};padding:7px;border-radius:4px;font-size:11px;cursor:pointer;">Change Icon</button>
          <button onclick="window.showDeviceSettings('${id}')" style="background:${t.btnAlt};color:${t.btnAltText};border:1px solid ${t.btnAltBorder};padding:7px;border-radius:4px;font-size:11px;cursor:pointer;">Settings</button>
        </div>
      </div>`;
    infoWindowRef.current.setContent(content);
    infoWindowRef.current.open(mapInstanceRef.current, marker);
    setSelectedDevice(device.deviceId);
    onDeviceSelect?.(device.deviceId);
  };

  const showBaseStationInfoWindow = (station: BaseStationData, marker: any) => {
    const t = getInfoWindowTheme();
    const id = escapeHtml(station.stationId);

    // Format uptime: seconds → "Xh Ym" or "Xm Ys"
    const formatUptime = (s?: number) => {
      if (s == null) return 'N/A';
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      if (h > 0) return `${h}h ${m}m`;
      const sec = s % 60;
      return `${m}m ${sec}s`;
    };

    // Format last RX ago
    const formatRxAgo = (ms?: number) => {
      if (ms == null) return 'N/A';
      if (ms === 0) return 'just now';
      const s = Math.floor(ms / 1000);
      if (s < 60) return `${s}s ago`;
      const m = Math.floor(s / 60);
      if (m < 60) return `${m}m ago`;
      return `${Math.floor(m / 60)}h ago`;
    };

    const lteConnected = station.lteStatus === 'true' || station.lteStatus === true as any;
    const lteColor  = lteConnected ? '#22c55e' : '#ef4444';
    const lteLabel  = lteConnected ? 'Connected' : 'Disconnected';
    const parseHeartbeat = (val: string | number): string => {
      if (!val) return 'Never';
      const n = Number(val);
      if (!isNaN(n) && n > 0) {
        // Unix seconds (< 1e10) or Unix milliseconds (>= 1e10)
        const ms = n < 1e10 ? n * 1000 : n;
        return new Date(ms).toLocaleString();
      }
      // Formatted date string
      const d = new Date(val as string);
      return isNaN(d.getTime()) ? String(val) : d.toLocaleString();
    };
    const lastHbStr = parseHeartbeat(station.lastHeartbeat);

    // ── Tile helpers ──────────────────────────────────────────────────────────
    const tile = (label: string, value: string, valueColor?: string) =>
      `<div style="background:${t.bg};border-radius:6px;padding:9px 11px;border:1px solid ${t.border};">
        <div style="font-size:10px;font-weight:600;letter-spacing:0.06em;color:${t.muted};text-transform:uppercase;margin-bottom:5px;">${label}</div>
        <div style="font-size:13px;font-family:monospace;font-weight:600;color:${valueColor ?? t.text};">${value}</div>
      </div>`;

    const lteTile = () =>
      `<div style="background:${t.bg};border-radius:6px;padding:9px 11px;border:1px solid ${t.border};">
        <div style="font-size:10px;font-weight:600;letter-spacing:0.06em;color:${t.muted};text-transform:uppercase;margin-bottom:5px;">LTE Status</div>
        <div style="display:flex;align-items:center;gap:6px;font-size:13px;font-family:monospace;font-weight:600;color:${lteColor};">
          <span style="width:8px;height:8px;border-radius:50%;background:${lteColor};flex-shrink:0;"></span>
          ${lteLabel}
        </div>
      </div>`;

    const section = (title: string, cols: string, tiles: string) =>
      `<div style="margin-top:10px;">
        <div style="font-size:11px;font-weight:600;letter-spacing:0.08em;color:${t.muted};text-transform:uppercase;margin-bottom:5px;">${title}</div>
        <div style="background:${t.badge};border-radius:8px;padding:6px;display:grid;grid-template-columns:${cols};gap:5px;">
          ${tiles}
        </div>
      </div>`;

    const content = `
      <div style="font-family:system-ui,sans-serif;min-width:290px;padding:12px;background:${t.bg};color:${t.text};border-radius:8px;">

        <!-- Header -->
        <div style="display:flex;align-items:center;gap:8px;">
          <img src="${BASE_STATION_ICON}" style="width:22px;height:22px;object-fit:contain;" />
          <h3 style="margin:0;color:#7c3aed;font-weight:700;font-size:16px;font-family:monospace;">${id}</h3>
          <div style="margin-left:auto;display:flex;align-items:center;gap:5px;">
            <span style="font-size:11px;background:#7c3aed22;color:#7c3aed;padding:2px 9px;border-radius:10px;border:1px solid #7c3aed44;">Base Station</span>
            ${station.fwVersion != null ? `<span style="font-size:11px;background:#7c3aed22;color:#7c3aed;padding:2px 9px;border-radius:10px;border:1px solid #7c3aed44;">v${station.fwVersion}</span>` : ''}
          </div>
        </div>

        <!-- Connectivity: 2×2 grid -->
        ${section('Connectivity', '1fr 1fr',
          lteTile() +
          tile('Battery', station.batteryPct != null ? `${station.batteryPct}%` : 'N/A') +
          tile('Uptime', formatUptime(station.uptimeS)) +
          tile('Last heartbeat', lastHbStr)
        )}

        <!-- Devices: 1×2 row -->
        ${section('Devices', '1fr 1fr',
          tile('Unique seen', station.uniqueDevices != null ? String(station.uniqueDevices) : 'N/A') +
          tile('Last signal', formatRxAgo(station.lastRxAgoMs))
        )}

        <!-- Storage: 1×2 row -->
        ${section('Storage', '1fr 1fr',
          tile('Flash used', station.flashUsedPct != null ? `${station.flashUsedPct}%` : 'N/A') +
          tile('Unsent records', station.flashUnsent != null ? String(station.flashUnsent) : 'N/A')
        )}
      </div>`;

    infoWindowRef.current.setContent(content);
    infoWindowRef.current.open(mapInstanceRef.current, marker);
  };

  const handleIconChange = (deviceId: string, newIcon: string) => {
    setDevices(prev => prev.map(d => d.deviceId === deviceId ? { ...d, img: newIcon } : d));
    const marker = markersRef.current[deviceId];
    if (marker) marker.setIcon({ url: `/tracking/markers/${newIcon}`, scaledSize: new window.google.maps.Size(35, 35), anchor: new window.google.maps.Point(17, 35) });
  };

  // ── Layer config ────────────────────────────────────────────────────────────
  const layerConfig: { key: keyof LayerState; icon: React.ReactNode; label: string; color: string }[] = [
    { key: 'trail',         icon: <Route className="h-4 w-4" />,             label: 'Trail',    color: '#FBBF24' },
    { key: 'sessions',      icon: <Layers className="h-4 w-4" />,            label: 'Sessions', color: '#3b82f6' },
    { key: 'hdopCircles',   icon: <Target className="h-4 w-4" />,            label: 'HDOP',     color: '#60a5fa' },
    { key: 'lockTimeColor', icon: <Clock className="h-4 w-4" />,             label: 'Lock',     color: '#22c55e' },
    { key: 'gapMarkers',    icon: <Zap className="h-4 w-4" />,               label: 'Gaps',     color: '#f59e0b' },
    { key: 'timeFilter',    icon: <SlidersHorizontal className="h-4 w-4" />, label: 'Filter',   color: '#a855f7' },
    { key: 'heatmap',       icon: <Flame className="h-4 w-4" />,             label: 'Heat',     color: '#ef4444' },
    { key: 'convexHull',    icon: <Hexagon className="h-4 w-4" />,           label: 'Convex',   color: '#00d4ff' },
    { key: 'concaveHull',   icon: <Star className="h-4 w-4" />,              label: 'Concave',  color: '#a855f7' },
    { key: 'pointMarkers',  icon: <MapPin className="h-4 w-4" />,            label: 'Points',   color: '#94a3b8' },
    { key: 'pointLabels',   icon: <Tag className="h-4 w-4" />,               label: 'Labels',   color: '#e2e8f0' },
  ];

  const toggleLayer = (key: keyof LayerState) => setLayers(prev => ({ ...prev, [key]: !prev[key] }));

  // Time filter display values
  const loIdx = historicalData.length > 0 ? Math.floor((timeRange[0] / 100) * (historicalData.length - 1)) : 0;
  const hiIdx = historicalData.length > 0 ? Math.ceil((timeRange[1] / 100) * (historicalData.length - 1)) : 0;
  const loTs = historicalData[loIdx]?.timestamp ?? 0;
  const hiTs = historicalData[hiIdx]?.timestamp ?? 0;

  // ── Render ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-background">
        <div className="text-center">
          <MapPin className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!loading && devices.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-background">
        <div className="text-center max-w-sm px-6">
          <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-sm font-semibold text-foreground mb-1">No Devices Found</p>
          <p className="text-xs text-muted-foreground mb-5">Add devices to a project to start tracking.</p>
          <Button onClick={() => navigate('/projects-users-devices')}>
            <ArrowRight className="h-3.5 w-3.5 mr-1.5" />Go to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full h-full overflow-hidden">
        <div ref={mapRef} className="w-full h-full" />

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-20">
            <div className="text-center">
              <Loader2 className="h-7 w-7 animate-spin text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Loading devices...</p>
            </div>
          </div>
        )}

        {/* Historical data loading indicator */}
        {histLoading && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg border border-border"
            style={{ background: 'var(--panel-bg)', backdropFilter: 'blur(14px)' }}>
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading historical data…</span>
          </div>
        )}

        {/* Time filter panel */}
        {layers.timeFilter && historicalData.length > 0 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 w-96 rounded-2xl shadow-2xl border border-border px-5 py-3"
            style={{ background: 'var(--panel-bg)', backdropFilter: 'blur(14px)' }}>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-foreground">Time Filter</span>
              <span className="text-[10px] font-mono text-muted-foreground">
                {displayPoints.length} / {historicalData.length} pts
              </span>
            </div>
            <Slider value={timeRange} onValueChange={setTimeRange} min={0} max={100} step={1} className="w-full" />
            <div className="flex justify-between mt-2 text-[10px] font-mono text-muted-foreground">
              <span>{loTs ? new Date(loTs * 1000).toLocaleDateString() : '—'}</span>
              <span>{hiTs ? new Date(hiTs * 1000).toLocaleDateString() : '—'}</span>
            </div>
          </div>
        )}

        {/* Bottom-centre layer control panel */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-end gap-0.5 px-2.5 py-2 rounded-2xl shadow-2xl border border-border"
            style={{ background: 'var(--panel-bg)', backdropFilter: 'blur(14px)' }}>
            {layerConfig.map(({ key, icon, label, color }) => {
              const active = layers[key];
              const hasData = historicalData.length > 0;
              return (
                <button
                  key={key}
                  onClick={() => toggleLayer(key)}
                  title={hasData ? label : `${label} — select a device first`}
                  disabled={!hasData}
                  className={[
                    'relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed',
                    active && hasData
                      ? 'bg-black/8 dark:bg-white/8'
                      : 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5',
                  ].join(' ')}
                  style={active && hasData ? { color } : {}}
                >
                  {icon}
                  <span className="text-[9px] font-medium leading-none tracking-wide">{label}</span>
                  {active && hasData && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: color }} />
                  )}
                </button>
              );
            })}

            <div className="flex items-center self-stretch mx-1">
              <div className="w-px h-full bg-border" />
            </div>

            {/* Status badge */}
            <div className="flex flex-col items-center justify-center px-2 py-1 gap-0.5 min-w-[36px]">
              {activeDeviceId ? (
                <>
                  <span className="text-[10px] font-semibold font-mono text-primary leading-none">
                    {historicalData.length}
                  </span>
                  <span className="text-[9px] text-muted-foreground leading-none">pts</span>
                </>
              ) : (
                <span className="text-[9px] text-muted-foreground leading-none text-center">select<br/>device</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <DeviceDetailsDialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen} device={selectedDeviceData} />
      <ChangeIconDialog
        open={changeIconDialogOpen} onOpenChange={setChangeIconDialogOpen}
        deviceId={selectedDeviceData?.deviceId || null} currentIcon={selectedDeviceData?.img || ''}
        onIconChange={newIcon => handleIconChange(selectedDeviceData?.deviceId || '', newIcon)}
      />
      <DeviceSettingsDialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen} deviceId={selectedDevice} />
    </>
  );
};

// ── CSV download ───────────────────────────────────────────────────────────────
async function downloadDeviceData(deviceId: string): Promise<void> {
  try {
    const { data, error } = await supabase
      .from(deviceId as any).select('*').order('timestamp', { ascending: true });
    if (error) {
      if (error.code === '42P01') alert(`No data table found for device ${deviceId}`);
      else throw error;
      return;
    }
    if (!data || data.length === 0) { alert(`No data available for device ${deviceId}`); return; }
    const headers = Object.keys(data[0]);
    const rows = [
      headers.join(','),
      ...data.map(row => headers.map(h => {
        const v = String(row[h] ?? '');
        return v.includes(',') || v.includes('"') || v.includes('\n') ? `"${v.replace(/"/g, '""')}"` : v;
      }).join(',')),
    ];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${deviceId}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Download error:', err);
    alert('Failed to download data. Please try again.');
  }
}

export default MapComponent;
