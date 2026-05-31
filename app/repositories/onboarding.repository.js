import { supabase } from "../config/supabase.config.js";

export const getOnboardingByEmail = async (email) => {
  const { data, error } = await supabase
    .from("onboardings")
    .select("id, email, status, code, password")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ?? null;
};

export const getOnboardingById = async (id) => {
  const { data, error } = await supabase
    .from("onboardings")
    .select("id, email, status, code")
    .eq("id", id)
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

export const saveDocuments = async (onboardingId, documentData) => {
  const { error } = await supabase.from("onboarding_documents").insert({
    id: onboardingId,
    first_name: documentData.firstName,
    last_name: documentData.lastName,
    country_id: documentData.country,
    address: documentData.address,
    document_front: documentData.document_front_url,
    document_back: documentData.document_back_url,
  });

  if (error) {
    console.log("Error al guardar documentos en la base de datos:", error);
    throw error;
  }
};

export const completeOnboarding = async (email, password) => {
  const { data, error } = await supabase
    .from("onboardings")
    .update({
      status: "registered",
      password: password,
    })
    .eq("email", email)
    .select();

  if (error) {
    throw new Error(`Error al actualizar onboarding: ${error.message}`);
  }

  return data;
};
