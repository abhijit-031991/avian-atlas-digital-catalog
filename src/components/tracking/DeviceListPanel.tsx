import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Battery, Signal, Clock, Radio, ChevronDown, ChevronUp } from 'lucide-react';
import type { DeviceData, BaseStationData } from '@/components/MapComponent';

interface DeviceListPanelProps {
  devices: DeviceData[];
  baseStations: BaseStationData[];
  selectedDevice: string | null;
  onDeviceClick: (deviceId: string) => void;
  onStationClick: (stationId: string) => void;
}

const ACTIVE_MS = 5 * 60 * 1000;
const STALE_MS = 30 * 60 * 1000;

function getStatus(lastContact: number): 'active' | 'stale' | 'offline' {
  if (!lastContact) return 'offline';
  const diff = Date.now() - lastContact * 1000;
  if (diff < ACTIVE_MS) return 'active';
  if (diff < STALE_MS) return 'stale';
  return 'offline';
}

function formatLastSeen(ts: number): string {
  if (!ts) return 'Never';
  const diff = Date.now() - ts * 1000;
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function StatusDot({ status }: { status: 'active' | 'stale' | 'offline' }) {
  if (status === 'active') return (
    <span className="relative flex h-2 w-2 shrink-0">
      <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
    </span>
  );
  if (status === 'stale') return <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />;
  return <span className="h-2 w-2 rounded-full bg-slate-400/50 shrink-0" />;
}

function getBatteryColor(pct: number) {
  if (pct > 50) return 'text-emerald-500';
  if (pct > 20) return 'text-amber-500';
  return 'text-red-500';
}

// Pill button shown when panel is collapsed
const collapsedPillClass = [
  'flex items-center gap-2 px-3.5 py-2.5 rounded-xl shadow-xl font-medium transition-colors',
  'bg-white dark:bg-[#0a0f1a] border border-black/10 dark:border-white/10',
  'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-[#0f1623]',
].join(' ');

// Panel container: flex column so scroll child works
function panelStyle(maxH: string): React.CSSProperties {
  return {
    width: 308,
    maxHeight: maxH,
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--panel-bg)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
  };
}

