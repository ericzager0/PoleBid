import * as auctionsRepository from "../repositories/auctions.repository.js";
import * as userRepository from "../repositories/user.repository.js";

export const getAuctions = async () => {
  return await auctionsRepository.getAuctions();
};

export const getAuctionById = async (id) => {
  return await auctionsRepository.getAuctionById(id);
};

export const getCurrentItem = async (auctionId, userId) => {
  // busco el auction, esta deberia primero existir y despues estar abierta
  // despues busco el primer item que tenga el auctionId y que este abierto
  // si lo hay, agrego al usuario como participante de la subasta, y retorno el item
  const openAuction = await auctionsRepository.openAuctionExists(auctionId);
  const currentItem = await auctionsRepository.getCurrentItemId(auctionId);

  if (!openAuction || !currentItem) {
    throw new Error("La subasta no está abierta o no hay items disponibles");
  }

  const clientId = await userRepository.getClientIdByUserId(userId);

  const asistenteId =
    await auctionsRepository.getAsistenteIdByClientId(clientId);

  // validar que el cliente tenga la categoria necesaria para poder participar...

  if (!asistenteId) {
    const asistenteId = await auctionsRepository.addParticipant(
      auctionId,
      clientId,
    );
  }

  // deberia agregar al userId como participante
  // deberia devolver todos los detalles de ese item, no solo el id. por ejemplo las pujas, el precio base, foto, etc.
  const pujos = await auctionsRepository.getPujosByItemId(
    currentItem.identificador,
  );

  const subasta = await auctionsRepository.getAuctionById(auctionId);

  // busco dentro de los items de la subasta el que corresponde al producto activo
  const item = subasta.items?.find(
    (i) => i.idProducto === currentItem.producto,
  );

  return {
    itemId: currentItem.identificador,
    updatedAt: currentItem.updated_at,
    identificador: item.idProducto,
    subastado: item.subastado,
    pujos,
    fecha: subasta.fecha,
    descripcion: subasta.descripcion,
    precioBase: item.precioBase,
    descripcioncatalogo: item.descripcioncatalogo,
    fotos: item.fotos,
  };
};

export const placeBid = async (auctionId, itemId, userId, amount) => {
  // 1. Verificar que la subasta esté abierta y que el item sea el actual
  const openAuction = await auctionsRepository.openAuctionExists(auctionId);
  const currentItem = await auctionsRepository.getCurrentItemId(auctionId);

  if (!openAuction) {
    throw new Error("La subasta no está abierta");
  }

  if (String(currentItem.identificador) !== itemId) {
    throw new Error("El item no es el actual");
  }

  const clientId = await userRepository.getClientIdByUserId(userId);

  const asistenteId =
    await auctionsRepository.getAsistenteIdByClientId(clientId);

  // IMPORTANTE
  // aplicar reglas de negocio, por ejemplo validar que la puja sea mayor a la actual, que el usuario tenga fondos, etc.

  await auctionsRepository.placeBid(auctionId, itemId, asistenteId, amount);
};
