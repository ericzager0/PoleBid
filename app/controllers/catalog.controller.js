import catchAsync from "../utils/catchAsync.js";
import { requireNumber } from "../utils/validators.js";
import * as catalogService from "../services/catalog.service.js";

export const addItem = catchAsync(async (req, res, next) => {
  const idCatalogo = requireNumber(req.body.idCatalogo, "idCatalogo");
  const idProducto = requireNumber(req.body.idProducto, "idProducto");
  const precioBase = requireNumber(req.body.precioBase, "precioBase");
  const comision = requireNumber(req.body.comision, "comision");

  await catalogService.addItem(idCatalogo, idProducto, precioBase, comision);

  res.status(200).json({
    status: "success",
  });
});
