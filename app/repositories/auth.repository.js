//REPOSITORY - For auth process
import { supabase } from "../config/supabase.config.js";

export const findOnboardingByEmail = async (email) => {
  const { data, error } = await supabase
    .from("onboardings")
    .select("email, status")
    .eq("email", email);

  return { data, error };
};
