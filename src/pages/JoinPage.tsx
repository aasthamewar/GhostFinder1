import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, ArrowRight, Loader2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GhostLogo } from "@/components/GhostLogo";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const JoinPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState(token || "");
  const [project, setProject] = useState<{ id: string; name: string } | null>(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    if (token) {
      validateToken(token);
    }
  }, [token]);

  const validateToken = async (code: string) => {
    if (!code) return;
    setValidating(true);
    
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name")
        .eq("invite_token", code)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setProject(data);
      } else {
        toast.error("Invalid invite code");
        setProject(null);
      }
    } catch (error) {
      toast.error("Failed to validate code");
    } finally {
      setValidating(false);
    }
  };

  const handleJoin = async () => {
    if (!project) return;
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check if already a member
      const { data: existing } = await supabase
        .from("project_members")
        .select("id")
        .eq("project_id", project.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        toast.info("You're already a member of this project");
        navigate("/dashboard");
        return;
      }

      const { error } = await supabase.from("project_members").insert({
        project_id: project.id,
        user_id: user.id,
        role: "member",
      });

      if (error) throw error;

      toast.success(`Joined ${project.name}!`);
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to join project");
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold mb-2">Join a Project</h1>
          <p className="text-muted-foreground">Enter your invite code to join your team</p>
        </div>

        <Card variant="elevated">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="inviteCode">Invite Code</Label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="inviteCode"
                  placeholder="Paste your invite code"
                  className="pl-10"
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value);
                    setProject(null);
                  }}
                  onBlur={() => validateToken(inviteCode)}
                />
              </div>
            </div>

            {validating && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Validating...</span>
              </div>
            )}

            {project && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-active/10 border border-active/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-active/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-active" />
                  </div>
                  <div>
                    <p className="font-semibold">{project.name}</p>
                    <p className="text-xs text-muted-foreground">Ready to join</p>
                  </div>
                </div>
              </motion.div>
            )}

            <Button
              variant="hero"
              className="w-full"
              size="lg"
              disabled={!project || loading}
              onClick={handleJoin}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Join Project
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
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

export default JoinPage;
