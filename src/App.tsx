import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import RoleSelectPage from "./pages/RoleSelectPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import JoinPage from "./pages/JoinPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectPage from "./pages/ProjectPage";
import ProjectSetupPage from "./pages/ProjectSetupPage";
import NotFound from "./pages/NotFound";
import ConnectGitHub from "./pages/ConnectGithub";
import GithubCallback from "./pages/GithubCallback";
import ActivityPage from "./pages/ActivityPage";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/connect-github" element={<ConnectGitHub />} />
          <Route path="/github-callback" element={<GithubCallback />} />
          <Route path="/role-select" element={<RoleSelectPage />} />
          <Route path="/create-project" element={<CreateProjectPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/join/:token" element={<JoinPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/activity/:projectId" element={<ActivityPage />} />
          <Route path="/project/:projectId" element={<ProjectPage />} />
          <Route path="/project/:projectId/setup" element={<ProjectSetupPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
