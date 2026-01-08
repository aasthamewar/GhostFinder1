import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Plus, Trash2, ArrowRight, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GhostLogo } from "@/components/GhostLogo";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProjectMember {
  id: string;
  user_id: string;
  dependency_id: string | null;
  profiles: {
    email: string;
    github_username: string | null;
  } | null;
}

const ProjectSetupPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [dependencies, setDependencies] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("project_members")
        .select(`
          id,
          user_id,
          dependency_id,
          profiles:user_id (email, github_username)
        `)
        .eq("project_id", projectId);

      if (error) throw error;

      if (data) {
        setMembers(data);
        const deps: Record<string, string | null> = {};
        data.forEach((m) => {
          deps[m.id] = m.dependency_id;
        });
        setDependencies(deps);
      }
    } catch (error) {
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [memberId, dependencyId] of Object.entries(dependencies)) {
        await supabase
          .from("project_members")
          .update({ dependency_id: dependencyId || null })
          .eq("id", memberId);
      }
      toast.success("Dependencies saved!");
      navigate(`/project/${projectId}`);
    } catch (error) {
      toast.error("Failed to save dependencies");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-grid opacity-20" />

      {/* Header */}
      <header className="relative z-10 border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/project/${projectId}`)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <GhostLogo />
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Team Dependencies</h1>
          <p className="text-muted-foreground">
            Define who depends on whom. Members waiting on inactive dependencies are marked as "Stalled" instead of "Ghost".
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Map
              </CardTitle>
              <CardDescription>
                Set each member's dependency (who they're waiting on)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {members.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No team members yet</p>
                  <p className="text-sm">Share your invite link to add members</p>
                </div>
              ) : (
                members.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 border border-border"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        {member.profiles?.github_username || member.profiles?.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {member.profiles?.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-muted-foreground whitespace-nowrap">
                        Depends on:
                      </Label>
                      <Select
                        value={dependencies[member.id] || "none"}
                        onValueChange={(value) =>
                          setDependencies((prev) => ({
                            ...prev,
                            [member.id]: value === "none" ? null : value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select dependency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None (Independent)</SelectItem>
                          {members
                            .filter((m) => m.id !== member.id)
                            .map((m) => (
                              <SelectItem key={m.id} value={m.id}>
                                {m.profiles?.github_username || m.profiles?.email}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                ))
              )}

              {members.length > 0 && (
                <Button
                  variant="hero"
                  className="w-full mt-6"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Dependencies
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default ProjectSetupPage;
