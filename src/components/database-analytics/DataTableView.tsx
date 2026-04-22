
import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  CalendarIcon, Download, Upload, RefreshCw, Database, Search,
  ArrowUpDown, ArrowUp, ArrowDown,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import CSVUploadDialog from '@/components/CSVUploadDialog';
import { DataPoint, DeviceInfo, SortConfig } from '@/types/database-analytics';
import { DeploymentRange } from '@/types/deployments';

interface DataTableViewProps {
  device: DeviceInfo;
  data: DataPoint[];
  loading: boolean;
  tableExists: boolean;
  onRefresh: () => void;
  onDataChange?: (data: DataPoint[]) => void;
  deploymentRange?: DeploymentRange | null;
}

const toMs = (ts: number) => ts < 32503680000 ? ts * 1000 : ts;

const COLUMNS: { key: keyof DataPoint; label: string; mono?: boolean; width?: string }[] = [
  { key: 'pointid',   label: '#',          mono: true,  width: 'w-12'  },
  { key: 'id',        label: 'Device',     mono: true,  width: 'w-16'  },
  { key: 'timestamp', label: 'Timestamp',               width: 'w-36'  },
  { key: 'latitude',  label: 'Latitude',   mono: true,  width: 'w-24'  },
  { key: 'longitude', label: 'Longitude',  mono: true,  width: 'w-24'  },
  { key: 'speed',     label: 'Speed',      mono: true,  width: 'w-14'  },
  { key: 'activity',  label: 'Activity',               width: 'w-20'  },
  { key: 'satellites',label: 'Sats',       mono: true,  width: 'w-12'  },
  { key: 'ax',        label: 'AX',         mono: true,  width: 'w-12'  },
  { key: 'ay',        label: 'AY',         mono: true,  width: 'w-12'  },
  { key: 'az',        label: 'AZ',         mono: true,  width: 'w-12'  },
];

