import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/useProjects';
import { useDeployments } from '@/hooks/useDeployments';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Smartphone, ChevronDown, ChevronRight, Plus, FolderPlus,
  Layers, Trash2, CalendarRange,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { DeviceInfo } from '@/types/database-analytics';
import { Deployment, DeploymentRange } from '@/types/deployments';
import ManageDeploymentsDialog from './ManageDeploymentsDialog';

// ── Cycling accent palette (mirrors ProjectsUsersDevices) ─────────────────────

const PROJECT_ACCENTS = [
  { leftBorder: 'border-l-sky-500',     badge: 'bg-sky-500/10 text-sky-400 border border-sky-500/20' },
  { leftBorder: 'border-l-amber-500',   badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  { leftBorder: 'border-l-violet-500',  badge: 'bg-violet-500/10 text-violet-400 border border-violet-500/20' },
  { leftBorder: 'border-l-emerald-500', badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  { leftBorder: 'border-l-rose-500',    badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/20' },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface DeviceSelectorProps {
  selectedDevice:     DeviceInfo | null;
  selectedDeployment: Deployment | null;
  onDeviceSelect:     (device: DeviceInfo) => void;
  onDeploymentSelect: (device: DeviceInfo, deployment: Deployment | null, range: DeploymentRange | null) => void;
}

// ── Deployment row ────────────────────────────────────────────────────────────

const DeploymentItem = ({
  deployment,
  isActive,
  onSelect,
  onDelete,
}: {
  deployment: Deployment;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const start = parseISO(deployment.startDate);
  const end   = deployment.endDate ? parseISO(deployment.endDate) : null;

  return (
    <>
      <div
        className={[
          'group flex items-center gap-1.5 pl-6 pr-1.5 py-1 rounded text-xs transition-colors cursor-pointer',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
        ].join(' ')}
        onClick={onSelect}
      >
        {/* Tree line + icon */}
        <span className="text-muted-foreground/30 shrink-0">└</span>
        <Layers className={`h-3 w-3 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground/50'}`} />

        {/* Name + date range */}
        <div className="flex-1 min-w-0">
          <p className={`font-medium truncate leading-tight ${isActive ? 'text-primary' : ''}`}>
            {deployment.name}
          </p>
          <p className="text-[9px] font-mono text-muted-foreground/50 leading-tight">
            {format(start, 'dd/MM/yy')}
            {' → '}
            {end ? format(end, 'dd/MM/yy') : <span className="text-emerald-500">now</span>}
          </p>
        </div>

        {/* Delete button — visible on hover */}
        <button
          onClick={e => { e.stopPropagation(); setConfirmOpen(true); }}
          className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-all"
          title="Delete deployment"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete deployment?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deployment.name}" will be permanently deleted. The underlying data is unaffected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={onDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// ── Device row (has its own deployments subscription) ─────────────────────────

const DeviceRow = ({
  deviceId,
  projectName,
  isSelected,
  selectedDeployment,
  onDeviceSelect,
  onDeploymentSelect,
}: {
  deviceId:           string;
  projectName:        string;
  isSelected:         boolean;
  selectedDeployment: Deployment | null;
  onDeviceSelect:     (device: DeviceInfo) => void;
  onDeploymentSelect: (device: DeviceInfo, deployment: Deployment | null, range: DeploymentRange | null) => void;
}) => {
  const [manageOpen, setManageOpen] = useState(false);
  const deviceInfo: DeviceInfo = { id: deviceId, name: `Device ${deviceId}`, projectName };
  const { deployments, deleteDeployment } = useDeployments(deviceId);

  const handleDeploymentClick = (d: Deployment) => {
    const range: DeploymentRange = {
      start: parseISO(d.startDate),
      end:   d.endDate ? parseISO(d.endDate) : new Date(),
    };
    // Select device first if needed, then apply deployment
    onDeviceSelect(deviceInfo);
    onDeploymentSelect(deviceInfo, d, range);
  };

  const handleDeviceClick = () => {
    onDeviceSelect(deviceInfo);
    onDeploymentSelect(deviceInfo, null, null); // clear deployment when clicking device directly
  };

  return (
    <>
      {/* Device row */}
      <div
        className={[
          'group flex items-center gap-2.5 px-3 py-2 rounded-xl mx-1 text-xs transition-all cursor-pointer',
          isSelected
            ? 'bg-primary/15 text-primary'
            : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
        ].join(' ')}
      >
        {/* Main clickable area */}
        <button
          className="flex items-center gap-1.5 flex-1 min-w-0 text-left"
          onClick={handleDeviceClick}
        >
          <Smartphone className="h-3 w-3 shrink-0" />
          <span className="font-mono truncate">{deviceId}</span>
        </button>

        {/* Deployment count badge (when not selected and has deployments) */}
        {!isSelected && deployments.length > 0 && (
          <span className="text-[9px] px-1 py-0.5 rounded bg-muted font-mono text-muted-foreground shrink-0">
            {deployments.length}
          </span>
        )}

        {/* Add deployment button */}
        <button
          onClick={e => { e.stopPropagation(); setManageOpen(true); }}
          className={[
            'shrink-0 p-0.5 rounded transition-all',
            isSelected
              ? 'opacity-60 hover:opacity-100 hover:bg-primary/10 text-primary'
              : 'opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:bg-muted text-muted-foreground',
          ].join(' ')}
          title="Add / manage deployments"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      {/* Deployment tree — shown when device is selected and has deployments */}
      {isSelected && deployments.length > 0 && (
        <div className="mt-0.5 space-y-0.5">
          {deployments.map(d => (
            <DeploymentItem
              key={d.id}
              deployment={d}
              isActive={selectedDeployment?.id === d.id}
              onSelect={() => handleDeploymentClick(d)}
              onDelete={() => deleteDeployment(d.id)}
            />
          ))}
        </div>
      )}

      {/* Prompt to add first deployment when device is selected but has none */}
      {isSelected && deployments.length === 0 && (
        <button
          onClick={() => setManageOpen(true)}
          className="w-full flex items-center gap-1.5 pl-6 py-1 text-[10px] text-muted-foreground/40 hover:text-muted-foreground transition-colors"
        >
          <CalendarRange className="h-3 w-3" />
          Add deployment…
        </button>
      )}

      <ManageDeploymentsDialog
        open={manageOpen}
        onOpenChange={setManageOpen}
        device={deviceInfo}
      />
    </>
  );
};

// ── Main selector ─────────────────────────────────────────────────────────────

const DeviceSelector = ({
  selectedDevice,
  selectedDeployment,
  onDeviceSelect,
  onDeploymentSelect,
}: DeviceSelectorProps) => {
  const { currentUser } = useAuth();
  const { projects, loading } = useProjects(currentUser);
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  if (loading) {
    return (
      <div className="p-4 space-y-3 animate-pulse">
        <div className="h-5 bg-muted rounded w-3/4" />
        {[1, 2, 3].map(i => <div key={i} className="h-14 bg-muted rounded" />)}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-4 text-center py-10">
        <FolderPlus className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
        <p className="text-xs font-medium text-muted-foreground mb-1">No Projects Found</p>
        <p className="text-xs text-muted-foreground/60 mb-4">Create a project and add devices to get started</p>
        <Button size="sm" onClick={() => navigate('/projects-users-devices')} variant="outline" className="text-xs">
          <Plus className="h-3 w-3 mr-1" />
          Go to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-2">
      {projects.map((project, idx) => {
        const deviceIds  = Object.keys(project.devices || {});
        const isExpanded = expandedProjects.includes(project.id);
        const accent     = PROJECT_ACCENTS[idx % PROJECT_ACCENTS.length];

        return (
          <div key={project.id} className={`rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden ${accent.leftBorder}`}>
            <Collapsible>
              <CollapsibleTrigger className="w-full" onClick={() => toggleProject(project.id)}>
                <div className="px-4 py-3 flex items-center justify-between hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    {isExpanded
                      ? <ChevronDown  className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    }
                    <span className="text-sm font-medium text-foreground truncate text-left">
                      {project.name}
                    </span>
                  </div>
                  {/* Accent chip for device count */}
                  <span className={`shrink-0 ml-2 rounded-full text-[10px] font-semibold px-2 py-0.5 min-w-[20px] text-center ${accent.badge}`}>
                    {deviceIds.length}
                  </span>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="border-t border-border/50 px-2 pb-2 pt-1">
                  {deviceIds.length === 0 ? (
                    <p className="text-xs text-muted-foreground/60 text-center py-3">No devices</p>
                  ) : (
                    <div className="space-y-0.5">
                      {deviceIds.map(deviceId => (
                        <DeviceRow
                          key={deviceId}
                          deviceId={deviceId}
                          projectName={project.name}
                          isSelected={selectedDevice?.id === deviceId}
                          selectedDeployment={selectedDevice?.id === deviceId ? selectedDeployment : null}
                          onDeviceSelect={onDeviceSelect}
                          onDeploymentSelect={onDeploymentSelect}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        );
      })}
    </div>
  );
};

export default DeviceSelector;
