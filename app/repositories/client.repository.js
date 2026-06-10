import { supabase } from "../config/supabase.config.js";

export const createClient = async (direccion, documento, nombre, numeropais, empleadoId, categoria) => {
  const { persona, error1 } = await supabase
    .from("personas")
    .insert({ direccion, documento, nombre, estado: "sin_medio_pago" })
    .select("identificador, direccion, documento, nombre")
    .maybeSingle();

  if (error1) {
    throw error1;
  }

  const { data, error } = await supabase
    .from("clientes")
    .insert({ identificador: persona.identificador, numeropais, categoria, verificador: empleadoId })
    .select("identificador, direccion, documento, nombre")
    .maybeSingle();

    if (error) {
        throw error;
    }
};