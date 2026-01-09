import React from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Github } from 'lucide-react';

const ConnectGithub = () => {
  const connectGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/github-callback`,
        scopes: "read:user repo"
      },
    });

    if (error) {
      toast.error("GitHub connection failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-cyan-500/10 via-transparent to-transparent blur-3xl" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="text-center mb-8">
          {/* Logo placeholder - replace with your GhostLogo component */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Github className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Connect Your GitHub
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md mx-auto">
            Link your GitHub account so we can track your real contributions and keep you accountable.
          </p>
        </div>

        {/* Main CTA Card */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8 shadow-2xl">
          <button
            onClick={connectGithub}
            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
          >
            <Github className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
            Connect GitHub
          </button>

          {/* Helper text */}
          <p className="text-slate-500 text-sm text-center mt-4 leading-relaxed">
            Takes less than 10 seconds · You can disconnect anytime
          </p>
        </div>

        {/* Additional info */}
        <div className="mt-6 text-center">
          <p className="text-slate-600 text-sm">
            We only request read access to your public contributions
          </p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl" />
    </div>
  );
}
export default ConnectGithub