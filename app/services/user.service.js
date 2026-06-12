import * as userRepository from "../repositories/user.repository.js";
import * as paymentMethodsRepository from "../repositories/payment-methods.repository.js";

export const getMe = async (userId) => {
  const user = await userRepository.getUserById(userId);

  const paymentMethods =
    await paymentMethodsRepository.getPaymentMethodsByClientId(user.clientId);

  if (!user) throw new Error("Usuario no encontrado");
  return { ...user, paymentMethods };
};
