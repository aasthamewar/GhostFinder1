import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Ghost,
  Zap,
  Shield,
  Users,
  ArrowLeft,
  Copy,
  Check,
  Settings,
  Bell,
  Crown,
  GitCommit,
  GitPullRequest,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GhostLogo } from "@/components/GhostLogo";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  repo_url: string | null;
  start_date: string;
  end_date: string | null;
  leader_id: string;
  invite_token: string;
}

interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  status: string;
  contribution_score: number;
  dependency_id: string | null;
  profiles: {
    email: string;
    github_username: string | null;
    avatar_url: string | null;
  } | null;
}

const statusConfig = {
  active: { icon: Zap, color: "active", label: "Active", variant: "active" as const },
  stalled: { icon: Shield, color: "stalled", label: "Stalled", variant: "stalled" as const },
  ghost: { icon: Ghost, color: "ghost", label: "Ghost", variant: "ghost" as const },
};

const ProjectPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUserId(user.id);

      const { data: projectData, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) throw error;
      setProject(projectData);

      const { data: membersData } = await supabase
        .from("project_members")
        .select(`
          *,
          profiles:user_id (email, github_username, avatar_url)
        `)
        .eq("project_id", projectId);

      if (membersData) {
        setMembers(membersData);
      }
    } catch (error) {
      toast.error("Failed to load project");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = () => {
    if (!project) return;
    const link = `${window.location.origin}/join/${project.invite_token}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Invite link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const isLeader = project?.leader_id === userId;

  // Calculate stats
  const activeCount = members.filter((m) => m.status === "active").length;
  const stalledCount = members.filter((m) => m.status === "stalled").length;
  const ghostCount = members.filter((m) => m.status === "ghost").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-grid opacity-20" />

      {/* Header */}
      <header className="relative z-10 border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <GhostLogo />
          </div>
          <div className="flex items-center gap-2">
            {isLeader && (
              <>
                <Button variant="outline" size="sm" onClick={copyInviteLink}>
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied!" : "Invite Link"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(`/project/${projectId}/setup`)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            {isLeader && <Badge variant="active">Leader</Badge>}
          </div>
          <p className="text-muted-foreground">
            {project.repo_url ? (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                {project.repo_url}
              </a>
            ) : (
              "No repository linked"
            )}
          </p>
        </motion.div>

        {/* Team Health Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="default">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{members.length}</p>
                    <p className="text-xs text-muted-foreground">Team Size</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="active">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-active/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-active" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{activeCount}</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="stalled">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-stalled/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-stalled" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stalledCount}</p>
                    <p className="text-xs text-muted-foreground">Stalled</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="ghost">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-ghost/20 flex items-center justify-center">
                    <Ghost className="w-5 h-5 text-ghost" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{ghostCount}</p>
                    <p className="text-xs text-muted-foreground">Ghosts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Ghost Alert */}
        {ghostCount > 0 && isLeader && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <Card className="bg-ghost/10 border-ghost/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-ghost/20 flex items-center justify-center animate-pulse">
                    <Ghost className="w-6 h-6 text-ghost" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-ghost">Ghost Alert!</h3>
                    <p className="text-sm text-muted-foreground">
                      {ghostCount} team member{ghostCount > 1 ? "s are" : " is"} inactive without a blocker
                    </p>
                  </div>
                  <Button variant="ghost_status">
                    <Bell className="w-4 h-4 mr-2" />
                    Nudge Ghosts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Team Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4">Team Members</h2>
          <div className="grid gap-4">
            {members.map((member, index) => {
              const status = (member.status as keyof typeof statusConfig) || "active";
              const config = statusConfig[status];
              const StatusIcon = config.icon;

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                >
                  <Card variant="elevated">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-semibold">
                              {member.profiles?.email?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div
                              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-${config.color} flex items-center justify-center`}
                            >
                              <StatusIcon className="w-3 h-3 text-background" />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">
                                {member.profiles?.github_username || member.profiles?.email}
                              </p>
                              {member.role === "leader" && (
                                <Crown className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {member.profiles?.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Activity indicators */}
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <div className="flex items-center gap-1" title="Commits">
                              <GitCommit className="w-4 h-4" />
                              <span className="text-sm">-</span>
                            </div>
                            <div className="flex items-center gap-1" title="PRs">
                              <GitPullRequest className="w-4 h-4" />
                              <span className="text-sm">-</span>
                            </div>
                            <div className="flex items-center gap-1" title="Reviews">
                              <Eye className="w-4 h-4" />
                              <span className="text-sm">-</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold">{member.contribution_score}</p>
                            <p className="text-xs text-muted-foreground">Score</p>
                          </div>

                          <Badge variant={config.variant}>{config.label}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProjectPage;
