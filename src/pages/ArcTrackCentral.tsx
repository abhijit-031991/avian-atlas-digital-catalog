import React, { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import { useLiveStats } from '@/hooks/useLiveStats';
import { Monitor, Database, FolderKanban, ArrowRight, Satellite, Radio } from 'lucide-react';


function getGreeting(name: string): string {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return `${greeting}, ${name}`;
}

const ArcTrackCentral = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { projects } = useProjects(currentUser);
  const stats = useLiveStats();

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  const displayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'there';

  const collaboratorCount = useMemo(() => {
    const uids = new Set<string>();
    projects.forEach((p) => {
      if (p.users) p.users.forEach((uid) => { if (uid !== currentUser.uid) uids.add(uid); });
    });
    return uids.size;
  }, [projects, currentUser.uid]);

  const sections = [
    {
      title: 'Tracking Console',
      description: 'Real-time device positions on a live satellite map.',
      icon: Monitor,
      route: '/tracking-console',
      meta: 'Live positions streamed via ArcTrack Servers',
    },
    {
      title: 'Database & Analytics',
      description: 'Explore historical telemetry, tables, and playback.',
      icon: Database,
      route: '/database-analytics',
      meta: stats.loading ? 'Loading...' : `${stats.totalDevices} device${stats.totalDevices !== 1 ? 's' : ''} provisioned`,
    },
    {
      title: 'Projects-Users-Devices',
      description: 'Manage projects, collaborators, and device provisioning.',
      icon: FolderKanban,
      route: '/projects-users-devices',
      meta: `${projects.length} project${projects.length !== 1 ? 's' : ''} · ${collaboratorCount} collaborator${collaboratorCount !== 1 ? 's' : ''}`,
    },
  ];

  const statItems = [
    { label: 'Total Devices',  value: stats.loading ? '—' : stats.totalDevices,     icon: Satellite,    color: 'text-sky-600 dark:text-[#00d4ff]' },
    { label: 'Base Stations',  value: stats.loading ? '—' : stats.baseStationCount, icon: Radio,        color: 'text-violet-500 dark:text-violet-400' },
    { label: 'Total Projects', value: projects.length,                               icon: FolderKanban, color: 'text-amber-500 dark:text-amber-400' },
  ];

  return (
    <div className="min-h-[calc(100vh-52px)] bg-background px-6 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">
            {getGreeting(displayName)}
          </h1>
        </div>

        {/* Live stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {statItems.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-card border-[2.5px] border-border rounded-lg px-4 py-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
              <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-lg font-semibold text-foreground font-mono">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Section cards */}
        <div className="flex flex-col gap-3">
          {sections.map(({ title, description, icon: Icon, route, meta }) => (
            <button
              key={route}
              onClick={() => navigate(route)}
              className="group w-full text-left bg-card border-[2.5px] border-border rounded-lg px-5 py-4 flex items-center gap-4
                         shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)]
                         hover:border-sky-300 dark:hover:border-[#00d4ff55]
                         hover:bg-sky-50/50 dark:hover:bg-[#161d2e]
                         hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_0_0_1px_#00d4ff22,0_4px_24px_#00d4ff18]
                         transition-all duration-200"
            >
              <div className="h-10 w-10 rounded bg-muted border border-border flex items-center justify-center shrink-0
                              group-hover:border-sky-300 dark:group-hover:border-[#00d4ff33]
                              group-hover:bg-sky-50 dark:group-hover:bg-[#00d4ff0d] transition-colors">
                <Icon className="h-5 w-5 text-sky-600 dark:text-[#00d4ff]" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground tracking-wide uppercase">
                  {title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                <p className="text-xs text-muted-foreground/60 mt-1 font-mono">{meta}</p>
              </div>

              <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-sky-600 dark:group-hover:text-[#00d4ff] group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArcTrackCentral;
