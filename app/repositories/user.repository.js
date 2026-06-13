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
        categoria,
        numeropais
      ),
      cliente_id
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) return null;

  const { data: persona, error: error2 } = await supabase
    .from("personas")
    .select("direccion, documento")
    .eq("identificador", data.cliente_id)
    .maybeSingle();

  if (error2) {
    throw error2;
  }

  return {
    id: data.id,
    email: data.email,
    firstName: data.onboarding_documents?.first_name ?? null,
    lastName: data.onboarding_documents?.last_name ?? null,
    categoria: data.clientes?.categoria ?? null,
    numeropais: data.clientes?.numeropais ?? null,
    clientId: data.cliente_id,
    documento: persona?.documento ?? null,
    direccion: persona?.direccion ?? null,
  };
};

export const approveAsSeller = async (clientId, empleadoId) => {
  const { data, error } = await supabase
    .from("duenios")
    .insert({ identificador: clientId, verificador: empleadoId });
};
