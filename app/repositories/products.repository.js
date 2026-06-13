import { supabase } from "../config/supabase.config.js";

export const addProduct = async (
  clientId,
  descripcioncatalogo,
  descripcioncompleta,
  buffer1,
  buffer2,
  buffer3,
  buffer4,
  buffer5,
  buffer6,
) => {
  const { data, error } = await supabase
    .from("productos")
    .insert({
      descripcioncatalogo,
      descripcioncompleta,
      disponible: "no",
      revisor: 2,
      duenio: clientId,
    })
    .select("identificador")
    .single();

  if (error) {
    console.log(error);
    throw error;
  }

  const productoId = data.identificador;

  const fotos = [buffer1, buffer2, buffer3, buffer4, buffer5, buffer6]
    .filter(Boolean)
    .map((buffer) => ({
      foto: buffer,
      producto: productoId,
    }));

  if (fotos.length === 0) return;

  const { error: error2 } = await supabase.from("fotos").insert(fotos);

  if (error2) {
    console.log(error2);
    throw error2;
  }

  const { error: error3 } = await supabase
    .from("product_states")
    .insert({ identificador: productoId, estado: "pending_approval" });

  if (error3) {
    console.log(error3);
    throw error3;
  }
};
