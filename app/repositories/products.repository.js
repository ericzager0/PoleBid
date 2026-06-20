import { supabase } from "../config/supabase.config.js";

export const getProductById = async (productId) => {
  const { data, error } = await supabase
    .from("productos")
    .select("*, product_states(estado)")
    .eq("identificador", productId)
    .single();

  if (error) throw error;

  return {
    ...data,
    estado: data.product_states?.estado,
    product_states: undefined,
  };
};

export const updateProductState = async (productId, estado) => {
  const { error } = await supabase
    .from("product_states")
    .update({ estado })
    .eq("identificador", productId);

  if (error) throw error;

  if (estado === "rejected_auction") {
    const { error: error2 } = await supabase
      .from("items_catalogo")
      .delete()
      .eq("producto", productId);

    if (error2) {
      console.error(error2);
      throw error2;
    }
  }

  if (estado === "scheduled_auction") {
    const { error: error3 } = await supabase
      .from("productos")
      .update({ disponible: "si" })
      .eq("identificador", productId);

    if (error3) {
      console.error(error3);
      throw error3;
    }
  }
};

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
    .select("identificador, estado, motivo_rechazo")
    .in("identificador", productIds);

  if (errorEstados) throw errorEstados;

  const estadoMap = Object.fromEntries(
    estados.map((e) => [e.identificador, e.estado]),
  );

  const motivoRechazoMap = Object.fromEntries(
    estados.map((e) => [e.identificador, e.motivo_rechazo]),
  );

  return data.map((producto) => ({
    ...producto,
    fotos: producto.fotos.map((f) => {
      let base64Real = "";

      try {
        // 1. Verificamos si viene en el formato Hex de Postgres (\x...)
        if (typeof f.foto === "string" && f.foto.startsWith("\\x")) {
          // 2. Le sacamos el \x y lo decodificamos de Hexadecimal a String normal
          const stringJson = Buffer.from(
            f.foto.replace("\\x", ""),
            "hex",
          ).toString("utf-8");

          // 3. Ese string es literalmente '{"type":"Buffer","data":[255, 216...]}'. Lo parseamos:
          const parsedData = JSON.parse(stringJson);

          // 4. Ahora sí, agarramos el array 'data' (los bytes reales) y lo pasamos a Base64 puro
          base64Real = Buffer.from(parsedData.data).toString("base64");
        } else {
          // Fallback por si la foto ya viene limpia o si arreglan el proceso de guardado en el futuro
          base64Real = Buffer.from(f.foto).toString("base64");
        }
      } catch (e) {
        console.error(
          "Error procesando imagen para el producto",
          producto.identificador,
          e,
        );
      }

      return {
        id: f.identificador,
        foto: base64Real,
      };
    }),
    estado: estadoMap[producto.identificador] ?? null,
    motivo_rechazo: motivoRechazoMap[producto.identificador] ?? null,
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
