import { supabase } from "../config/supabase.config.js";

export const createClient = async (
  direccion,
  documento,
  nombre,
  numeropais,
  empleadoId,
  categoria,
  onboardingId,
) => {
  const { data: persona, error: error1 } = await supabase
    .from("personas")
    .insert({ direccion, documento, nombre, estado: "activo" })
    .select("identificador, direccion, documento, nombre")
    .maybeSingle();

  if (error1) {
    throw error1;
  }

  if (!persona) {
    throw new Error("No se pudo crear la persona");
  }

  const { data, error } = await supabase
    .from("clientes")
    .insert({
      identificador: persona.identificador,
      numeropais,
      categoria,
      verificador: empleadoId,
    })
    .select("identificador")
    .maybeSingle();

  if (error) {
    throw error;
  }

  const { error: error2 } = await supabase
    .from("onboardings")
    .update({ cliente_id: persona.identificador })
    .eq("id", onboardingId);

  if (error2) {
    throw error2;
  }

  return data;
};
