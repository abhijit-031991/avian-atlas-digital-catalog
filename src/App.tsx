
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import MyAccount from "./pages/MyAccount";
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
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/arctrack-central" element={<ArcTrackCentral />} />
            <Route path="/tracking-console" element={<TrackingConsole />} />
            <Route path="/database-analytics" element={<DatabaseAnalytics />} />
            <Route path="/projects-users-devices" element={<ProjectsUsersDevices />} />
            <Route path="/my-arctrack" element={<MyArcTrack />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
