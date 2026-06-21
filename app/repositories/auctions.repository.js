import { supabase } from "../config/supabase.config.js";

export const getProductInfo = async (productId) => {
  // 1. Producto + 1 sola foto (limitamos el embed a 1 registro)
  const { data, error } = await supabase
    .from("productos")
    .select(
      `
      descripcioncatalogo,
      descripcioncompleta,
      fotos (
        identificador,
        foto
      )
    `,
    )
    .eq("identificador", productId)
    .limit(1, { foreignTable: "fotos" })
    .single();

  if (error) throw error;

  // 2. preciobase y comision viven en itemscatalogo (a lo sumo 1 por producto)
  const { data: item, error: errorItem } = await supabase
    .from("itemscatalogo")
    .select("preciobase, comision")
    .eq("producto", productId)
    .maybeSingle();

  if (errorItem) throw errorItem;

  // 3. precioFinal viene de registrodesubasta (se completa solo si el producto ya fue subastado)
  const { data: registro, error: errorRegistro } = await supabase
    .from("registrodesubasta")
    .select("importe")
    .eq("producto", productId)
    .maybeSingle();

  if (errorRegistro) throw errorRegistro;

  // 4. Procesamos la foto (si existe) al mismo formato base64 que el endpoint original
  const fotoRow = data.fotos?.[0];
  let fotoBase64 = null;

  if (fotoRow) {
    try {
      if (typeof fotoRow.foto === "string" && fotoRow.foto.startsWith("\\x")) {
        const stringJson = Buffer.from(
          fotoRow.foto.replace("\\x", ""),
          "hex",
        ).toString("utf-8");

        const parsedData = JSON.parse(stringJson);
        fotoBase64 = Buffer.from(parsedData.data).toString("base64");
      } else {
        fotoBase64 = Buffer.from(fotoRow.foto).toString("base64");
      }
    } catch (e) {
      console.error("Error procesando imagen para el producto", productId, e);
    }
  }

  return {
    descripcioncatalogo: data.descripcioncatalogo,
    descripcioncompleta: data.descripcioncompleta,
    // preciobase y comision solo se incluyen si existe un itemscatalogo asociado
    ...(item?.preciobase != null ? { precioBase: item.preciobase } : {}),
    ...(item?.comision != null ? { comision: item.comision } : {}),
    precioFinal: registro?.importe ?? null,
    fotos: fotoBase64,
  };
};

export const getPujosByItemId = async (itemId) => {
  // 1. Buscar las pujas del item
  const { data: pujos, error: pujosError } = await supabase
    .from("pujos")
    .select("identificador, asistente, importe, ganador")
    .eq("item", itemId);

  if (pujosError) {
    console.error("Error buscando pujas:", pujosError);
    throw pujosError;
  }

  if (!pujos?.length) {
    return [];
  }

  const identificadores = pujos.map((p) => p.identificador);
  const asistenteIds = [...new Set(pujos.map((p) => p.asistente))];

  // 2. Timestamps y asistentes no dependen entre sí, van en paralelo
  const [
    { data: timestamps, error: timestampsError },
    { data: asistentes, error: asistentesError },
  ] = await Promise.all([
    supabase
      .from("pujos_timestamp")
      .select("identificador, created_at")
      .in("identificador", identificadores),
    supabase
      .from("asistentes")
      .select("identificador, cliente")
      .in("identificador", asistenteIds),
  ]);

  if (timestampsError) {
    console.error("Error buscando timestamps:", timestampsError);
    throw timestampsError;
  }
  if (asistentesError) {
    console.error("Error buscando asistentes:", asistentesError);
    throw asistentesError;
  }

  // 3. Clientes sí depende de los asistentes (necesito sus cliente_id primero)
  const clienteIds = [...new Set(asistentes.map((a) => a.cliente))];

  const { data: clientes, error: clientesError } = await supabase
    .from("clientes")
    .select("identificador, categoria")
    .in("identificador", clienteIds);

  if (clientesError) {
    console.error("Error buscando clientes:", clientesError);
    throw clientesError;
  }

  // 4. Mapas de lookup
  const timestampMap = new Map(
    timestamps.map((t) => [t.identificador, t.created_at]),
  );
  const clientePorAsistente = new Map(
    asistentes.map((a) => [a.identificador, a.cliente]),
  );
  const categoriaPorCliente = new Map(
    clientes.map((c) => [c.identificador, c.categoria]),
  );

  // 5. Combinar todo por puja
  const result = pujos.map((p) => {
    const clienteId = clientePorAsistente.get(p.asistente);
    return {
      identificador: p.identificador,
      created_at: timestampMap.get(p.identificador) ?? null,
      asistente: p.asistente,
      importe: p.importe,
      ganador: p.ganador,
      clientId: clienteId ?? null,
      categoria: categoriaPorCliente.get(clienteId) ?? null,
    };
  });

  // 6. Ordenar de más reciente a más antiguo
  result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return result;
};

