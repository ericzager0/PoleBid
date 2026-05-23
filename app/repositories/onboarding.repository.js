import { supabase } from "../config/supabase.config.js";

export const getOnboardingByEmail = async (email) => {
  const { data, error } = await supabase
    .from("onboardings")
    .select("id, email, status, code")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ?? null;
};

export const createOnboarding = async (email, code) => {
  const { data, error } = await supabase
    .from("onboardings")
    .insert({ email, status: "pending", code })
    .select("id, email, status, code")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

export const updateOnboardingStatus = async (email, status) => {
  const { data, error } = await supabase
    .from("onboardings")
    .update({ status })
    .eq("email", email)
    .select("id, email, status, code")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};
