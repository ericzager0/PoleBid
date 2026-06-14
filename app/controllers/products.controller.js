import catchAsync from "../utils/catchAsync.js";
import * as productsService from "../services/products.service.js";
import { requireString } from "../utils/validators.js";

export const newProduct = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const { descripcioncatalogo, descripcioncompleta } = req.body;
  const { foto1, foto2, foto3, foto4, foto5, foto6 } = req.files;

  await productsService.addProduct(
    userId,
    descripcioncatalogo,
    descripcioncompleta,
    foto1,
    foto2,
    foto3,
    foto4,
    foto5,
    foto6,
  );

  res.status(200).json({
    status: "success",
  });
});

export const updateProduct = catchAsync(async (req, res, next) => {
  // El id del usuario viene del middleware de autenticación, que lo agrega al objeto req.user
  const userId = req.user.id;

  // El id del producto a actualizar se obtiene de los parámetros de la ruta
  const { id } = req.params;

  const estado = requireString(req.body.estado, "estado");

  await productsService.updateProduct(userId, id, estado);

  res.sendStatus(200);
});
