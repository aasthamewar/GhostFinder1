import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Ghost,
  Zap,
  Shield,
  Users,
  Plus,
  LogOut,
  Crown,
  AlertTriangle,
  Activity,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GhostLogo } from "@/components/GhostLogo";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  repo_url: string | null;
  start_date: string;
  end_date: string | null;
  //leader_id: string;
  invite_token: string;
}

interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  status: string;
  contribution_score: number;
  dependency_id: string | null;  // Add this field
  profiles: {
    email: string;
    github_username: string | null;
    avatar_url: string | null;
  } | null;
}

const statusConfig = {
  active: { icon: Zap, color: "active", label: "Active" },
  stalled: { icon: Shield, color: "stalled", label: "Stalled" },
  ghost: { icon: Ghost, color: "ghost", label: "Ghost" },
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [memberships, setMemberships] = useState<ProjectMember[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLeader, setIsLeader] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // ----- ADDING THIS IF SOMEONE DIDN'T ADDED THEIR GITHUB ACCOUNT ------

  

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Step 4: Block /dashboard as safety net
       const { data: profile } = await supabase
      .from("profiles")
      .select("github_username")
      .eq("id", user.id)
      .single();

    if (!profile?.github_username) {
      navigate("/connect-github");
      return;
    }
      setUserId(user.id);

      // --------- NEW FETCH UPDATED ---------------
      // 1️⃣ Get membership (single project assumption)
    const { data: membership, error: membershipError } = await supabase
      .from("project_members")
      .select(`
        *,
        
        projects (
          id,
          name,
          repo_url,
          start_date,
          end_date,
          invite_token,
          leader_id
        ),
        profiles:user_id (
          email,
          github_username,
          avatar_url
        )
      `)
      .eq("user_id", user.id)
      //.single(); 
      .limit(1)
      .maybeSingle();


    if (membershipError || !membership) {
      toast.error("You are not part of any project");
      navigate("/role-select");
      return;
    }

    // 2️⃣ Set role clearly
    setMemberships([membership]);
    setProjects([membership.projects]);
    setIsLeader(membership.role === "leader");

  } catch (err) {
    toast.error("Failed to load dashboard");
  } finally {
    setLoading(false);
  }
};

      // Fetch projects where user is leader
  //     const { data: leaderProjects } = await supabase
  //       .from("projects")
  //       .select("*")
  //       .eq("leader_id", user.id);

  //     // Fetch projects where user is member
  //     const { data: memberData } = await supabase
  //       .from("project_members")
  //       .select(`
  //         *,
  //         profiles:user_id (email, github_username, avatar_url)
  //       `)
  //       .eq("user_id", user.id);

  //     if (leaderProjects && leaderProjects.length > 0) {
  //       setProjects(leaderProjects);
  //       setIsLeader(true);
  //     }

  //     if (memberData) {
  //       setMemberships(memberData);
        
  //       // If not a leader, fetch the projects they're members of
  //       if (!leaderProjects || leaderProjects.length === 0) {
  //         const projectIds = memberData.map((m) => m.project_id);
  //         const { data: memberProjects } = await supabase
  //           .from("projects")
  //           .select("*")
  //           .in("id", projectIds);
  //         if (memberProjects) {
  //           setProjects(memberProjects);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     toast.error("Failed to load dashboard");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Member's personal view
  // const myMembership = memberships.find((m) => m.user_id === userId);
  const myMembership = memberships[0];
  const status = (myMembership?.status as keyof typeof statusConfig) || "active";
  const StatusIcon = statusConfig[status]?.icon || Zap;
  const projectId = projects[0]?.id;   // ✅ ADD THIS LINE HERE
  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-primary/5 via-transparent to-transparent" />

      {/* Header */}
      <header className="relative z-10 border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <GhostLogo />
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/create-project")}>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            {isLeader ? "Team Dashboard" : "Your Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {isLeader
              ? "Monitor your team's activity and catch ghosts"
              : "Track your contributions and stay visible"}
          </p>
        </motion.div>
        
        {/* Projects Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="gradient" className="h-fullcursor-pointer hover:scale-[1.02] transition"
            /* ADDED CLICK ACTION BUTTON-> ACTIVITY*/
            
            onClick={() => {
              if (!projectId) {
                toast.error("Project not found");
                return;
              }
              navigate(`/activity/${projectId}`);
            }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Your Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-${statusConfig[status]?.color}/20 flex items-center justify-center`}>
                    <StatusIcon className={`w-6 h-6 text-${statusConfig[status]?.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{statusConfig[status]?.label}</p>
                    <p className="text-sm font-semibold text-foreground">Click to view activity</p>
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
            <Card variant="gradient" className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Contribution Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{myMembership?.contribution_score || 50}</p>
                    <p className="text-sm text-muted-foreground">Out of 100</p>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                    style={{ width: `${myMembership?.contribution_score || 50}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="gradient" className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <Activity className="w-6 h-6 text-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{projects.length}</p>
                    <p className="text-sm text-muted-foreground">Total projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Projects List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
          
          {projects.length === 0 ? (
            <Card variant="default" className="p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No projects yet</p>
              <div className="flex justify-center gap-3">
                <Button variant="hero" onClick={() => navigate("/create-project")}>
                  Create Project
                </Button>
                <Button variant="outline" onClick={() => navigate("/join")}>
                  Join Project
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  variant="elevated"
                  className="cursor-pointer hover:border-primary/50"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        {/* i have change "project.leader_id === userId" with isLeader */}
                          {isLeader  ? (
                            <Crown className="w-6 h-6 text-primary" />
                          ) : (
                            <Users className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {/* i have change "project.leader_id === userId" with isLeader */}
                            {isLeader ? "You're the leader" : "Team member"} 
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* i have change "project.leader_id === userId" with isLeader */}
                        {isLeader && (
                          <Badge variant="active">Leader</Badge>
                        )}
                        {project.end_date && (
                          <Badge variant="outline">
                            Due {new Date(project.end_date).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions for Members */}
        {!isLeader && myMembership && myMembership.dependency_id !== null &&(
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card variant="stalled">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-stalled/20 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-stalled" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Report a Blocker</h3>
                      <p className="text-sm text-muted-foreground">
                        Let your team know you're waiting on someone
                      </p>
                    </div>
                  </div>
                  <Button variant="stalled_status">
                    I Am Blocked
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
