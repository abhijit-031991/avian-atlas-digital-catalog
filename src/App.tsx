
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AppShell from "@/components/AppShell";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ArcTrackCentral from "./pages/ArcTrackCentral";
import TrackingConsole from "./pages/TrackingConsole";
import DatabaseAnalytics from "./pages/DatabaseAnalytics";
import ProjectsUsersDevices from "./pages/ProjectsUsersDevices";
import MyArcTrack from "./pages/MyArcTrack";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />

            {/* Authenticated routes — wrapped in AppShell */}
            <Route element={<AppShell />}>
              <Route path="/arctrack-central" element={<ArcTrackCentral />} />
              <Route path="/tracking-console" element={<TrackingConsole />} />
              <Route path="/database-analytics" element={<DatabaseAnalytics />} />
              <Route path="/projects-users-devices" element={<ProjectsUsersDevices />} />
              <Route path="/my-arctrack" element={<MyArcTrack />} />
              {/* Redirect old /my-account to /my-arctrack */}
              <Route path="/my-account" element={<Navigate to="/my-arctrack" replace />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
