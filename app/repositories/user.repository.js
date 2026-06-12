import { supabase } from "../config/supabase.config.js";

export const getUserById = async (id) => {
  const { data, error } = await supabase
    .from("onboardings")
    .select(
      `
      id,
      email,
      onboarding_documents (
        first_name,
        last_name
      ),
      clientes (
        categoria
      )
    `,
    )
    .eq("id", id)
    .maybeSingle();

  console.log("error - data:", error);

  if (error) {
    throw error;
  }

  if (!data) return null;

  return {
    id: data.id,
    email: data.email,
    firstName: data.onboarding_documents?.first_name ?? null,
    lastName: data.onboarding_documents?.last_name ?? null,
    categoria: data.clientes?.categoria ?? null,
  };
};
