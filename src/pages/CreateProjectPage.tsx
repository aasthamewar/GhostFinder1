import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Link2, Calendar, ArrowRight, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GhostLogo } from "@/components/GhostLogo";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [endDate, setEndDate] = useState("");
  const [createdProject, setCreatedProject] = useState<{ id: string; invite_token: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("projects")
        .insert({
          name: projectName,
          leader_id: user.id,
          repo_url: repoUrl || null,
          end_date: endDate || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Add leader as a project member
      await supabase.from("project_members").insert({
        project_id: data.id,
        user_id: user.id,
        role: "leader",
      });

      setCreatedProject({ id: data.id, invite_token: data.invite_token });
      toast.success("Project created!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const inviteLink = createdProject
    ? `${window.location.origin}/join/${createdProject.invite_token}`
    : "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (createdProject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/10 via-transparent to-transparent" />

        <motion.div
          className="relative z-10 w-full max-w-lg mx-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card variant="elevated" className="text-center">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 rounded-2xl bg-success/20 flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-success" />
              </div>
              <CardTitle className="text-2xl">Project Created!</CardTitle>
              <CardDescription>Share this link with your team members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <p className="text-sm text-muted-foreground mb-2">Invite Link</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-background p-2 rounded-lg overflow-hidden text-ellipsis">
                    {inviteLink}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  variant="hero"
                  onClick={() => navigate(`/project/${createdProject.id}/setup`)}
                >
                  Set Up Team Dependencies
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/10 via-transparent to-transparent" />

      <motion.div
        className="relative z-10 w-full max-w-lg mx-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <GhostLogo />
          </div>
          <h1 className="text-2xl font-bold mb-2">Create Your Project</h1>
          <p className="text-muted-foreground">Set up your team tracking in seconds</p>
        </div>

        <Card variant="elevated">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name *</Label>
                <div className="relative">
                  <Rocket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="projectName"
                    placeholder="My Awesome Project"
                    className="pl-10"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="repoUrl">GitHub Repository URL</Label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="repoUrl"
                    placeholder="https://github.com/user/repo"
                    className="pl-10"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Project End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="endDate"
                    type="date"
                    className="pl-10"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Create Project
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            onClick={() => navigate("/role-select")}
          >
            ← Back to role selection
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateProjectPage;
