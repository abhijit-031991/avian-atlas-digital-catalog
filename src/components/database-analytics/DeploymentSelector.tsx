import React, { useState } from 'react';
import { Layers, ChevronDown, X, Settings2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDeployments } from '@/hooks/useDeployments';
import { Deployment, DeploymentRange } from '@/types/deployments';
import { DeviceInfo } from '@/types/database-analytics';
import ManageDeploymentsDialog from './ManageDeploymentsDialog';

interface Props {
  device: DeviceInfo;
  selected: Deployment | null;
  onSelect: (deployment: Deployment | null, range: DeploymentRange | null) => void;
}

const DeploymentSelector = ({ device, selected, onSelect }: Props) => {
  const { deployments, loading } = useDeployments(device.id);
  const [popoverOpen, setPopoverOpen]   = useState(false);
  const [manageOpen, setManageOpen]     = useState(false);

  const handleSelect = (d: Deployment | null) => {
    setPopoverOpen(false);
    if (!d) {
      onSelect(null, null);
      return;
    }
    const range: DeploymentRange = {
      start: parseISO(d.startDate),
      end:   d.endDate ? parseISO(d.endDate) : new Date(),
    };
    onSelect(d, range);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null, null);
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        <Layers className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />

        {selected ? (
          /* Active deployment pill */
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/25 text-xs font-medium text-primary">
            <span className="max-w-[160px] truncate">{selected.name}</span>
            <span className="text-primary/50 font-mono text-[10px]">
              {format(parseISO(selected.startDate), 'dd/MM/yy')}
              {' – '}
              {selected.endDate ? format(parseISO(selected.endDate), 'dd/MM/yy') : 'ongoing'}
            </span>
            <button
              onClick={handleClear}
              className="ml-0.5 rounded hover:bg-primary/20 p-0.5 transition-colors"
              title="Clear deployment filter"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          /* Dropdown trigger */
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                <span>Deployment</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-1">
              {loading ? (
                <div className="px-3 py-4 text-xs text-muted-foreground text-center">Loading…</div>
              ) : deployments.length === 0 ? (
                <div className="px-3 py-4 text-xs text-muted-foreground text-center">
                  No deployments yet.
                </div>
              ) : (
                <div className="space-y-0.5">
                  {deployments.map(d => (
                    <button
                      key={d.id}
                      onClick={() => handleSelect(d)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-muted/60 transition-colors group"
                    >
                      <p className="text-sm font-medium text-foreground truncate">{d.name}</p>
                      <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                        {format(parseISO(d.startDate), 'dd MMM yy')}
                        {' → '}
                        {d.endDate
                          ? format(parseISO(d.endDate), 'dd MMM yy')
                          : <span className="text-emerald-500">Ongoing</span>
                        }
                      </p>
                    </button>
                  ))}
                </div>
              )}
              {/* Manage link */}
              <div className="border-t border-border mt-1 pt-1">
                <button
                  onClick={() => { setPopoverOpen(false); setManageOpen(true); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  Manage deployments…
                </button>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Settings button when a deployment is active */}
        {selected && (
          <button
            onClick={() => setManageOpen(true)}
            className="p-1 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
            title="Manage deployments"
          >
            <Settings2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <ManageDeploymentsDialog
        open={manageOpen}
        onOpenChange={setManageOpen}
        device={device}
      />
    </>
  );
};

export default DeploymentSelector;
