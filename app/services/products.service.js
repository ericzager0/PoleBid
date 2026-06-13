import * as userRepository from "../repositories/user.repository.js";
import * as productsRepository from "../repositories/products.repository.js";

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
