import * as userRepository from "../repositories/user.repository.js";
import * as productsRepository from "../repositories/products.repository.js";

export const updateProduct = async (userId, productId, estado) => {
  const product = await productsRepository.getProductById(productId);

  if (!product) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }

  const clientId = await userRepository.getClientIdByUserId(userId);

  if (product.duenio !== clientId) {
    const error = new Error("No tienes permiso para actualizar este producto");
    error.statusCode = 403;
    throw error;
  }

  if (
    product.estado === "ready_auction" &&
    (estado === "scheduled_auction" || estado === "rejected_auction")
  ) {
    await productsRepository.updateProductState(productId, estado);
    return;
  }

  if (product.estado === "interested" && estado === "in_inspection") {
    await productsRepository.updateProductState(productId, estado);
    return;
  } else {
    const error = new Error("Combinacion erronea de cambio de estado.");
    error.statusCode = 403;
    throw error;
  }
};

export const addProduct = async (
  userId,
  descripcioncatalogo,
  descripcioncompleta,
  foto1,
  foto2,
  foto3,
  foto4,
  foto5,
  foto6,
) => {
  const buffer1 = foto1?.[0]?.buffer;
  const buffer2 = foto2?.[0]?.buffer;
  const buffer3 = foto3?.[0]?.buffer;
  const buffer4 = foto4?.[0]?.buffer;
  const buffer5 = foto5?.[0]?.buffer;
  const buffer6 = foto6?.[0]?.buffer;

  const clientId = await userRepository.getClientIdByUserId(userId);

  await productsRepository.addProduct(
    clientId,
    descripcioncatalogo,
    descripcioncompleta,
    buffer1,
    buffer2,
    buffer3,
    buffer4,
    buffer5,
    buffer6,
  );

  return;
};
