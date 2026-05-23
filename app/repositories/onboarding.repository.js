// REPOSITORY - Onboarding
import { supabase } from "../config/supabase.config.js";

/**
 * Busca un onboarding por email.
 * Retorna { id, email, status } si existe, o null si no existe.
 */
export const findOnboardingByEmail = async (email) => {
  const { data, error } = await supabase
    .from("onboardings")
    .select("id, email, status")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
};