// ─── Tracking Devices panel ──────────────────────────────────────────────────
function DevicesPanel({
  devices,
  selectedDevice,
  onDeviceClick,
}: {
  devices: DeviceData[];
  selectedDevice: string | null;
  onDeviceClick: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState('');
  const filtered = devices.filter((d) =>
    d.deviceId.toLowerCase().includes(search.toLowerCase())
  );
  const activeCount = devices.filter((d) => getStatus(d.lastContact) === 'active').length;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={collapsedPillClass}
        title="Show tracking devices"
      >
        {/* icon 50% larger: h-6 w-6 */}
        <Radio className="h-6 w-6 text-sky-500 shrink-0" />
        <span className="text-xs">{devices.length} Devices</span>
        {activeCount > 0 && <span className="h-2 w-2 rounded-full bg-emerald-400" />}
        <ChevronDown className="h-4 w-4 text-gray-400 dark:text-slate-500" />
      </button>
    );
  }

  return (
    <div
      className="rounded-xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden"
      style={panelStyle('calc(50vh - 20px)')}
    >
      {/* Header */}
      <div className="px-3 py-2.5 flex items-center gap-2 border-b border-black/8 dark:border-white/8 shrink-0">
        {/* icon 50% larger: h-5 w-5 */}
        <Radio className="h-5 w-5 text-sky-500 shrink-0" />
        <span className="text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
          Tracking Devices
        </span>
        <span className="ml-1 text-[10px] text-gray-400 dark:text-slate-500">{devices.length}</span>
        {activeCount > 0 && (
          <span className="flex items-center gap-1 ml-2 text-[10px] text-emerald-500 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{activeCount} active
          </span>
        )}
        <button
          onClick={() => setOpen(false)}
          className="ml-auto p-0.5 rounded text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 transition-colors shrink-0"
          title="Collapse"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-2.5 py-2 border-b border-black/5 dark:border-white/5 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 dark:text-slate-500" />
          <Input
            placeholder="Filter devices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs bg-black/5 dark:bg-white/8 border-black/10 dark:border-white/10
                       text-gray-800 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Device list — min-h-0 is critical for flex overflow scroll */}
      <div className="overflow-y-auto min-h-0 flex-1">
        {filtered.length === 0 ? (
          <p className="text-[11px] text-gray-400 dark:text-slate-500 text-center py-5">
            {devices.length === 0 ? 'No devices found' : 'No matches'}
          </p>
        ) : (
          filtered.map((device) => {
            const status = getStatus(device.lastContact);
            const isSelected = device.deviceId === selectedDevice;
            return (
              <button
                key={device.deviceId}
                onClick={() => onDeviceClick(device.deviceId)}
                className={[
                  'w-full text-left px-3 py-2.5 border-b border-black/5 dark:border-white/5 transition-colors',
                  isSelected
                    ? 'bg-sky-50 dark:bg-sky-500/10 border-l-2 border-l-sky-500'
                    : 'hover:bg-black/5 dark:hover:bg-white/5',
                ].join(' ')}
              >
                <div className="flex items-center gap-2 mb-1">
                  <StatusDot status={status} />
                  <span className="font-mono text-xs font-semibold text-gray-800 dark:text-slate-100 truncate">
                    {device.deviceId}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-slate-500 ml-4">
                  {device.battery != null && (
                    <span className={`flex items-center gap-0.5 ${getBatteryColor(device.battery)}`}>
                      <Battery className="h-3 w-3" />{device.battery}%
                    </span>
                  )}
                  {device.signal && device.signal !== 'No Signal' && (
                    <span className="flex items-center gap-0.5 text-sky-500 dark:text-sky-400">
                      <Signal className="h-3 w-3" />{device.signal}
                    </span>
                  )}
                  <span className="flex items-center gap-0.5 ml-auto">
                    <Clock className="h-3 w-3" />{formatLastSeen(device.lastContact)}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── Base Stations panel ─────────────────────────────────────────────────────
function BaseStationsPanel({
  stations,
  selectedStation,
  onStationClick,
}: {
  stations: BaseStationData[];
  selectedStation: string | null;
  onStationClick: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState('');
  const filtered = stations.filter((s) =>
    s.stationId.toLowerCase().includes(search.toLowerCase())
  );

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={collapsedPillClass}
        title="Show base stations"
      >
        {/* icon 50% larger: h-6 w-6 */}
        <img src="/tracking/markers/tower.png" className="h-6 w-6 object-contain shrink-0" alt="" />
        <span className="text-xs">{stations.length} Stations</span>
        <ChevronDown className="h-4 w-4 text-gray-400 dark:text-slate-500" />
      </button>
    );
  }

  return (
    <div
      className="rounded-xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden"
      style={panelStyle('calc(50vh - 20px)')}
    >
      {/* Header */}
      <div className="px-3 py-2.5 flex items-center gap-2 border-b border-black/8 dark:border-white/8 shrink-0">
        {/* icon 50% larger: h-5 w-5 */}
        <img src="/tracking/markers/tower.png" className="h-5 w-5 object-contain shrink-0" alt="" />
        <span className="text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
          Base Stations
        </span>
        <span className="ml-1 text-[10px] text-gray-400 dark:text-slate-500">{stations.length}</span>
        <button
          onClick={() => setOpen(false)}
          className="ml-auto p-0.5 rounded text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 transition-colors shrink-0"
          title="Collapse"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-2.5 py-2 border-b border-black/5 dark:border-white/5 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 dark:text-slate-500" />
          <Input
            placeholder="Filter stations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs bg-black/5 dark:bg-white/8 border-black/10 dark:border-white/10
                       text-gray-800 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Station list — min-h-0 for scroll */}
      <div className="overflow-y-auto min-h-0 flex-1">
        {filtered.length === 0 ? (
          <p className="text-[11px] text-gray-400 dark:text-slate-500 text-center py-5">
            {stations.length === 0 ? 'No base stations' : 'No matches'}
          </p>
        ) : (
          filtered.map((station) => {
            const isSelected = station.stationId === selectedStation;
            return (
              <button
                key={station.stationId}
                onClick={() => onStationClick(station.stationId)}
                className={[
                  'w-full text-left px-3 py-2.5 border-b border-black/5 dark:border-white/5 transition-colors',
                  isSelected
                    ? 'bg-violet-50 dark:bg-violet-500/10 border-l-2 border-l-violet-400'
                    : 'hover:bg-black/5 dark:hover:bg-white/5',
                ].join(' ')}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-2 w-2 rounded-full bg-violet-400 shrink-0" />
                  <span className="font-mono text-xs font-semibold text-gray-800 dark:text-slate-100 truncate">
                    {station.stationId}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-slate-500 ml-4">
                  {station.signal != null && (
                    <span className="flex items-center gap-0.5">
                      <Signal className="h-3 w-3" />{station.signal}
                    </span>
                  )}
                  <span className="flex items-center gap-0.5 ml-auto">
                    <Clock className="h-3 w-3" />{formatLastSeen(station.lastHeartbeat)}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── Root floating container ──────────────────────────────────────────────────
const DeviceListPanel: React.FC<DeviceListPanelProps> = ({
  devices,
  baseStations,
  selectedDevice,
  onDeviceClick,
  onStationClick,
}) => {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  const handleStationClick = (id: string) => {
    setSelectedStation(id);
    onStationClick(id);
  };

  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-3 items-start">
      <DevicesPanel
        devices={devices}
        selectedDevice={selectedDevice}
        onDeviceClick={onDeviceClick}
      />
      <BaseStationsPanel
        stations={baseStations}
        selectedStation={selectedStation}
        onStationClick={handleStationClick}
      />
    </div>
  );
};

export default DeviceListPanel;