const DataTableView = ({ device, data, loading, tableExists, onRefresh, onDataChange, deploymentRange }: DataTableViewProps) => {
  const [startDate, setStartDate]   = useState<Date>();
  const [endDate, setEndDate]       = useState<Date>();
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'pointid', direction: 'asc' });
  const [currentPage, setCurrentPage]   = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const { toast } = useToast();

  // Sync date filters when a deployment is selected / cleared
  useEffect(() => {
    if (deploymentRange) {
      setStartDate(deploymentRange.start);
      setEndDate(deploymentRange.end);
    } else {
      setStartDate(undefined);
      setEndDate(undefined);
    }
    setCurrentPage(1);
  }, [deploymentRange]);

  /* ── Sort ───────────────────────────────────────────────────── */
  const handleSort = (key: keyof DataPoint) => {
    setSortConfig(prev =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  };

  const SortIcon = ({ col }: { col: keyof DataPoint }) => {
    if (sortConfig.key !== col) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortConfig.direction === 'asc'
      ? <ArrowUp   className="h-3 w-3 text-cyan-300" />
      : <ArrowDown className="h-3 w-3 text-cyan-300" />;
  };

  /* ── Export ─────────────────────────────────────────────────── */
  const exportData = () => {
    if (!data.length) {
      toast({ title: 'No data', description: 'Nothing to export', variant: 'destructive' });
      return;
    }
    const esc = (v: unknown) => {
      const s = String(v ?? '');
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [
      ['Point ID','ID','Timestamp','Locktime','Latitude','Longitude','HDOP','Count','Satellites','Speed','Activity','AX','AY','AZ','Created At'],
      ...data.map(r => [r.pointid,r.id,r.timestamp,r.locktime,r.latitude,r.longitude,r.hdop,r.count,r.satellites,r.speed,r.activity,r.ax,r.ay,r.az,r.created_at]),
    ].map(r => r.map(esc).join(',')).join('\n');
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: `${device.id}_data.csv`,
    });
    a.click();
    URL.revokeObjectURL(a.href);
  };

  /* ── Filter + sort ──────────────────────────────────────────── */
  const filteredAndSortedData = useMemo(() => {
    let rows = data.filter(item => {
      const q = searchTerm.toLowerCase();
      const matchSearch = !q ||
        item.latitude.toString().includes(q) ||
        item.longitude.toString().includes(q) ||
        item.id.toString().includes(q);
      const d = new Date(toMs(item.timestamp));
      const matchDate = (!startDate || d >= startDate) && (!endDate || d <= endDate);
      return matchSearch && matchDate;
    });
    rows.sort((a, b) => {
      const av = a[sortConfig.key], bv = b[sortConfig.key];
      if (av == null) return 1;
      if (bv == null) return -1;
      return av < bv ? (sortConfig.direction === 'asc' ? -1 : 1) : av > bv ? (sortConfig.direction === 'asc' ? 1 : -1) : 0;
    });
    return rows;
  }, [data, searchTerm, startDate, endDate, sortConfig]);

  const totalPages   = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const s = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(s, s + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  useEffect(() => { onDataChange?.(filteredAndSortedData); }, [filteredAndSortedData, onDataChange]);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, startDate, endDate, sortConfig, itemsPerPage]);

  const handleUploadComplete = () => {
    onRefresh();
    toast({ title: 'Upload successful', description: 'CSV data has been imported' });
  };

  /* ── Empty state ─────────────────────────────────────────────── */
  if (!tableExists && !loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Database className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium mb-1">No data for this device</p>
          <p className="text-xs mb-3 opacity-60">Upload a CSV to get started</p>
          <Button size="sm" onClick={() => setShowUpload(true)}>
            <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload CSV
          </Button>
        </div>
      </div>
    );
  }

  /* ── Main layout ─────────────────────────────────────────────── */
  const rangeStart = ((currentPage - 1) * itemsPerPage) + 1;
  const rangeEnd   = Math.min(currentPage * itemsPerPage, filteredAndSortedData.length);
  const isFiltered = !!searchTerm || !!startDate || !!endDate;

  return (
    <>
      <div className="flex flex-col h-full overflow-hidden">

        {/* ── Toolbar ─────────────────────────────────────────── */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border shrink-0 bg-card flex-wrap">

          {/* Material search bar — rounded-full pill */}
          <div className="flex items-center gap-2 rounded-full bg-muted/50 border border-border/60 px-3 py-1.5 min-w-[180px]">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              placeholder="Search…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-transparent text-xs outline-none flex-1 placeholder:text-muted-foreground/60 text-foreground"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-muted-foreground hover:text-foreground shrink-0">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Material filter chips — date range */}
          <Popover>
            <PopoverTrigger asChild>
              <button className={[
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                startDate
                  ? 'bg-primary/15 border-primary/30 text-primary'
                  : 'border-border/60 text-muted-foreground hover:bg-muted/60 hover:text-foreground',
              ].join(' ')}>
                <CalendarIcon className="h-3 w-3" />
                {startDate ? format(startDate, 'dd MMM yy') : 'From'}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
            </PopoverContent>
          </Popover>

          <span className="text-muted-foreground/30 text-xs">→</span>

          <Popover>
            <PopoverTrigger asChild>
              <button className={[
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                endDate
                  ? 'bg-primary/15 border-primary/30 text-primary'
                  : 'border-border/60 text-muted-foreground hover:bg-muted/60 hover:text-foreground',
              ].join(' ')}>
                <CalendarIcon className="h-3 w-3" />
                {endDate ? format(endDate, 'dd MMM yy') : 'To'}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
            </PopoverContent>
          </Popover>

          {isFiltered && (
            <button
              onClick={() => { setSearchTerm(''); setStartDate(undefined); setEndDate(undefined); }}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          )}

          {/* Record count chip */}
          <span className="px-3 py-1 rounded-full bg-muted/40 text-xs text-muted-foreground whitespace-nowrap">
            {isFiltered
              ? <><span className="text-foreground font-medium">{filteredAndSortedData.length}</span> of {data.length}</>
              : <><span className="text-foreground font-medium">{data.length}</span> records</>
            }
          </span>

          <div className="flex-1" />

          {/* Material icon buttons — circular */}
          <button
            onClick={onRefresh}
            disabled={loading}
            title="Refresh"
            className="h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-all disabled:opacity-40"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={exportData}
            disabled={!data.length}
            title="Export CSV"
            className="h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-all disabled:opacity-40"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowUpload(true)}
            title="Upload CSV"
            className="h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-all"
          >
            <Upload className="h-4 w-4" />
          </button>
        </div>

        {/* ── Table ───────────────────────────────────────────── */}
        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full min-w-[860px] border-collapse text-xs">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#2a4a7f] border-b border-border">
                {COLUMNS.map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={`${col.width ?? ''} px-3 py-2 text-left font-semibold uppercase tracking-wider cursor-pointer select-none whitespace-nowrap transition-colors ${
                      sortConfig.key === col.key
                        ? 'text-cyan-300'
                        : 'text-white hover:text-white/80'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      <SortIcon col={col.key} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="text-center py-16 text-muted-foreground">
                    <RefreshCw className="h-4 w-4 animate-spin inline mr-2" />
                    Loading…
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="text-center py-16 text-muted-foreground">
                    {data.length === 0 ? 'No data for this device' : 'No rows match the current filters'}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, i) => (
                  <tr
                    key={row.pointid}
                    className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 1 ? 'bg-muted/10' : ''}`}
                  >
                    <td className="px-3 py-1.5 font-mono text-muted-foreground">{row.pointid}</td>
                    <td className="px-3 py-1.5 font-mono text-primary/80">{row.id}</td>
                    <td className="px-3 py-1.5 text-muted-foreground whitespace-nowrap">
                      {new Date(toMs(row.timestamp)).toLocaleString()}
                    </td>
                    <td className="px-3 py-1.5 font-mono">{row.latitude.toFixed(6)}</td>
                    <td className="px-3 py-1.5 font-mono">{row.longitude.toFixed(6)}</td>
                    <td className="px-3 py-1.5 font-mono">{row.speed ?? '—'}</td>
                    <td className="px-3 py-1.5">
                      {row.activity
                        ? <span className="inline-flex items-center gap-1 text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />Active</span>
                        : <span className="text-muted-foreground/60">Inactive</span>
                      }
                    </td>
                    <td className="px-3 py-1.5 font-mono">{row.satellites ?? '—'}</td>
                    <td className="px-3 py-1.5 font-mono">{row.ax != null ? row.ax.toFixed(2) : '—'}</td>
                    <td className="px-3 py-1.5 font-mono">{row.ay != null ? row.ay.toFixed(2) : '—'}</td>
                    <td className="px-3 py-1.5 font-mono">{row.az != null ? row.az.toFixed(2) : '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination bar ───────────────────────────────────── */}
        <div className="shrink-0 flex items-center justify-between px-4 py-2 border-t border-border bg-card text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <Select value={String(itemsPerPage)} onValueChange={v => setItemsPerPage(Number(v))}>
              <SelectTrigger className="h-6 w-16 text-xs border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[50, 100, 200, 500, 1000].map(n => (
                  <SelectItem key={n} value={String(n)} className="text-xs">{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filteredAndSortedData.length > 0 && (
              <span>{rangeStart}–{rangeEnd} of {filteredAndSortedData.length}</span>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="h-6 w-6 flex items-center justify-center rounded hover:bg-muted disabled:opacity-30">
                <ChevronsLeft className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="h-6 w-6 flex items-center justify-center rounded hover:bg-muted disabled:opacity-30">
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = totalPages <= 5 ? i + 1
                  : currentPage <= 3 ? i + 1
                  : currentPage >= totalPages - 2 ? totalPages - 4 + i
                  : currentPage - 2 + i;
                return (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`h-6 w-6 flex items-center justify-center rounded text-xs font-medium transition-colors ${
                      currentPage === p ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="h-6 w-6 flex items-center justify-center rounded hover:bg-muted disabled:opacity-30">
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="h-6 w-6 flex items-center justify-center rounded hover:bg-muted disabled:opacity-30">
                <ChevronsRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <CSVUploadDialog
        open={showUpload}
        onOpenChange={setShowUpload}
        deviceId={device.id}
        onUploadComplete={handleUploadComplete}
      />
    </>
  );
};

export default DataTableView;
