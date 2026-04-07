import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  Activity, MapPin, Clock, Gauge, Navigation, Moon,
  Target, BarChart3, TrendingUp, Crosshair, Map,
} from 'lucide-react';
import { format } from 'date-fns';
import { DeviceInfo, DataPoint } from '@/types/database-analytics';

// ── Helpers ────────────────────────────────────────────────────────────────────

function toMs(ts: string | number | null | undefined): number {
  if (ts == null) return 0;
  const n = typeof ts === 'string' ? Date.parse(ts) : Number(ts);
  if (!n || isNaN(n)) return 0;
  return n < 32503680000 ? n * 1000 : n;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function convexHull(pts: [number, number][]): [number, number][] {
  if (pts.length < 3) return pts;
  const sorted = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (O: [number, number], A: [number, number], B: [number, number]) =>
    (A[0] - O[0]) * (B[1] - O[1]) - (A[1] - O[1]) * (B[0] - O[0]);
  const lower: [number, number][] = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: [number, number][] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  lower.pop(); upper.pop();
  return lower.concat(upper);
}

function hullAreaKm2(hull: [number, number][], centLat: number): number {
  if (hull.length < 3) return 0;
  const toXY = ([lng, lat]: [number, number]): [number, number] => [
    lng * Math.cos(centLat * Math.PI / 180) * 111.32,
    lat * 110.574,
  ];
  const pts = hull.map(toXY);
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    area += pts[i][0] * pts[j][1] - pts[j][0] * pts[i][1];
  }
  return Math.abs(area) / 2;
}

function downsample<T>(arr: T[], max: number): T[] {
  if (arr.length <= max) return arr;
  const step = arr.length / max;
  return Array.from({ length: max }, (_, i) => arr[Math.floor(i * step)]);
}

function fmtDuration(hours: number): string {
  if (hours < 1 / 60) return `${Math.round(hours * 3600)}s`;
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${hours.toFixed(1)}h`;
  const days = hours / 24;
  if (days < 30) return `${days.toFixed(1)}d`;
  return `${(days / 30.44).toFixed(1)}mo`;
}

function fmtKm(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k km`;
  if (v < 1) return `${(v * 1000).toFixed(0)} m`;
  return `${v.toFixed(1)} km`;
}

