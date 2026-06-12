import * as paymentMethodsRepository from "../repositories/payment-methods.repository.js";
import * as userRepository from "../repositories/user.repository.js";

export const addCard = async (number, expMonth, expYear, owner, userId) => {
  const lastFour = number.slice(-4);
  const brand = getCardBrand(number);

  const user = await userRepository.getUserById(userId);
  const clientId = user.clientId;

  return await paymentMethodsRepository.addCard(
    clientId,
    lastFour,
    expMonth,
    expYear,
    brand,
    owner,
  );
};

// helper para determinar la marca de la tarjeta a partir del número
const getCardBrand = (number) => {
  const n = number.replace(/\s/g, "");

  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n) || /^2(2[2-9][1-9]|[3-6]\d\d|7[01]\d|720)/.test(n))
    return "mastercard";
  if (/^3[47]/.test(n)) return "amex";

  // Argentina
  if (/^589562/.test(n)) return "naranja";
  if (/^(604|6042)/.test(n)) return "cabal";
  if (/^501105/.test(n)) return "argencard";

  return "unknown";
};
