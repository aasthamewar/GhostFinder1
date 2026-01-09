import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const GithubCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const syncProfile = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        navigate("/auth");
        return;
      }

      const githubIdentity = user.identities?.find(
        (i) => i.provider === "github"
      );

      if (!githubIdentity) {
        toast.error("GitHub not linked");
        return;
      }

      await supabase
        .from("profiles")
        .update({
          github_username: githubIdentity.identity_data?.user_name,
          avatar_url: githubIdentity.identity_data?.avatar_url,
        })
        .eq("id", user.id);

      toast.success("GitHub connected!");
      // Step 2: Enforce GitHub immediately after login
      const { data: profile } = await supabase
        .from("profiles")
        .select("github_username")
        .eq("id", user.id)
        .single();

      if (!profile?.github_username) {
        navigate("/connect-github");
        return;
      }

      navigate("/role-select");
    };

    syncProfile();
  }, [navigate]);

  return null;
};

export default GithubCallback;
