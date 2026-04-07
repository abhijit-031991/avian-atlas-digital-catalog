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
  <span className="relative flex h-2 w-2 mr-2">
    <span className="animate-ping absolute h-full w-full rounded-full bg-cyan-500 opacity-75" />
    <span className="relative rounded-full h-2 w-2 bg-cyan-500" />
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
      <header className="h-[52px] bg-background border-b border-border flex items-center px-6 shrink-0 z-50">
        {/* Logo */}
        <button
          onClick={() => navigate('/arctrack-central')}
          className="flex items-center gap-1 mr-8 hover:opacity-80 transition-opacity"
        >
          <span className="text-sky-600 dark:text-[#00d4ff] font-semibold text-base tracking-tight">Arc</span>
          <span className="text-foreground font-semibold text-base tracking-tight">Track</span>
        </button>

        {/* Live indicator */}
        <div className="flex items-center mr-8">
          <LiveDot />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-1 flex-1">
          {NAV_LINKS.map(({ label, icon: Icon, route }) => (
            <button
              key={route}
              onClick={() => navigate(route)}
              className={[
                'flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors',
                isActive(route)
                  ? 'text-sky-600 dark:text-[#00d4ff] bg-sky-50 dark:bg-[#00d4ff0d] border-b-2 border-sky-600 dark:border-[#00d4ff] rounded-b-none'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              ].join(' ')}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </nav>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors mr-2"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark'
            ? <Sun className="h-4 w-4" />
            : <Moon className="h-4 w-4" />
          }
        </button>

        {/* Avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <div className="h-6 w-6 rounded-full bg-muted border border-border flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-sky-600 dark:text-[#00d4ff]" />
              </div>
              <span className="max-w-[140px] truncate text-xs">
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
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppShell;
