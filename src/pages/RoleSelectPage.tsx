import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GhostLogo } from "@/components/GhostLogo";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const RoleSelectPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      
      // Check if user already has projects
      const { data: projects } = await supabase
        .from("projects")
        .select("id")
        .eq("leader_id", session.user.id)
        .limit(1);

      const { data: memberships } = await supabase
        .from("project_members")
        .select("id")
        .eq("user_id", session.user.id)
        .limit(1);

      if ((projects && projects.length > 0) || (memberships && memberships.length > 0)) {
        navigate("/dashboard");
        return;
      }

      setLoading(false);
    };

    checkSession();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/10 via-transparent to-transparent" />

      <motion.div
        className="relative z-10 w-full max-w-2xl mx-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <GhostLogo />
          </div>
          <h1 className="text-3xl font-bold mb-3">Choose Your Role</h1>
          <p className="text-muted-foreground">How will you be using GhostBuster?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card
              variant="elevated"
              className="cursor-pointer group h-full"
              onClick={() => navigate("/create-project")}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <Crown className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-3">Create a Project</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  You're the team lead. Set up your project, define dependencies, and track your team.
                </p>
                <Button variant="hero" className="w-full group-hover:shadow-lg">
                  Start as Leader
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card
              variant="elevated"
              className="cursor-pointer group h-full"
              onClick={() => navigate("/join")}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/80 transition-colors">
                  <Users className="w-8 h-8 text-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-3">Join a Project</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  You have an invite link. Join your team and start contributing.
                </p>
                <Button variant="outline" className="w-full">
                  Join as Member
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={async () => {
              await supabase.auth.signOut();
              toast.success("Signed out");
              navigate("/");
            }}
          >
            Sign out
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelectPage;
