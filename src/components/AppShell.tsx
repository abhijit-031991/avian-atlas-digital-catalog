import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Monitor, Database, FolderKanban, User, LogOut, ChevronDown, Sun, Moon } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Tracking', icon: Monitor, route: '/tracking-console' },
  { label: 'Analytics', icon: Database, route: '/database-analytics' },
  { label: 'Projects', icon: FolderKanban, route: '/projects-users-devices' },
];

const LiveDot = () => (
  <span className="relative flex h-2 w-2 shrink-0">
    <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-500 opacity-75" />
    <span className="relative rounded-full h-2 w-2 bg-emerald-500" />
  </span>
);

const AppShell: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (route: string) => location.pathname === route;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Nav Bar */}
      <header className="h-[52px] bg-slate-50 dark:bg-background border-b border-border flex items-center px-6 shrink-0 z-50 relative shadow-[0_1px_4px_0_rgba(0,0,0,0.08)] dark:shadow-[0_1px_6px_0_rgba(0,0,0,0.4)]">
        {/* Logo — left */}
        <button
          onClick={() => navigate('/arctrack-central')}
          className="flex items-center gap-1 hover:opacity-80 transition-opacity shrink-0"
        >
          <span className="text-sky-600 dark:text-[#00d4ff] font-semibold text-base tracking-tight">Arc</span>
          <span className="text-foreground font-semibold text-base tracking-tight">Track Central</span>
        </button>

        {/* Nav links — absolutely centred, MD3 pill style */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-0.5">
          {NAV_LINKS.map(({ label, icon: Icon, route }) => (
            <button
              key={route}
              onClick={() => navigate(route)}
              className={[
                'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all',
                isActive(route)
                  ? 'bg-sky-100 dark:bg-[#00d4ff15] text-sky-700 dark:text-[#00d4ff]'
                  : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-muted hover:text-foreground',
              ].join(' ')}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </nav>

        {/* Right group — Live · theme toggle · avatar */}
        <div className="ml-auto flex items-center gap-1.5">

          {/* Live indicator — MD3 tonal chip */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <LiveDot />
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Live</span>
          </div>

          {/* Theme toggle — MD3 circular icon button */}
          <button
            onClick={toggleTheme}
            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-slate-100 dark:hover:bg-muted hover:text-foreground transition-all"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark'
              ? <Sun className="h-4 w-4" />
              : <Moon className="h-4 w-4" />
            }
          </button>

          {/* Avatar dropdown — MD3 tonal button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:bg-slate-100 dark:hover:bg-muted hover:text-foreground transition-all">
                <div className="h-6 w-6 rounded-full bg-sky-100 dark:bg-[#00d4ff15] border border-sky-200 dark:border-[#00d4ff30] flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-sky-600 dark:text-[#00d4ff]" />
                </div>
                <span className="max-w-[140px] truncate text-xs font-medium">
                  {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Account'}
                </span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
              </div>
              <DropdownMenuItem onClick={() => navigate('/my-arctrack')} className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                My Account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppShell;
