import { motion } from "framer-motion";
import { Ghost, Zap, Shield, Users, GitBranch, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GhostLogo } from "@/components/GhostLogo";
import { useNavigate } from "react-router-dom";

const FloatingGhost = ({ delay, x, y }: { delay: number; x: string; y: string }) => (
  <motion.div
    className="absolute opacity-10"
    style={{ left: x, top: y }}
    animate={{
      y: [0, -20, 0],
      opacity: [0.05, 0.15, 0.05],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <Ghost className="w-16 h-16 text-ghost" />
  </motion.div>
);

const features = [
  {
    icon: GitBranch,
    title: "Dependency Mapping",
    description: "Define who depends on whom. Know who's really blocked.",
  },
  {
    icon: AlertTriangle,
    title: "Ghost Detection",
    description: "Automatically flag inactive members who aren't waiting on anyone.",
  },
  {
    icon: Shield,
    title: "Fairness Scoring",
    description: "Contribution scores that account for blockers and dependencies.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-primary/10 via-transparent to-transparent" />
      
      {/* Floating ghosts */}
      <FloatingGhost delay={0} x="10%" y="20%" />
      <FloatingGhost delay={1} x="80%" y="30%" />
      <FloatingGhost delay={2} x="70%" y="70%" />
      <FloatingGhost delay={3} x="20%" y="60%" />

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <GhostLogo />
          <Button variant="outline" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border mb-8">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Track contributions fairly</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Stop project ghosting with{" "}
            <span className="text-gradient-primary">dependency-aware</span>{" "}
            tracking
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Know who's really working, who's blocked, and who's ghosting. 
            Fair contribution scores that understand team dependencies.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button variant="hero" size="xl" onClick={() => navigate("/auth")}>
              <Users className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
            <Button variant="outline" size="xl" onClick={() => navigate("/auth")}>
              View Demo
            </Button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 pb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group p-6 rounded-2xl bg-card/50 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Status Preview */}
        <motion.div
          className="max-w-3xl mx-auto pb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="p-8 rounded-2xl bg-card border border-border">
            <h3 className="text-lg font-semibold mb-6 text-center">Live Status Preview</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-active/10 border border-active/30 text-center">
                <div className="w-10 h-10 rounded-full bg-active/20 mx-auto mb-3 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-active" />
                </div>
                <p className="font-semibold text-active">Active</p>
                <p className="text-xs text-muted-foreground mt-1">Committing regularly</p>
              </div>
              <div className="p-4 rounded-xl bg-stalled/10 border border-stalled/30 text-center">
                <div className="w-10 h-10 rounded-full bg-stalled/20 mx-auto mb-3 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-stalled" />
                </div>
                <p className="font-semibold text-stalled">Stalled</p>
                <p className="text-xs text-muted-foreground mt-1">Waiting on blocker</p>
              </div>
              <div className="p-4 rounded-xl bg-ghost/10 border border-ghost/30 text-center">
                <div className="w-10 h-10 rounded-full bg-ghost/20 mx-auto mb-3 flex items-center justify-center">
                  <Ghost className="w-5 h-5 text-ghost" />
                </div>
                <p className="font-semibold text-ghost">Ghost</p>
                <p className="text-xs text-muted-foreground mt-1">MIA without excuse</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 GhostBuster. Stop ghosting, start shipping.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
