import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Route, Layers, Target, Clock, Zap, SlidersHorizontal,
  Flame, Hexagon, Star, MapPin, Tag, RefreshCw, Upload, Database,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import CSVUploadDialog from '@/components/CSVUploadDialog';
import { DataPoint, DeviceInfo } from '@/types/database-analytics';

// ── Types ─────────────────────────────────────────────────────────────────────
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

interface MapViewProps {
  device: DeviceInfo;
  data: DataPoint[];
  filteredData?: DataPoint[];
  loading: boolean;
  tableExists: boolean;
  onRefresh: () => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const SESSION_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ec4899',
  '#8b5cf6', '#06b6d4', '#ef4444', '#84cc16',
  '#f97316', '#a855f7',
];

const GAP_THRESHOLD_SECS = 2 * 3600; // 2 hours

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

// ── Helpers ───────────────────────────────────────────────────────────────────
function getLockTimeColor(locktime: number): string {
  if (locktime < 20) return '#22c55e';
  if (locktime < 60) return '#f59e0b';
  return '#ef4444';
}

function detectSessions(pts: DataPoint[]): number[] {
  const out: number[] = [];
  let idx = 0;
  let prev = -Infinity;
  for (const p of pts) {
    if (p.count < prev) idx++;
    out.push(idx);
    prev = p.count;
  }
  return out;
}

type Pt = { lat: number; lng: number };

function cross(O: Pt, A: Pt, B: Pt): number {
  return (A.lng - O.lng) * (B.lat - O.lat) - (A.lat - O.lat) * (B.lng - O.lng);
}

function computeConvexHull(pts: Pt[]): Pt[] {
  if (pts.length < 3) return pts;
  const s = [...pts].sort((a, b) => a.lng !== b.lng ? a.lng - b.lng : a.lat - b.lat);
  const lower: Pt[] = [];
  for (const p of s) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0)
      lower.pop();
    lower.push(p);
  }
  const upper: Pt[] = [];
  for (let i = s.length - 1; i >= 0; i--) {
    const p = s[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0)
      upper.pop();
    upper.push(p);
  }
  upper.pop();
  lower.pop();
  return [...lower, ...upper];
}

/** Angular-sector concave hull approximation */
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

