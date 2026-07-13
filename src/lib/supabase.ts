import { createClient } from "@supabase/supabase-js";

// Public project values (anon key is a public, RLS-protected key — safe to ship).
// Env vars override them when present, e.g. to point at another environment.
const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://uhhjnszgxfwmddvxdafj.supabase.co";
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoaGpuc3pneGZ3bWRkdnhkYWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMzk4NjUsImV4cCI6MjA5MDcxNTg2NX0.jPpX-py9XJf_-vZkMrcE6sVPtzBP-QP-n269N43eOIs";

// Public browser client — access is gated by Supabase Row-Level Security.
export const supabase = createClient(url, anonKey);
