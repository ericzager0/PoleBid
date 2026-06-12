import { supabase } from "../config/supabase.config.js";

export const createClient = async (
  direccion,
  documento,
  nombre,
  numeropais,
  empleadoId,
  categoria,
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

  return data;
};
