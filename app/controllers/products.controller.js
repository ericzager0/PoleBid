import catchAsync from "../utils/catchAsync.js";
import * as productsService from "../services/products.service.js";

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
