import { supabase } from "../config/supabase.config.js";

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
      .select("preciobase, producto")
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
      .in("identificador", idsProducto)
      .eq("disponible", "si");

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