export const placeBid = async (auctionId, itemId, asistenteId, amount) => {
  const { data, error } = await supabase
    .from("pujos")
    .insert({
      asistente: asistenteId,
      item: itemId,
      importe: amount,
      ganador: "no",
    })
    .select("identificador")
    .single();

  if (error) {
    console.error("Error placing bid:", error);
    throw error;
  }

  const { error: timestampError } = await supabase
    .from("pujos_timestamp")
    .insert({
      identificador: data.identificador,
    });

  if (timestampError) {
    console.error("Error insertando timestamp de puja:", timestampError);
    throw timestampError;
  }

  return data.identificador;
};

export const getAsistenteIdByClientId = async (clientId) => {
  const { data, error } = await supabase
    .from("asistentes")
    .select("identificador")
    .eq("cliente", clientId)
    .maybeSingle();

  if (error) {
    console.log(error);
    throw error;
  }

  return data?.identificador ?? null;
};

export const addParticipant = async (auctionId, clientId) => {
  const { data, error } = await supabase
    .from("asistentes")
    .insert({
      numeropostor: clientId,
      cliente: clientId,
      subasta: auctionId,
    })
    .select("identificador")
    .single();

  if (error) {
    console.error("Error agregando participante:", error);
    throw error;
  }

  return data.identificador;
};

export const getCurrentItemId = async (auctionId) => {
  // 1. Buscar el catálogo asociado a la subasta
  const { data: catalogo, error: catalogoError } = await supabase
    .from("catalogos")
    .select("identificador")
    .eq("subasta", auctionId)
    .single();

  if (catalogoError || !catalogo) {
    console.error("Error buscando catálogo:", catalogoError);
    return null;
  }

  // 2. Buscar los items de ese catálogo (incluyendo su producto)
  const { data: items, error: itemsError } = await supabase
    .from("itemscatalogo")
    .select("identificador, producto")
    .eq("catalogo", catalogo.identificador);

  if (itemsError || !items?.length) {
    console.error("Error buscando items:", itemsError);
    return null;
  }

  // 3. Buscar cuál de esos items está activo
  const { data: estadoActivo, error: estadoError } = await supabase
    .from("itemscatalogo_estados")
    .select("identificador, updated_at")
    .in(
      "identificador",
      items.map((i) => i.identificador),
    )
    .eq("active", true)
    .maybeSingle();

  if (estadoError) {
    console.error("Error buscando estado activo:", estadoError);
    return null;
  }

  if (!estadoActivo) {
    return { identificador: null, producto: null };
  }

  // 4. Cruzar el identificador activo con la lista de items para obtener su producto
  const itemActivo = items.find(
    (i) => i.identificador === estadoActivo.identificador,
  );

  return {
    identificador: estadoActivo.identificador,
    producto: itemActivo?.producto ?? null,
    updated_at: estadoActivo.updated_at,
  };
};

export const openAuctionExists = async (id) => {
  const { data, error } = await supabase
    .from("subastas")
    .select("identificador")
    .eq("identificador", id)
    .eq("estado", "abierta")
    .single();

  if (error) {
    console.error(error);
    return false;
  }

  return data !== null;
};

