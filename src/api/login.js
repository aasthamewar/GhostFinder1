export default async function handler(req, res) {
  try {
    const { email, password } = req.body;

    const response = await fetch("SUPABASE_AUTH_URL", {
      method: "POST",
      headers: {
        apikey: process.env.SUPABASE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}