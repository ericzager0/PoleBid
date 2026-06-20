import * as catalogRepository from "../repositories/catalog.repository.js";

export const addItem = async (idCatalogo, idProducto, precioBase, comision) => {
  await catalogRepository.addItem(idCatalogo, idProducto, precioBase, comision);
};