export const getAuctions = async () => {
  // 1. Traer subastas + catalogos
  const { data: subastasData, error: subastasError } = await supabase.from(
    "subastas",
  ).select(`
      *,
      catalogos ( identificador, descripcion )
    `);

  if (subastasError) {
    console.error(subastasError);
    return null;
  }

  const auctions = subastasData.map(({ catalogos, ...subasta }) => ({
    ...subasta,
    idCatalogo: catalogos?.[0]?.identificador ?? null,
    descripcion: catalogos?.[0]?.descripcion ?? null,
  }));

  // 2. Traer items de catalogo para todos los idCatalogo encontrados
  const idsCatalogo = auctions
    .map((a) => a.idCatalogo)
    .filter((id) => id !== null);

  const { data: itemsData, error: itemsError } = await supabase
    .from("itemscatalogo")
    .select("catalogo, producto")
    .in("catalogo", idsCatalogo);

  if (itemsError) {
    console.error(itemsError);
    return null;
  }

  const productoPorCatalogo = {};
  for (const item of itemsData) {
    if (!(item.catalogo in productoPorCatalogo)) {
      productoPorCatalogo[item.catalogo] = item.producto;
    }
  }

  // 3. Traer fotos para todos los productos encontrados
  const idsProducto = Object.values(productoPorCatalogo).filter(
    (id) => id !== null,
  );

  const { data: fotosData, error: fotosError } = await supabase
    .from("fotos")
    .select("producto, foto")
    .in("producto", idsProducto);

  if (fotosError) {
    console.error(fotosError);
    return null;
  }

  const fotoPorProducto = {};
  for (const fila of fotosData) {
    if (!(fila.producto in fotoPorProducto)) {
      fotoPorProducto[fila.producto] = fila.foto;
    }
  }

  // 4. Armar resultado final
  return auctions.map((auction) => {
    const producto = productoPorCatalogo[auction.idCatalogo] ?? null;
    const fotoRaw =
      producto !== null ? (fotoPorProducto[producto] ?? null) : null;

    let foto = null;

    if (fotoRaw !== null) {
      try {
        let base64Real = "";

        // 1. Verificamos si viene en el formato Hex de Postgres (\x...)
        if (typeof fotoRaw === "string" && fotoRaw.startsWith("\\x")) {
          // 2. Le sacamos el \x y lo decodificamos de Hexadecimal a String normal
          const stringJson = Buffer.from(
            fotoRaw.replace("\\x", ""),
            "hex",
          ).toString("utf-8");

          // 3. Ese string es literalmente '{"type":"Buffer","data":[255, 216...]}'. Lo parseamos:
          const parsedData = JSON.parse(stringJson);

          // 4. Ahora sí, agarramos el array 'data' (los bytes reales) y lo pasamos a Base64 puro
          base64Real = Buffer.from(parsedData.data).toString("base64");
        } else {
          // Fallback por si la foto ya viene limpia o si arreglan el proceso de guardado en el futuro
          base64Real = Buffer.from(fotoRaw).toString("base64");
        }

        foto = base64Real;
      } catch (e) {
        console.error(
          "Error procesando imagen para la subasta",
          auction.identificador,
          e,
        );
      }
    }

    return {
      ...auction,
      foto,
    };
  });
};

