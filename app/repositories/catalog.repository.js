import { supabase } from "../config/supabase.config.js";

export const addItem = async (idCatalogo, idProducto, precioBase, comision) => {
  const { data, error } = await supabase
    .from("itemscatalogo")
    .insert({
      catalogo: idCatalogo,
      producto: idProducto,
      preciobase: precioBase,
      comision,
    })
    .select();

  if (error) {
    console.error("Error al insertar item en catálogo:", error);
    throw error;
  }

  const { error: errorProducto } = await supabase
    .from("product_states")
    .update({ estado: "ready_auction" })
    .eq("identificador", idProducto);

  if (errorProducto) {
    console.error("Error al actualizar estado del producto:", errorProducto);
    throw errorProducto;
  }

  const { error: errorEstado } = await supabase
    .from("itemscatalogo_estados")
    .insert({
      identificador: data[0].id,
      active: false,
    });

  if (errorEstado) {
    console.error("Error al crear estado del item:", errorEstado);
    throw errorEstado;
  }
};
