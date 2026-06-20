import { supabase } from "../config/supabase.config.js";

export const addItem = async (idCatalogo, idProducto, precioBase, comision) => {
  const { data, error } = await supabase.from("itemscatalogo").insert({
    catalogo: idCatalogo,
    producto: idProducto,
    preciobase: precioBase,
    comision,
  });

  if (error) {
    console.log(error);
    throw error;
  }

  const { data: producto, error: errorProducto } = await supabase
    .from("product_states")
    .update({ estado: "ready_auction" })
    .eq("identificador", idProducto);

  if (errorProducto) {
    console.log(errorProducto);
    throw errorProducto;
  }
};