export const getAuctionById = async (id) => {
  // 1. Traer datos de la subasta
  const { data: subastaData, error: subastaError } = await supabase
    .from("subastas")
    .select("fecha, hora, estado, ubicacion,  capacidadasistentes, categoria")
    .eq("identificador", id)
    .single();

  if (subastaError) {
    console.error(subastaError);
    return null;
  }

  // 2. Traer catalogo asociado a esta subasta
  const { data: catalogoData, error: catalogoError } = await supabase
    .from("catalogos")
    .select("identificador, descripcion")
    .eq("subasta", id)
    .single();

  if (catalogoError) {
    console.error(catalogoError);
    return null;
  }

  const idCatalogo = catalogoData?.identificador ?? null;
  const descripcion = catalogoData?.descripcion ?? null;

  // 3. Traer items de catalogo (precioBase + producto)
  let items = [];

  if (idCatalogo !== null) {
    const { data: itemsData, error: itemsError } = await supabase
      .from("itemscatalogo")
      .select("preciobase, producto, subastado")
      .eq("catalogo", idCatalogo);

    if (itemsError) {
      console.error(itemsError);
      return null;
    }

    items = itemsData;
  }

  // 4. Traer productos disponibles para esos items
  const idsProducto = items
    .map((item) => item.producto)
    .filter((id) => id !== null);

  let productosPorId = {};

  if (idsProducto.length > 0) {
    const { data: productosData, error: productosError } = await supabase
      .from("productos")
      .select(
        "identificador, descripcioncatalogo, descripcioncompleta, disponible",
      )
      .in("identificador", idsProducto);
    // .eq("disponible", "si");

    if (productosError) {
      console.error(productosError);
      return null;
    }

    productosPorId = productosData.reduce((acc, producto) => {
      acc[producto.identificador] = producto;
      return acc;
    }, {});
  }

  // 5. Traer fotos de los productos disponibles
  const idsProductoDisponible = Object.keys(productosPorId).map((id) =>
    Number(id),
  );

  let fotosPorProducto = {};

  if (idsProductoDisponible.length > 0) {
    const { data: fotosData, error: fotosError } = await supabase
      .from("fotos")
      .select("producto, foto")
      .in("producto", idsProductoDisponible);

    if (fotosError) {
      console.error(fotosError);
      return null;
    }

    fotosPorProducto = fotosData.reduce((acc, fila) => {
      if (!acc[fila.producto]) acc[fila.producto] = [];

      let foto = null;

      try {
        let base64Real = "";

        if (typeof fila.foto === "string" && fila.foto.startsWith("\\x")) {
          const stringJson = Buffer.from(
            fila.foto.replace("\\x", ""),
            "hex",
          ).toString("utf-8");

          const parsedData = JSON.parse(stringJson);

          base64Real = Buffer.from(parsedData.data).toString("base64");
        } else {
          base64Real = Buffer.from(fila.foto).toString("base64");
        }

        foto = base64Real;
      } catch (e) {
        console.error(
          "Error procesando imagen para el producto",
          fila.producto,
          e,
        );
      }

      if (foto !== null) acc[fila.producto].push(foto);

      return acc;
    }, {});
  }

  // 6. Armar array final de items, solo con productos disponibles
  const itemsResult = items
    .filter((item) => productosPorId[item.producto] !== undefined)
    .map((item) => {
      const producto = productosPorId[item.producto];

      return {
        idProducto: producto.identificador,
        precioBase: item.preciobase,
        descripcioncatalogo: producto.descripcioncatalogo,
        descripcioncompleta: producto.descripcioncompleta,
        fotos: fotosPorProducto[producto.identificador] ?? [],
        subastado: item.subastado,
      };
    });

  // 7. Armar resultado final
  return {
    fecha: subastaData.fecha,
    hora: subastaData.hora,
    estado: subastaData.estado,
    ubicacion: subastaData.ubicacion,
    cantidadasistentes: subastaData.cantidadasistentes,
    categoria: subastaData.categoria,
    descripcion,
    items: itemsResult,
  };
};

export async function getHistoryByClientId(clientId) {
  // 1. Buscamos todas las "asistencias" de este cliente (cada una es una
  //    participación suya en una subasta puntual).
  const { data: asistentes, error: asistentesError } = await supabase
    .from("asistentes")
    .select("identificador")
    .eq("cliente", clientId);

  if (asistentesError) {
    throw asistentesError;
  }

  if (!asistentes || asistentes.length === 0) {
    return [];
  }

  const asistenteIds = asistentes.map((a) => a.identificador);

  // 2. Traemos todas las pujas hechas por ese cliente (a través de sus
  //    asistencias), con el item, el producto y la fecha de cada puja.
  const { data: pujos, error: pujosError } = await supabase
    .from("pujos")
    .select(
      `
      item,
      importe,
      ganador,
      itemscatalogo (
        productos (
          descripcioncatalogo
        )
      ),
      pujos_timestamp (
        created_at
      )
    `,
    )
    .in("asistente", asistenteIds);

  if (pujosError) {
    throw pujosError;
  }

  if (!pujos || pujos.length === 0) {
    return [];
  }

  // 3. Agrupamos por item de catálogo, quedándonos con la puja de mayor
  //    importe de cada uno.
  const historialPorItem = new Map();

  for (const pujo of pujos) {
    const itemId = pujo.item;
    const importeActual = Number(pujo.importe);
    const existente = historialPorItem.get(itemId);

    if (!existente || importeActual > existente.importe) {
      historialPorItem.set(itemId, {
        identificadorItemCatalogo: itemId,
        descCatalogo:
          pujo.itemscatalogo?.productos?.descripcioncatalogo ?? null,
        importe: importeActual,
        ganador: pujo.ganador,
        fecha: pujo.pujos_timestamp?.created_at ?? null,
      });
    }
  }

  // Orden por fecha descendente (más reciente primero).
  return Array.from(historialPorItem.values()).sort((a, b) => {
    if (!a.fecha) return 1;
    if (!b.fecha) return -1;
    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
  });
}