function fmtArea(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k km²`;
  return `${v.toFixed(1)} km²`;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  iconColor: string;
  tint?: string;        // rgba bg injected by CategoryRow
  tintBorder?: string;  // rgba border injected by CategoryRow
}

const StatCard = ({ label, value, sub, icon: Icon, iconColor, tint, tintBorder }: StatCardProps) => (
  <div
    className="border rounded-lg p-3 flex flex-col gap-1 min-w-0"
    style={{
      backgroundColor: tint ?? 'hsl(var(--card))',
      borderColor: tintBorder ?? 'hsl(var(--border))',
    }}
  >
    <div className="flex items-center gap-1.5">
      <Icon className={`h-3 w-3 shrink-0 ${iconColor}`} />
      <span className="text-[11px] text-muted-foreground truncate">{label}</span>
    </div>
    <p className="text-base font-semibold font-mono text-foreground leading-tight">{value}</p>
    {sub && <p className="text-[10px] text-muted-foreground/60 font-mono">{sub}</p>}
  </div>
);

// ── Category Row ──────────────────────────────────────────────────────────────

const CategoryRow = ({ title, cols = 4, tint, tintBorder, children }: {
  title: string; cols?: number; tint?: string; tintBorder?: string; children: React.ReactNode;
}) => (
  <div>
    <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-2">
      {title}
    </h3>
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<StatCardProps>, { tint, tintBorder })
          : child
      )}
    </div>
  </div>
);

// ── Accelerometer Chart (with scroll zoom + mode toggle) ─────────────────────

interface AccelPoint { t: number; ax: number; ay: number; az: number; }
type AccelMode = 'xyz' | 'activity';

const AccelChart = ({ data }: { data: AccelPoint[] }) => {
  const [mode, setMode] = useState<AccelMode>('xyz');

  // Enrich data with pre-computed average
  const chartData = useMemo(() =>
    data.map(d => ({ ...d, avg: +((d.ax + d.ay + d.az) / 3).toFixed(4) })),
    [data]
  );

  // Extents re-compute when mode switches → triggers domain reset
  const extents = useMemo(() => {
    if (chartData.length === 0) return null;
    const ts   = chartData.map(d => d.t);
    const minT = Math.min(...ts), maxT = Math.max(...ts);
    const vals = mode === 'xyz'
      ? chartData.flatMap(d => [d.ax, d.ay, d.az])
      : chartData.map(d => d.avg);
    const minV = Math.min(...vals), maxV = Math.max(...vals);
    const vPad = Math.max((maxV - minV) * 0.08, 0.01);
    return { minT, maxT, minV: minV - vPad, maxV: maxV + vPad };
  }, [chartData, mode]);

  const [xDomain, setXDomain] = useState<[number, number] | null>(null);
  const [yDomain, setYDomain] = useState<[number, number] | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // Reset domains when data or mode changes
  useEffect(() => {
    if (extents) {
      setXDomain([extents.minT, extents.maxT]);
      setYDomain([extents.minV, extents.maxV]);
    }
  }, [extents]);

  // Non-passive wheel listener for scroll zoom
  useEffect(() => {
    const el = chartRef.current;
    if (!el || !extents) return;
    const ZOOM = 0.12;
    const PAN  = 0.20; // 20% of current window per tick
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const dir = e.deltaY > 0 ? 1 : -1;
      if (e.altKey) {
        // Pan left/right — keeps window size fixed, clamps to data edges
        setXDomain(prev => {
          if (!prev) return prev;
          const [lo, hi] = prev;
          const span  = hi - lo;
          const shift = span * PAN * dir;
          const newLo = lo + shift;
          const newHi = hi + shift;
          if (newLo < extents.minT) return [extents.minT, extents.minT + span];
          if (newHi > extents.maxT) return [extents.maxT - span, extents.maxT];
          return [newLo, newHi];
        });
      } else if (e.shiftKey) {
        // Vertical zoom around centre
        setYDomain(prev => {
          if (!prev) return prev;
          const [lo, hi] = prev;
          const c = (lo + hi) / 2;
          const h = (hi - lo) / 2 * (1 + dir * ZOOM);
          return [c - h, c + h];
        });
      } else {
        // Horizontal zoom around centre
        setXDomain(prev => {
          if (!prev) return prev;
          const [lo, hi] = prev;
          const c = (lo + hi) / 2;
          const h = Math.max((hi - lo) / 2 * (1 + dir * ZOOM), 60_000);
          return [Math.max(extents.minT, c - h), Math.min(extents.maxT, c + h)];
        });
      }
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [extents]);

  const handleReset = () => {
    if (extents) {
      setXDomain([extents.minT, extents.maxT]);
      setYDomain([extents.minV, extents.maxV]);
    }
  };

  const isZoomed = !!(extents && xDomain &&
    (xDomain[0] !== extents.minT || xDomain[1] !== extents.maxT));

  return (
    <div className="bg-card border border-border rounded-lg p-3">

      {/* Header: legend + mode toggle + meta */}
      <div className="flex items-center gap-3 mb-3">

        {/* Legend — changes with mode */}
        {mode === 'xyz' ? (
          <div className="flex items-center gap-3">
            {([['#ef4444', 'X'], ['#22c55e', 'Y'], ['#3b82f6', 'Z']] as const).map(([color, axis]) => (
              <span key={axis} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-5 rounded-full inline-block" style={{ background: color }} />
                {axis}
              </span>
            ))}
          </div>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-5 rounded-full inline-block" style={{ background: '#06b6d4' }} />
            Average (X+Y+Z) / 3
          </span>
        )}

        {/* Mode toggle pill */}
        <div className="ml-auto flex items-center rounded-md overflow-hidden border border-border text-[10px] shrink-0">
          {(['xyz', 'activity'] as AccelMode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-2.5 py-1 transition-colors ${
                mode === m
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted/50'
              }`}
            >
              {m === 'xyz' ? 'XYZ' : 'Activity'}
            </button>
          ))}
        </div>

        {/* Zoom reset + sample count */}
        <div className="flex items-center gap-3 shrink-0">
          {isZoomed && (
            <button onClick={handleReset} className="text-[10px] text-primary hover:underline">
              Reset zoom
            </button>
          )}
          <span className="text-[10px] text-muted-foreground/40">{data.length} pts</span>
        </div>
      </div>

      {/* Chart */}
      <div ref={chartRef} className="select-none cursor-crosshair" onDoubleClick={handleReset}>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
            <XAxis
              dataKey="t"
              type="number"
              scale="time"
              domain={xDomain ?? ['auto', 'auto']}
              tickFormatter={v => format(new Date(Number(v)), 'dd/MM')}
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)' } as any}
              axisLine={false}
              tickLine={false}
              allowDataOverflow
            />
            <YAxis
              domain={yDomain ?? ['auto', 'auto']}
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)' } as any}
              axisLine={false}
              tickLine={false}
              width={52}
              allowDataOverflow
            />
            <Tooltip
              contentStyle={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                fontSize: 11,
                color: 'var(--foreground)',
              }}
              labelFormatter={v => format(new Date(Number(v)), 'dd MMM yy HH:mm')}
              formatter={(v: number, name: string) => [
                v?.toFixed(4),
                name === 'avg' ? 'Average' : name.toUpperCase(),
              ]}
            />
            {mode === 'xyz' ? (
              <>
                <Line type="monotone" dataKey="ax" stroke="#ef4444" dot={false} strokeWidth={1.5} name="ax" isAnimationActive={false} />
                <Line type="monotone" dataKey="ay" stroke="#22c55e" dot={false} strokeWidth={1.5} name="ay" isAnimationActive={false} />
                <Line type="monotone" dataKey="az" stroke="#3b82f6" dot={false} strokeWidth={1.5} name="az" isAnimationActive={false} />
              </>
            ) : (
              <Line type="monotone" dataKey="avg" stroke="#06b6d4" dot={false} strokeWidth={2} name="avg" isAnimationActive={false} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[9px] text-muted-foreground/30 mt-1.5 text-right">
        Scroll · zoom &nbsp;·&nbsp; Alt+Scroll · pan &nbsp;·&nbsp; Shift+Scroll · zoom vertical &nbsp;·&nbsp; Double-click · reset
      </p>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const StatsPanel = ({ device, data }: { device: DeviceInfo | null; data: DataPoint[] }) => {

  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;

    const sorted = [...data].sort((a, b) => toMs(a.timestamp) - toMs(b.timestamp));
    const validPts = sorted.filter(d =>
      d.latitude && d.longitude && !isNaN(d.latitude) && !isNaN(d.longitude)
    );

    // Basic summary
    const timestamps = sorted.map(d => toMs(d.timestamp)).filter(t => t > 0);
    const tMin = Math.min(...timestamps);
    const tMax = Math.max(...timestamps);
    const timeSpanHours = timestamps.length > 1 ? (tMax - tMin) / 3_600_000 : 0;
    const collectionRate = timeSpanHours > 0 ? data.length / (timeSpanHours / 24) : 0;

    // Movement
    let totalDistance = 0;
    for (let i = 1; i < validPts.length; i++) {
      totalDistance += haversineKm(
        validPts[i - 1].latitude, validPts[i - 1].longitude,
        validPts[i].latitude, validPts[i].longitude,
      );
    }
    const displacement = validPts.length > 1
      ? haversineKm(validPts[0].latitude, validPts[0].longitude,
          validPts[validPts.length - 1].latitude, validPts[validPts.length - 1].longitude)
      : 0;
    const farthestFromStart = validPts.length > 1
      ? Math.max(...validPts.map(p =>
          haversineKm(validPts[0].latitude, validPts[0].longitude, p.latitude, p.longitude)))
      : 0;
    const avgStepKm = validPts.length > 1 ? totalDistance / (validPts.length - 1) : 0;

    // Territory
    const centLat = validPts.reduce((s, p) => s + p.latitude, 0) / (validPts.length || 1);
    const centLng = validPts.reduce((s, p) => s + p.longitude, 0) / (validPts.length || 1);
    const hullPts = convexHull(validPts.map(p => [p.longitude, p.latitude] as [number, number]));
    const mcpArea = hullAreaKm2(hullPts, centLat);
    // 95% core area: points within 95th percentile distance from centroid
    const distsSorted = validPts
      .map(p => haversineKm(centLat, centLng, p.latitude, p.longitude))
      .sort((a, b) => a - b);
    const p95dist = distsSorted[Math.floor(distsSorted.length * 0.95)] ?? Infinity;
    const inner95 = validPts.filter(p =>
      haversineKm(centLat, centLng, p.latitude, p.longitude) <= p95dist
    );
    const hull95 = convexHull(inner95.map(p => [p.longitude, p.latitude] as [number, number]));
    const area95 = hullAreaKm2(hull95, centLat);

    // GPS quality
    const validHdop = data.filter(d => d.hdop != null && d.hdop > 0 && d.hdop < 20).map(d => d.hdop!);
    const avgHdop = validHdop.length > 0
      ? validHdop.reduce((s, v) => s + v, 0) / validHdop.length : null;
    const validLock = data.filter(d => d.locktime != null && d.locktime > 0 && d.locktime < 9999).map(d => d.locktime!);
    const avgLock = validLock.length > 0
      ? validLock.reduce((s, v) => s + v, 0) / validLock.length : null;
    const validCoordRate = (validPts.length / data.length) * 100;

    // Temporal
    const gaps: number[] = [];
    for (let i = 1; i < timestamps.length; i++) gaps.push(timestamps[i] - timestamps[i - 1]);
    const maxGapMs = gaps.length > 0 ? Math.max(...gaps) : 0;
    const avgIntervalMs = gaps.length > 0 ? gaps.reduce((s, v) => s + v, 0) / gaps.length : 0;
    const nightCount = data.filter(d => {
      const h = new Date(toMs(d.timestamp)).getUTCHours();
      return h >= 18 || h < 6;
    }).length;
    const nightPct = (nightCount / data.length) * 100;

    return {
      totalPoints: data.length,
      dateFrom: tMin > 0 ? format(new Date(tMin), 'dd MMM yy') : '—',
      dateTo:   tMax > 0 ? format(new Date(tMax), 'dd MMM yy') : '—',
      timeSpanHours,
      collectionRate,
      totalDistance,
      displacement,
      farthestFromStart,
      avgStepKm,
      mcpArea,
      area95,
      centLat,
      centLng,
      avgHdop,
      avgLock,
      validCoordRate,
      maxGapHours: maxGapMs / 3_600_000,
      avgIntervalMin: avgIntervalMs / 60_000,
      nightPct,
    };
  }, [data]);

  // Accelerometer chart data — downsampled
  const accelData = useMemo(() => {
    const withAccel = data.filter(d => d.ax != null && d.ay != null && d.az != null);
    if (withAccel.length === 0) return [];
    const sorted = [...withAccel].sort((a, b) => toMs(a.timestamp) - toMs(b.timestamp));
    return downsample(sorted, 400).map(d => ({
      t: toMs(d.timestamp),
      ax: Number(d.ax?.toFixed(4)),
      ay: Number(d.ay?.toFixed(4)),
      az: Number(d.az?.toFixed(4)),
    }));
  }, [data]);

  // ── Empty states ──────────────────────────────────────────────────────────
  if (!device) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-10 w-10 mx-auto mb-3 text-muted-foreground/20" />
          <p className="text-sm text-muted-foreground">Select a device to view statistics</p>
        </div>
      </div>
    );
  }
  if (!stats) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="overflow-y-auto min-h-0 p-4 space-y-5">

      {/* Basic Summary — sky blue */}
      <CategoryRow title="Basic Summary" cols={4} tint="rgba(14,165,233,0.10)" tintBorder="rgba(14,165,233,0.25)">
        <StatCard label="Total Fixes"       value={stats.totalPoints.toLocaleString()} icon={Activity}   iconColor="text-primary" />
        <StatCard label="Date Range"        value={stats.dateFrom} sub={`→ ${stats.dateTo}`}              icon={Clock}     iconColor="text-sky-500" />
        <StatCard label="Time Span"         value={fmtDuration(stats.timeSpanHours)}                      icon={Clock}     iconColor="text-sky-500" />
        <StatCard label="Collection Rate"   value={`${Math.round(stats.collectionRate)}/day`}             icon={TrendingUp} iconColor="text-emerald-500" />
      </CategoryRow>

      {/* Movement — amber */}
      <CategoryRow title="Movement" cols={4} tint="rgba(245,158,11,0.10)" tintBorder="rgba(245,158,11,0.25)">
        <StatCard label="Total Distance"    value={fmtKm(stats.totalDistance)}                           icon={Navigation} iconColor="text-amber-500" />
        <StatCard label="Displacement"      value={fmtKm(stats.displacement)} sub="start → end"          icon={Navigation} iconColor="text-amber-400" />
        <StatCard label="Farthest from Start" value={fmtKm(stats.farthestFromStart)}                    icon={MapPin}    iconColor="text-red-500" />
        <StatCard label="Avg Step Length"   value={fmtKm(stats.avgStepKm)}                              icon={Gauge}     iconColor="text-orange-500" />
      </CategoryRow>

      {/* Territory — violet */}
      <CategoryRow title="Territory" cols={3} tint="rgba(139,92,246,0.10)" tintBorder="rgba(139,92,246,0.25)">
        <StatCard label="MCP Area (100%)"   value={fmtArea(stats.mcpArea)} sub="Convex hull"            icon={Map}       iconColor="text-violet-500" />
        <StatCard label="Core Area (95%)"   value={fmtArea(stats.area95)} sub="Inner 95% hull"          icon={Target}    iconColor="text-purple-500" />
        <StatCard label="Centroid"          value={`${stats.centLat.toFixed(4)}°`} sub={`${stats.centLng.toFixed(4)}°`} icon={Crosshair} iconColor="text-fuchsia-500" />
      </CategoryRow>

      {/* GPS Quality — teal */}
      <CategoryRow title="GPS Quality" cols={3} tint="rgba(20,184,166,0.10)" tintBorder="rgba(20,184,166,0.25)">
        <StatCard label="Avg HDOP"          value={stats.avgHdop != null ? stats.avgHdop.toFixed(2) : '—'} sub="lower = better" icon={Gauge}  iconColor="text-cyan-500" />
        <StatCard label="Avg Lock Time"     value={stats.avgLock != null ? `${stats.avgLock.toFixed(1)} s` : '—'}               icon={Clock}  iconColor="text-blue-500" />
        <StatCard label="Valid Coords"      value={`${stats.validCoordRate.toFixed(1)}%`}                                        icon={MapPin} iconColor="text-teal-500" />
      </CategoryRow>

      {/* Temporal — indigo */}
      <CategoryRow title="Temporal" cols={3} tint="rgba(99,102,241,0.10)" tintBorder="rgba(99,102,241,0.25)">
        <StatCard label="Largest Gap"       value={fmtDuration(stats.maxGapHours)}                      icon={Clock}     iconColor="text-red-400" />
        <StatCard label="Avg Fix Interval"  value={stats.avgIntervalMin < 1
            ? `${Math.round(stats.avgIntervalMin * 60)}s`
            : `${stats.avgIntervalMin.toFixed(1)}m`}                                                    icon={Activity}  iconColor="text-slate-400" />
        <StatCard label="Night Fixes"       value={`${stats.nightPct.toFixed(1)}%`} sub="18:00–06:00 UTC" icon={Moon}    iconColor="text-indigo-400" />
      </CategoryRow>

      {/* Accelerometer */}
      {accelData.length > 0 && (
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-2">
            Accelerometer
          </h3>
          <AccelChart data={accelData} />
        </div>
      )}

    </div>
  );
};

export default StatsPanel;
