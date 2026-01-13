// // Follow this setup guide to integrate the Deno language server with your editor:
// // https://deno.land/manual/getting_started/setup_your_environment
// // This enables autocomplete, go to definition, etc.

// // Setup type definitions for built-in Supabase Runtime APIs
// import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// console.log("Hello from Functions!")

// Deno.serve(async (req) => {
//   const { name } = await req.json()
//   const data = {
//     message: `Hello ${name}!`,
//   }

//   return new Response(
//     JSON.stringify(data),
//     { headers: { "Content-Type": "application/json" } },
//   )
// })

// /* To invoke locally:

//   1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
//   2. Make an HTTP request:

//   curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/github-activity' \
//     --header 'Authorization: Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImI4MTI2OWYxLTIxZDgtNGYyZS1iNzE5LWMyMjQwYTg0MGQ5MCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjIwODMzNDEwOTF9.6Lf8tpJ0LU_uagrwp4huBBbK7-lQewZYmTb0jA1p8KvJUo6F6OrH75fE8LDme_HUNe5ttwgOn0Ajbh5kJM6gSA' \
//     --header 'Content-Type: application/json' \
//     --data '{"name":"Functions"}'

// */
//import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Octokit } from "npm:octokit";

serve(async (req: Request) => {
  try {
    const { repoOwner, repoName, username } = await req.json();

    if (!repoOwner || !repoName || !username) {
      return new Response(
        JSON.stringify({ error: "Missing parameters" }),
        { status: 400 }
      );
    }

    const token = Deno.env.get("GITHUB_TOKEN");
    if (!token) {
      return new Response(
        JSON.stringify({ error: "GitHub token not configured" }),
        { status: 500 }
      );
    }

    const octokit = new Octokit({ auth: token });

    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/commits",
      {
        owner: repoOwner,
        repo: repoName,
        author: username,
        per_page: 50,
      }
    );

    return new Response(
      JSON.stringify({
        username,
        commits: data.length,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
});
