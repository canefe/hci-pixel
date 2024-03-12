import { JWT, auth } from "@colyseus/auth";

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://bevngzdbybykcvnllodu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJldm5nemRieWJ5a2N2bmxsb2R1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwODQ1MDgzMSwiZXhwIjoyMDI0MDI2ODMxfQ.GDiQDLkg6nmKTyqc30nbci4s8klemEFj3NSfw8LDBwQ"
);

/**
 * Email / Password Authentication
 */

auth.settings.onRegisterWithEmailAndPassword = async (
  email,
  password,
  options
) => {
  console.log("@colyseus/auth: onRegister =>", { email, password, ...options });

  const name = options.name || email.split("@")[0];

  return await supabase.auth.signUp({
    email: email,
    password: password,
  });
};

auth.settings.onForgotPassword = async (
  email: string,
  html: string /* , resetLink: string */
) => {
  await supabase.auth.resetPasswordForEmail(email);
};
