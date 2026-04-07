import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  FolderKanban, Users, Smartphone, Trash2, UserPlus, Plus, Search,
  MoreHorizontal, MapPin, Loader2, Radio, Battery, Clock,
} from 'lucide-react';
import CreateProjectDialog from '@/components/CreateProjectDialog';
import JoinProjectDialog from '@/components/JoinProjectDialog';
import AddUserSheet from '@/components/projects/AddUserSheet';
import RemoveUserDialog from '@/components/RemoveUserDialog';
import AddDeviceDialog from '@/components/AddDeviceDialog';
import RemoveDeviceDialog from '@/components/RemoveDeviceDialog';
import DeleteProjectDialog from '@/components/DeleteProjectDialog';
import { useProjects } from '@/hooks/useProjects';
import { useUserNames } from '@/hooks/useUserNames';
import { useDeviceStatuses } from '@/hooks/useDeviceStatuses';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  uuid: string;
  users: string[];
  devices: { [key: string]: unknown };
}

interface Device {
  id: string;
  name: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatLastSeen(ts?: number): string {
  if (!ts) return 'Never';
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function StatusDot({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <span className="relative flex h-2 w-2 shrink-0">
      <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
    </span>
  ) : (
    <span className="h-2 w-2 rounded-full bg-muted-foreground/30 shrink-0" />
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

const ProjectsUsersDevices = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectDevices, setProjectDevices] = useState<Device[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const currentFetchRef = useRef<string | null>(null);

  const [userSearch, setUserSearch] = useState('');
  const [deviceSearch, setDeviceSearch] = useState('');

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [addUserSheetOpen, setAddUserSheetOpen] = useState(false);
  const [removeUserDialogOpen, setRemoveUserDialogOpen] = useState(false);
  const [addDeviceDialogOpen, setAddDeviceDialogOpen] = useState(false);
  const [removeDeviceDialogOpen, setRemoveDeviceDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const [creatingProject, setCreatingProject] = useState(false);
  const [userToRemove, setUserToRemove] = useState<string | null>(null);
  const [deviceToRemove, setDeviceToRemove] = useState<{ id: string; name: string } | null>(null);
  const [removingUser, setRemovingUser] = useState(false);
  const [removingDevice, setRemovingDevice] = useState(false);

  const {
    projects, loading, error,
    createProject, joinProject, removeUser, deleteProject,
    addDevice, removeDevice, getDeviceDetails, refetch,
  } = useProjects(currentUser);

  const projectUserIds = useMemo(() => selectedProject?.users || [], [selectedProject?.users]);
  const { userNames, loading: loadingUserNames } = useUserNames(projectUserIds);

  const deviceIds = useMemo(() => {
    if (!selectedProject?.devices) return [];
    return Object.keys(selectedProject.devices);
  }, [selectedProject?.devices]);

  const deviceIdsString = deviceIds.join(',');
  const deviceStatuses = useDeviceStatuses(deviceIds);

  useEffect(() => {
    const fetchDevices = async () => {
      if (!selectedProject || deviceIds.length === 0) {
        setProjectDevices([]);
        currentFetchRef.current = null;
        return;
      }
      const fetchId = `${selectedProject.id}-${deviceIdsString}`;
      if (currentFetchRef.current === fetchId) return;
      currentFetchRef.current = fetchId;
      setLoadingDevices(true);
      try {
        const results = await Promise.all(
          deviceIds.map(async (id) => {
            try { const d = await getDeviceDetails(id); return d || { id, name: `Device ${id}` }; }
            catch { return { id, name: `Device ${id}` }; }
          })
        );
        if (currentFetchRef.current === fetchId) setProjectDevices(results);
      } catch {
        if (currentFetchRef.current === fetchId) setProjectDevices([]);
      } finally {
        if (currentFetchRef.current === fetchId) setLoadingDevices(false);
      }
    };
    fetchDevices();
  }, [selectedProject?.id, deviceIdsString]);

  if (!currentUser) { navigate('/auth'); return null; }

  const isOwner = (project: Project) => project.uuid === currentUser.uid;

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleCreateProject = async (name: string, description: string) => {
    setCreatingProject(true);
    try { await createProject(name, description); setCreateDialogOpen(false); }
    catch {/* handled by hook */} finally { setCreatingProject(false); }
  };

  const handleJoinProject = async (passkey: string) => {
    try { await joinProject(passkey); setJoinDialogOpen(false); }
    catch {/* handled by hook */}
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      if (selectedProject?.id === projectId) setSelectedProject(null);
    } catch {/* handled by hook */}
  };

  const handleRemoveUserConfirm = async () => {
    if (!selectedProject || !userToRemove) return;
    setRemovingUser(true);
    try {
      await removeUser(selectedProject.id, userToRemove);
      setUserToRemove(null);
      setRemoveUserDialogOpen(false);
      await refetch();
    } catch {/* handled by hook */} finally { setRemovingUser(false); }
  };

  const handleAddDevice = async (deviceId: string, deviceName: string, passkey: string) => {
    if (!selectedProject) return;
    try {
      await addDevice(deviceId, deviceName, passkey, selectedProject.id);
      setAddDeviceDialogOpen(false);
      await refetch();
    } catch {/* handled by hook */}
  };

  const handleRemoveDeviceConfirm = async () => {
    if (!selectedProject || !deviceToRemove) return;
    setRemovingDevice(true);
    try {
      await removeDevice(deviceToRemove.id, selectedProject.id);
      setDeviceToRemove(null);
      setRemoveDeviceDialogOpen(false);
      await refetch();
    } catch {/* handled by hook */} finally { setRemovingDevice(false); }
  };

  // ── Filtered lists ─────────────────────────────────────────────────────────

  const filteredUsers = useMemo(() => {
    if (!selectedProject?.users) return [];
    const q = userSearch.toLowerCase();
    return selectedProject.users.filter((uid) => (userNames[uid] || uid).toLowerCase().includes(q));
  }, [selectedProject?.users, userNames, userSearch]);

  const filteredDevices = useMemo(() => {
    const q = deviceSearch.toLowerCase();
    return projectDevices.filter(
      (d) => d.name.toLowerCase().includes(q) || d.id.toLowerCase().includes(q)
    );
  }, [projectDevices, deviceSearch]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-[calc(100vh-52px)] bg-background flex">

      {/* ── Left sidebar ────────────────────────────────────────────────── */}
      <aside className="w-72 bg-background border-r border-border flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Projects</span>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => setCreateDialogOpen(true)}
              className="h-7 px-2 text-xs text-primary hover:bg-primary/5 hover:text-primary">
              <Plus className="h-3 w-3 mr-1" />New
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setJoinDialogOpen(true)}
              className="h-7 px-2 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground">
              Join
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {loading ? (
            <div className="px-4 py-6 text-center text-muted-foreground/60 text-sm flex flex-col items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />Loading...
            </div>
          ) : error ? (
            <div className="px-4 py-4 text-center text-red-400 text-xs">{error}</div>
          ) : projects.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <FolderKanban className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground/60">No projects yet</p>
            </div>
          ) : (
            projects.map((project) => {
              const selected = selectedProject?.id === project.id;
              const owner = isOwner(project);
              return (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={[
                    'w-full text-left px-4 py-3 border-b border-border transition-colors group',
                    selected ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-muted/50',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium truncate ${selected ? 'text-primary' : 'text-foreground'}`}>
                      {project.name}
                    </p>
                    {owner && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setProjectToDelete(project); setDeleteDialogOpen(true); }}
                        className="opacity-0 group-hover:opacity-100 h-5 w-5 flex items-center justify-center rounded text-muted-foreground/60 hover:text-red-400 hover:bg-destructive/10 transition-all"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground/60">
                      {project.users.length} user{project.users.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-muted-foreground/60">·</span>
                    <span className="text-xs text-muted-foreground/60">
                      {Object.keys(project.devices || {}).length} device{Object.keys(project.devices || {}).length !== 1 ? 's' : ''}
                    </span>
                    {owner
                      ? <span className="ml-auto text-[10px] font-mono text-primary bg-primary/5 px-1.5 py-0.5 rounded">Owner</span>
                      : <span className="ml-auto text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Member</span>
                    }
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {!selectedProject ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <FolderKanban className="h-14 w-14 text-muted-foreground/20 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">Select a Project</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              Choose a project from the left panel to view and manage its details.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5 max-w-5xl">

            {/* ── Project header ─────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-foreground">{selectedProject.name}</h1>
                {selectedProject.description && (
                  <p className="text-sm text-muted-foreground mt-0.5">{selectedProject.description}</p>
                )}
              </div>
              {isOwner(selectedProject) && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => { setProjectToDelete(selectedProject); setDeleteDialogOpen(true); }}
                  className="shrink-0 text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Delete Project
                </Button>
              )}
            </div>

            {/* ── Meta row ───────────────────────────────────────────────── */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-card border border-border rounded-lg px-3 py-2.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Project ID</p>
                <p className="text-xs font-mono text-primary truncate">{selectedProject.id}</p>
              </div>
              <div className="bg-card border border-border rounded-lg px-3 py-2.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Created</p>
                <p className="text-xs text-foreground">
                  {new Date(selectedProject.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg px-3 py-2.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Your Role</p>
                <p className={`text-xs font-semibold ${isOwner(selectedProject) ? 'text-primary' : 'text-muted-foreground'}`}>
                  {isOwner(selectedProject) ? 'Owner' : 'Member'}
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg px-3 py-2.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Active Devices</p>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {deviceIds.filter(id => deviceStatuses[id]?.isActive).length} / {deviceIds.length}
                </p>
              </div>
            </div>

            {/* ── Users + Devices side by side ───────────────────────────── */}
            <div className="grid grid-cols-2 gap-5">

              {/* Users panel */}
              <section className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                      Users
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {selectedProject.users.length}
                    </span>
                  </div>
                  {isOwner(selectedProject) && (
                    <Button size="sm" onClick={() => setAddUserSheetOpen(true)}
                      className="h-7 px-2.5 text-xs font-semibold">
                      <UserPlus className="h-3 w-3 mr-1" />Add User
                    </Button>
                  )}
                </div>

                <div className="px-3 py-2 border-b border-border shrink-0">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
                    <Input
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-8 h-7 text-xs"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto max-h-80">
                  {loadingUserNames ? (
                    <div className="py-8 text-center text-muted-foreground/60 text-xs flex flex-col items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />Loading...
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground/60 text-xs">No users found</div>
                  ) : (
                    filteredUsers.map((userId) => {
                      const isProjectOwner = userId === selectedProject.uuid;
                      const isMe = userId === currentUser.uid;
                      const name = userNames[userId] || userId;
                      return (
                        <div key={userId}
                          className="flex items-center gap-3 px-4 py-2.5 border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                        >
                          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <span className="text-xs text-muted-foreground font-semibold uppercase">{name[0] || '?'}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">
                              {name}{isMe && <span className="text-muted-foreground font-normal ml-1">(you)</span>}
                            </p>
                            <p className="text-[10px] font-mono text-muted-foreground/60 truncate">{userId}</p>
                          </div>
                          {isProjectOwner
                            ? <span className="text-[10px] font-mono text-primary bg-primary/5 border border-primary/15 px-1.5 py-0.5 rounded shrink-0">Owner</span>
                            : <span className="text-[10px] font-mono text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded shrink-0">Member</span>
                          }
                          {isOwner(selectedProject) && !isProjectOwner && !isMe && (
                            <button
                              onClick={() => { setUserToRemove(userId); setRemoveUserDialogOpen(true); }}
                              className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground/40 hover:text-red-500 hover:bg-destructive/10 transition-colors shrink-0"
                              title="Remove user"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </section>

              {/* Devices panel */}
              <section className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                      Devices
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {Object.keys(selectedProject.devices || {}).length}
                    </span>
                  </div>
                  {isOwner(selectedProject) && (
                    <Button size="sm" onClick={() => setAddDeviceDialogOpen(true)}
                      className="h-7 px-2.5 text-xs font-semibold">
                      <Plus className="h-3 w-3 mr-1" />Add Device
                    </Button>
                  )}
                </div>

                <div className="px-3 py-2 border-b border-border shrink-0">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
                    <Input
                      placeholder="Search devices..."
                      value={deviceSearch}
                      onChange={(e) => setDeviceSearch(e.target.value)}
                      className="pl-8 h-7 text-xs"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto max-h-80">
                  {loadingDevices ? (
                    <div className="py-8 text-center text-muted-foreground/60 text-xs flex flex-col items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />Loading...
                    </div>
                  ) : filteredDevices.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground/60 text-xs">No devices found</div>
                  ) : (
                    filteredDevices.map((device) => {
                      const status = deviceStatuses[device.id];
                      return (
                        <div key={device.id}
                          className="flex items-center gap-3 px-4 py-2.5 border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                        >
                          <div className="h-7 w-7 rounded bg-muted flex items-center justify-center shrink-0">
                            <Radio className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">{device.name}</p>
                            <p className="text-[10px] font-mono text-muted-foreground/60 truncate">{device.id}</p>
                          </div>

                          {/* Live status */}
                          <div className="flex items-center gap-2 shrink-0 text-[10px] text-muted-foreground font-mono">
                            <StatusDot isActive={status?.isActive ?? false} />
                            {status?.battery != null && (
                              <span className="flex items-center gap-0.5">
                                <Battery className="h-3 w-3" />{status.battery}%
                              </span>
                            )}
                            <span className="flex items-center gap-0.5">
                              <Clock className="h-3 w-3" />{formatLastSeen(status?.lastContact)}
                            </span>
                          </div>

                          {isOwner(selectedProject) && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground/40 hover:text-foreground hover:bg-muted transition-colors shrink-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem onClick={() => navigate('/tracking-console')} className="cursor-pointer text-xs">
                                  <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />View on Map
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => { setDeviceToRemove({ id: device.id, name: device.name }); setRemoveDeviceDialogOpen(true); }}
                                  className="text-destructive hover:text-destructive focus:text-destructive cursor-pointer text-xs"
                                >
                                  <Trash2 className="h-3.5 w-3.5 mr-2" />Remove Device
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      {/* ── Dialogs / Sheets ─────────────────────────────────────────────── */}
      <CreateProjectDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onCreateProject={handleCreateProject} loading={creatingProject} />
      <JoinProjectDialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen} onJoinProject={handleJoinProject} />
      <AddUserSheet open={addUserSheetOpen} onOpenChange={setAddUserSheetOpen} projectId={selectedProject?.id || ''} devices={deviceIds} />
      <RemoveUserDialog open={removeUserDialogOpen} onOpenChange={setRemoveUserDialogOpen} onConfirm={handleRemoveUserConfirm} userName={userToRemove ? (userNames[userToRemove] || userToRemove) : ''} projectName={selectedProject?.name || ''} />
      <AddDeviceDialog open={addDeviceDialogOpen} onOpenChange={setAddDeviceDialogOpen} onAddDevice={handleAddDevice} projectId={selectedProject?.id || ''} />
      <RemoveDeviceDialog open={removeDeviceDialogOpen} onOpenChange={setRemoveDeviceDialogOpen} onConfirm={handleRemoveDeviceConfirm} deviceId={deviceToRemove?.id || ''} deviceName={deviceToRemove?.name || ''} />
      <DeleteProjectDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={async () => { if (projectToDelete) await handleDeleteProject(projectToDelete.id); setProjectToDelete(null); }}
        projectName={projectToDelete?.name || ''}
      />
    </div>
  );
};

export default ProjectsUsersDevices;