function makeSvgUrl(svg: string): string {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

// ── Component ─────────────────────────────────────────────────────────────────
const MapView: React.FC<MapViewProps> = ({
  device, data, filteredData, loading, tableExists, onRefresh,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  // Layer object refs
  const trailRef = useRef<google.maps.Polyline | null>(null);
  const sessionLinesRef = useRef<google.maps.Polyline[]>([]);
  const hdopCirclesRef = useRef<google.maps.Circle[]>([]);
  const lockMarkersRef = useRef<google.maps.Marker[]>([]);
  const gapMarkersRef = useRef<google.maps.Marker[]>([]);
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);
  const convexRef = useRef<google.maps.Polygon | null>(null);
  const concaveRef = useRef<google.maps.Polygon | null>(null);
  const pointMarkersRef = useRef<google.maps.Marker[]>([]);
  const pointLabelsRef = useRef<google.maps.Marker[]>([]);
  const endMarkersRef = useRef<google.maps.Marker[]>([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [layers, setLayers] = useState<LayerState>(DEFAULT_LAYERS);
  const [sortedPoints, setSortedPoints] = useState<DataPoint[]>([]);
  const [displayPoints, setDisplayPoints] = useState<DataPoint[]>([]);
  const [timeRange, setTimeRange] = useState<number[]>([0, 100]);

  const { toast } = useToast();

  // ── Google Maps loader ────────────────────────────────────────────────────
  const loadGoogleMaps = (): Promise<void> =>
    new Promise((resolve, reject) => {
      if (window.google?.maps) { resolve(); return; }
      const existing = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      ) as HTMLScriptElement | null;
      if (existing) {
        existing.getAttribute('data-loaded') === 'true'
          ? resolve()
          : existing.addEventListener('load', () => resolve());
        return;
      }
      const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=geometry,visualization`;
      script.async = true;
      script.defer = true;
      script.setAttribute('data-loaded', 'true');
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });

  const initMap = async () => {
    try {
      await loadGoogleMaps();
      if (!mapRef.current) return;
      const first = data.find(
        p => p.latitude && p.longitude && !isNaN(p.latitude) && !isNaN(p.longitude)
      );
      const center = first
        ? { lat: first.latitude, lng: first.longitude }
        : { lat: 20.5937, lng: 78.9629 };
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        zoom: 13,
        center,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: false,
        zoomControl: true,
      });
      setIsLoaded(true);
    } catch {
      toast({ title: 'Map Error', description: 'Failed to load Google Maps', variant: 'destructive' });
    }
  };

  // ── Clear helpers ─────────────────────────────────────────────────────────
  const clearMarkerArr = (ref: React.MutableRefObject<google.maps.Marker[]>) => {
    ref.current.forEach(m => m.setMap(null));
    ref.current = [];
  };
  const clearPolylineArr = (ref: React.MutableRefObject<google.maps.Polyline[]>) => {
    ref.current.forEach(l => l.setMap(null));
    ref.current = [];
  };
  const clearCircleArr = (ref: React.MutableRefObject<google.maps.Circle[]>) => {
    ref.current.forEach(c => c.setMap(null));
    ref.current = [];
  };

  const clearAllLayers = useCallback(() => {
    trailRef.current?.setMap(null); trailRef.current = null;
    clearPolylineArr(sessionLinesRef);
    clearCircleArr(hdopCirclesRef);
    clearMarkerArr(lockMarkersRef);
    clearMarkerArr(gapMarkersRef);
    heatmapRef.current?.setMap(null); heatmapRef.current = null;
    convexRef.current?.setMap(null); convexRef.current = null;
    concaveRef.current?.setMap(null); concaveRef.current = null;
    clearMarkerArr(pointMarkersRef);
    clearMarkerArr(pointLabelsRef);
    clearMarkerArr(endMarkersRef);
  }, []);

  // ── Layer renderers ───────────────────────────────────────────────────────
  const renderTrail = (pts: DataPoint[]) => {
    const map = mapInstanceRef.current;
    if (!map || pts.length < 2) return;
    trailRef.current = new google.maps.Polyline({
      path: pts.map(p => ({ lat: p.latitude, lng: p.longitude })),
      geodesic: true,
      strokeColor: '#FBBF24',
      strokeOpacity: 0.9,
      strokeWeight: 2.5,
      map,
    });
  };

  const renderSessions = (pts: DataPoint[]) => {
    const map = mapInstanceRef.current;
    if (!map || pts.length < 2) return;
    const ids = detectSessions(pts);
    const groups = new Map<number, DataPoint[]>();
    pts.forEach((p, i) => {
      const s = ids[i];
      if (!groups.has(s)) groups.set(s, []);
      groups.get(s)!.push(p);
    });
    groups.forEach((grp, idx) => {
      if (grp.length < 2) return;
      sessionLinesRef.current.push(
        new google.maps.Polyline({
          path: grp.map(p => ({ lat: p.latitude, lng: p.longitude })),
          geodesic: true,
          strokeColor: SESSION_COLORS[idx % SESSION_COLORS.length],
          strokeOpacity: 0.9,
          strokeWeight: 3,
          map,
        })
      );
    });
  };

  const renderHdopCircles = (pts: DataPoint[]) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    pts.forEach(p => {
      if (p.hdop == null) return;
      hdopCirclesRef.current.push(
        new google.maps.Circle({
          center: { lat: p.latitude, lng: p.longitude },
          radius: p.hdop * 30,
          strokeColor: '#60a5fa',
          strokeOpacity: 0.6,
          strokeWeight: 1,
          fillColor: '#3b82f6',
          fillOpacity: 0.12,
          map,
        })
      );
    });
  };

  const renderLockTimeMarkers = (pts: DataPoint[]) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    pts.forEach(p => {
      const c = getLockTimeColor(p.locktime ?? 999);
      const svg = `<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="5" fill="${c}" stroke="white" stroke-width="1.5"/></svg>`;
      lockMarkersRef.current.push(
        new google.maps.Marker({
          position: { lat: p.latitude, lng: p.longitude },
          map,
          icon: {
            url: makeSvgUrl(svg),
            scaledSize: new google.maps.Size(12, 12),
            anchor: new google.maps.Point(6, 6),
          },
          title: `Lock: ${p.locktime ?? '?'}s`,
        })
      );
    });
  };

  const renderGapMarkers = (pts: DataPoint[]) => {
    const map = mapInstanceRef.current;
    if (!map || pts.length < 2) return;
    for (let i = 1; i < pts.length; i++) {
      const gap = pts[i].timestamp - pts[i - 1].timestamp; // seconds
      if (gap < GAP_THRESHOLD_SECS) continue;
      const hrs = Math.round(gap / 3600);
      const lat = (pts[i].latitude + pts[i - 1].latitude) / 2;
      const lng = (pts[i].longitude + pts[i - 1].longitude) / 2;
      // Lightning bolt SVG
      const svg = `<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="10" fill="#f59e0b" stroke="white" stroke-width="2"/><polygon points="13,3 6,13 10.5,13 9,19 16,9 11.5,9" fill="white"/></svg>`;
      const m = new google.maps.Marker({
        position: { lat, lng },
        map,
        icon: {
          url: makeSvgUrl(svg),
          scaledSize: new google.maps.Size(22, 22),
          anchor: new google.maps.Point(11, 11),
        },
        title: `Gap: ~${hrs}h`,
        zIndex: 10,
      });
      const iw = new google.maps.InfoWindow({
        content: `<div style="font-size:12px;font-family:system-ui"><b>⚡ Data gap</b><br/>~${hrs} hours between fixes</div>`,
      });
      m.addListener('click', () => iw.open(map, m));
      gapMarkersRef.current.push(m);
    }
  };

  const renderHeatmap = (pts: DataPoint[]) => {
    const map = mapInstanceRef.current;
    if (!map || !window.google?.maps?.visualization) return;
    heatmapRef.current = new google.maps.visualization.HeatmapLayer({
      data: pts.map(p => new google.maps.LatLng(p.latitude, p.longitude)),
      map,
      radius: 30,
      opacity: 0.7,
    });
  };

  const renderConvexHull = (pts: DataPoint[]) => {
    const map = mapInstanceRef.current;
    if (!map || pts.length < 3) return;
    const hull = computeConvexHull(pts.map(p => ({ lat: p.latitude, lng: p.longitude })));
    convexRef.current = new google.maps.Polygon({
      paths: hull,
      strokeColor: '#00d4ff',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#00d4ff',
      fillOpacity: 0.07,
      map,
    });
  };

  const renderConcaveHull = (pts: DataPoint[]) => {
    const map = mapInstanceRef.current;
    if (!map || pts.length < 4) return;
    const hull = computeConcaveHull(pts.map(p => ({ lat: p.latitude, lng: p.longitude })));
    concaveRef.current = new google.maps.Polygon({
      paths: hull,
      strokeColor: '#a855f7',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#a855f7',
      fillOpacity: 0.1,
      map,
    });
  };

  const renderPointMarkers = (pts: DataPoint[]) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const svg = `<svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg"><circle cx="4" cy="4" r="3.5" fill="#94a3b8" stroke="white" stroke-width="1"/></svg>`;
    pts.forEach(p => {
      const m = new google.maps.Marker({
        position: { lat: p.latitude, lng: p.longitude },
        map,
        icon: {
          url: makeSvgUrl(svg),
          scaledSize: new google.maps.Size(8, 8),
          anchor: new google.maps.Point(4, 4),
        },
        title: `Point ${p.pointid}`,
        zIndex: 1,
      });
      const iw = new google.maps.InfoWindow({
        content: `<div style="font-size:12px;font-family:system-ui">
          <b>Point ${p.pointid}</b><br/>
          <span style="color:#6b7280">${new Date(p.timestamp * 1000).toLocaleString()}</span><br/>
          Lat: ${p.latitude.toFixed(6)}, Lng: ${p.longitude.toFixed(6)}<br/>
          HDOP: ${p.hdop ?? 'N/A'} · Lock: ${p.locktime ?? '?'}s
        </div>`,
      });
      m.addListener('click', () => iw.open(map, m));
      pointMarkersRef.current.push(m);
    });
  };

  const renderPointLabels = (pts: DataPoint[]) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    pts.forEach(p => {
      pointLabelsRef.current.push(
        new google.maps.Marker({
          position: { lat: p.latitude, lng: p.longitude },
          map,
          label: {
            text: String(p.pointid),
            color: '#f1f5f9',
            fontSize: '10px',
            fontWeight: '600',
            fontFamily: 'monospace',
          },
          icon: { path: google.maps.SymbolPath.CIRCLE, scale: 0 },
          title: `Point ${p.pointid}`,
          zIndex: 20,
        })
      );
    });
  };

  const renderEndpoints = (pts: DataPoint[]) => {
    const map = mapInstanceRef.current;
    if (!map || pts.length === 0) return;

    // Start — green circle
    const startSvg = `<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="10" fill="#22c55e" stroke="white" stroke-width="2.5"/><circle cx="11" cy="11" r="4" fill="white"/></svg>`;
    const sm = new google.maps.Marker({
      position: { lat: pts[0].latitude, lng: pts[0].longitude },
      map,
      icon: {
        url: makeSvgUrl(startSvg),
        scaledSize: new google.maps.Size(22, 22),
        anchor: new google.maps.Point(11, 11),
      },
      title: `Start: ${new Date(pts[0].timestamp * 1000).toLocaleString()}`,
      zIndex: 100,
    });
    endMarkersRef.current.push(sm);

    if (pts.length > 1) {
      const last = pts[pts.length - 1];
      // End — same red-circle style as the existing animated marker
      const endSvg = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#EF4444" stroke="white" stroke-width="3"/><circle cx="12" cy="12" r="4" fill="white"/></svg>`;
      const em = new google.maps.Marker({
        position: { lat: last.latitude, lng: last.longitude },
        map,
        icon: {
          url: makeSvgUrl(endSvg),
          scaledSize: new google.maps.Size(24, 24),
          anchor: new google.maps.Point(12, 12),
        },
        title: `Latest fix: ${new Date(last.timestamp * 1000).toLocaleString()}`,
        zIndex: 100,
      });
      endMarkersRef.current.push(em);
    }
  };

  // ── Main render effect ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded || displayPoints.length === 0) { clearAllLayers(); return; }
    clearAllLayers();
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
  }, [displayPoints, layers, isLoaded]);

  // ── Data preparation ──────────────────────────────────────────────────────
  useEffect(() => {
    const source = filteredData && filteredData.length > 0 ? filteredData : data;
    const valid = source.filter(
      p => p.latitude && p.longitude && !isNaN(p.latitude) && !isNaN(p.longitude)
    );
    const sorted = [...valid].sort((a, b) => a.timestamp - b.timestamp);
    setSortedPoints(sorted);
    setTimeRange([0, 100]);

    if (isLoaded && mapInstanceRef.current && sorted.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      sorted.forEach(p => bounds.extend({ lat: p.latitude, lng: p.longitude }));
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [data, filteredData, isLoaded]);

  // ── Time filter ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!sortedPoints.length) { setDisplayPoints([]); return; }
    if (!layers.timeFilter) { setDisplayPoints(sortedPoints); return; }
    const lo = Math.floor((timeRange[0] / 100) * (sortedPoints.length - 1));
    const hi = Math.ceil((timeRange[1] / 100) * (sortedPoints.length - 1));
    setDisplayPoints(sortedPoints.slice(lo, hi + 1));
  }, [sortedPoints, timeRange, layers.timeFilter]);

  // ── Map init & cleanup ────────────────────────────────────────────────────
  useEffect(() => {
    initMap();
    return () => clearAllLayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Toggle ────────────────────────────────────────────────────────────────
  const toggleLayer = (key: keyof LayerState) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ── Time range display values ─────────────────────────────────────────────
  const loIdx = sortedPoints.length > 0
    ? Math.floor((timeRange[0] / 100) * (sortedPoints.length - 1)) : 0;
  const hiIdx = sortedPoints.length > 0
    ? Math.ceil((timeRange[1] / 100) * (sortedPoints.length - 1)) : 0;
  const loTs = sortedPoints[loIdx]?.timestamp ?? 0;
  const hiTs = sortedPoints[hiIdx]?.timestamp ?? 0;

  // ── Layer control config ──────────────────────────────────────────────────
  const layerConfig: {
    key: keyof LayerState;
    icon: React.ReactNode;
    label: string;
    color: string;
  }[] = [
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

  // ── Empty state ───────────────────────────────────────────────────────────
  if (!tableExists && !loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <Database className="h-14 w-14 mx-auto mb-4 text-muted-foreground/20" />
          <h3 className="text-base font-medium text-foreground mb-1">No Data Available</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This device doesn't have any location data yet
          </p>
          <Button onClick={() => setShowUpload(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload CSV Data
          </Button>
        </div>
        <CSVUploadDialog
          open={showUpload}
          onOpenChange={setShowUpload}
          deviceId={device.id}
          onUploadComplete={onRefresh}
        />
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="relative w-full h-full">

        {/* Map canvas */}
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-muted/10">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground text-sm">Loading map data…</span>
          </div>
        ) : (
          <div ref={mapRef} className="w-full h-full" />
        )}

        {/* ── Time filter panel (floating, above layer bar) ── */}
        {layers.timeFilter && sortedPoints.length > 0 && (
          <div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 w-96 rounded-2xl shadow-2xl border border-border px-5 py-3"
            style={{ background: 'var(--panel-bg)', backdropFilter: 'blur(14px)' }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-foreground">Time Filter</span>
              <span className="text-[10px] font-mono text-muted-foreground">
                {displayPoints.length} / {sortedPoints.length} pts
              </span>
            </div>
            <Slider
              value={timeRange}
              onValueChange={setTimeRange}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-[10px] font-mono text-muted-foreground">
              <span>{loTs ? new Date(loTs * 1000).toLocaleDateString() : '—'}</span>
              <span>{hiTs ? new Date(hiTs * 1000).toLocaleDateString() : '—'}</span>
            </div>
          </div>
        )}

        {/* ── Upload button (top-right floating) ── */}
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
            style={{ background: 'var(--panel-bg)', backdropFilter: 'blur(14px)' }}
          >
            <Upload className="h-3.5 w-3.5" />
            Upload CSV
          </button>
        </div>

        {/* ── Bottom-centre layer control panel ── */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div
            className="flex items-end gap-0.5 px-2.5 py-2 rounded-2xl shadow-2xl border border-border"
            style={{ background: 'var(--panel-bg)', backdropFilter: 'blur(14px)' }}
          >
            {layerConfig.map(({ key, icon, label, color }) => {
              const active = layers[key];
              return (
                <button
                  key={key}
                  onClick={() => toggleLayer(key)}
                  title={label}
                  className={[
                    'relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl transition-all duration-150',
                    active
                      ? 'bg-black/8 dark:bg-white/8'
                      : 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5',
                  ].join(' ')}
                  style={active ? { color } : {}}
                >
                  {icon}
                  <span className="text-[9px] font-medium leading-none tracking-wide">
                    {label}
                  </span>
                  {/* Active indicator dot */}
                  {active && (
                    <span
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: color }}
                    />
                  )}
                </button>
              );
            })}

            {/* Divider + legend */}
            <div className="flex items-center self-stretch mx-1">
              <div className="w-px h-full bg-border" />
            </div>

            {/* Point count badge */}
            <div className="flex flex-col items-center justify-center px-2 py-1 gap-0.5">
              <span className="text-[11px] font-semibold font-mono text-foreground leading-none">
                {displayPoints.length}
              </span>
              <span className="text-[9px] text-muted-foreground leading-none">pts</span>
            </div>
          </div>
        </div>
      </div>

      <CSVUploadDialog
        open={showUpload}
        onOpenChange={setShowUpload}
        deviceId={device.id}
        onUploadComplete={() => {
          onRefresh();
          toast({
            title: 'Upload successful',
            description: 'CSV data uploaded successfully',
            className: 'bg-green-50 border-green-200 text-green-800',
          });
        }}
      />
    </>
  );
};

export default MapView;
