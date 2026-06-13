import { supabase } from "../config/supabase.config.js";

export const getProducts = async (clientId) => {
  const { data, error } = await supabase
    .from("productos")
    .select(
      `
      *,
      fotos (
        identificador,
        foto
      )
    `,
    )
    .eq("duenio", clientId);

  if (error) throw error;

  const productIds = data.map((p) => p.identificador);

  const { data: estados, error: errorEstados } = await supabase
    .from("product_states")
    .select("identificador, estado")
    .in("identificador", productIds);

  if (errorEstados) throw errorEstados;

  const estadoMap = Object.fromEntries(
    estados.map((e) => [e.identificador, e.estado]),
  );

  return data.map((producto) => ({
    ...producto,
    fotos: producto.fotos.map((f) => ({
      id: f.identificador,
      foto: Buffer.from(f.foto).toString("base64"),
    })),
    estado: estadoMap[producto.identificador] ?? null,
  }));
};

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
      fecha: new Date().toISOString(),
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
