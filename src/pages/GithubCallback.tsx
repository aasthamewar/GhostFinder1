// import { useEffect } from "react";
// import { supabase } from "@/integrations/supabase/client";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// const GithubCallback = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const syncProfile = async () => {
//       const { data } = await supabase.auth.getUser();
//       const user = data.user;

//       if (!user) {
//         navigate("/auth");
//         return;
//       }

//       const githubIdentity = user.identities?.find(
//         (i) => i.provider === "github"
//       );

//       if (!githubIdentity) {
//         toast.error("GitHub not linked");
//         return;
//       }

//       await supabase
//         .from("profiles")
//         .update({
//           github_username: githubIdentity.identity_data?.user_name,
//           avatar_url: githubIdentity.identity_data?.avatar_url,
//         })
//         .eq("id", user.id);

//       toast.success("GitHub connected!");
//       // Step 2: Enforce GitHub immediately after login
//       const { data: profile } = await supabase
//         .from("profiles")
//         .select("github_username")
//         .eq("id", user.id)
//         .single();

//       if (!profile?.github_username) {
//         navigate("/connect-github");
//         return;
//       }

//       navigate("/role-select");
//     };

//     syncProfile();
//   }, [navigate]);

//   return null;
// };

// export default GithubCallback;


import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const GithubCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const syncProfile = async () => {
      // ✅ Use getSession (more reliable after OAuth)
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        navigate("/auth");
        return;
      }

      // ✅ Find GitHub identity
      const githubIdentity = user.identities?.find(
        (i) => i.provider === "github"
      );

      if (!githubIdentity) {
        toast.error("GitHub not linked");
        navigate("/connect-github");
        return;
      }

      // ✅ FIX: use UPSERT instead of update
      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          github_username: githubIdentity.identity_data?.user_name,
          avatar_url: githubIdentity.identity_data?.avatar_url,
        });

      if (upsertError) {
        console.error("Profile upsert error:", upsertError);
        toast.error("Failed to save profile");
        return;
      }

      toast.success("GitHub connected!");

      // ✅ Fetch profile safely
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("github_username")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        navigate("/connect-github");
        return;
      }

      if (!profile?.github_username) {
        navigate("/connect-github");
        return;
      }

      // ✅ Final redirect
      navigate("/role-select");
    };

    syncProfile();
  }, [navigate]);

  // ✅ Better UX than null
  return <h2>Connecting GitHub... ⏳</h2>;
};

export default GithubCallback;