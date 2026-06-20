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
    const foto = producto !== null ? (fotoPorProducto[producto] ?? null) : null;

    return {
      ...auction,
      foto,
    };
  });
};
