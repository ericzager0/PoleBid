import * as userRepository from "../repositories/user.repository.js";
import * as paymentMethodsRepository from "../repositories/payment-methods.repository.js";
import * as productsRepository from "../repositories/products.repository.js";
import * as auctionsRepository from "../repositories/auctions.repository.js";

export const getMe = async (userId) => {
  const user = await userRepository.getUserById(userId);

  const paymentMethods =
    await paymentMethodsRepository.getPaymentMethodsByClientId(user.clientId);

  const products = await productsRepository.getProducts(user.clientId);

  const history = await auctionsRepository.getHistoryByClientId(user.clientId);

  const stats = await userRepository.getStatsByClientId(user.clientId);

  if (!user) throw new Error("Usuario no encontrado");
  return { ...user, paymentMethods, products, history, stats };
};

export const approveAsSeller = async (clientId, empleadoId) => {
  await userRepository.approveAsSeller(clientId, empleadoId);
};
