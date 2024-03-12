import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://bevngzdbybykcvnllodu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJldm5nemRieWJ5a2N2bmxsb2R1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwODQ1MDgzMSwiZXhwIjoyMDI0MDI2ODMxfQ.GDiQDLkg6nmKTyqc30nbci4s8klemEFj3NSfw8LDBwQ",
  { db: { schema: "game" } }
);
