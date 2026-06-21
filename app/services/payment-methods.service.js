import { raw } from "express";
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
  const KEYS = [
    "mastercard",
    "visa",
    "icbc",
    "naranja",
    "bna",
    "banco nacion",
    "santander",
    "mercado pago",
    "brubank",
    "uala",
    "amex",
    "cabal",
    "argencard",
  ];
  const n = number.replace(/\s/g, "");

  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n) || /^2(2[2-9][1-9]|[3-6]\d\d|7[01]\d|720)/.test(n))
    return "mastercard";
  if (/^3[47]/.test(n)) return "amex";

  // Argentina
  if (/^589562/.test(n)) return "naranja";
  if (/^(604|6042)/.test(n)) return "cabal";
  if (/^501105/.test(n)) return "argencard";

  const randomKey = KEYS[Math.floor(Math.random() * KEYS.length)];

  return randomKey;
};

// helper para determinar el banco a partir del CBU
const getBankNameByCbu = (cbu) => {
  const BANKS = [
    "banco nacion",
    "santander",
    "galicia",
    "bbva",
    "macro",
    "brubank",
    "mercado pago",
    "uala",
    "patagonia",
    "supervielle",
    "itau",
    "hsbc",
    "credicoop",
  ];
  const c = cbu.replace(/\s/g, "");

  if (/^011/.test(c)) return "banco nacion";
  if (/^072/.test(c)) return "santander";
  if (/^007/.test(c)) return "galicia";
  if (/^017/.test(c)) return "bbva";
  if (/^285/.test(c)) return "macro";
  if (/^143/.test(c)) return "brubank";
  if (/^000/.test(c)) return "mercado pago";

  const randomBank = BANKS[Math.floor(Math.random() * BANKS.length)];

  return randomBank;
};

// helper para determinar el banco a partir del número de cheque (de forma determinista)
const getBankNameByCheck = (number) => {
  const BANKS = [
    "banco nacion",
    "santander",
    "galicia",
    "bbva",
    "macro",
    "brubank",
    "patagonia",
    "supervielle",
    "hsbc",
    "credicoop",
  ];
  const index = Number(number) % BANKS.length;
  return BANKS[isNaN(index) ? 0 : index];
};

export const addBankAccount = async ( bankName, owner, cuil, cbu, reservedFunds, userId ) => {
  const isCbu = /^\d{22}$/.test(cbu.trim());
  const actualCbu = isCbu ? cbu.trim() : null;
  const alias = isCbu ? null : cbu.trim();

  const user = await userRepository.getUserById(userId);
  const clientId = user.clientId;

  return await paymentMethodsRepository.addBankAccount(
    clientId,
    bankName,
    actualCbu,
    alias,
    owner,
    cuil,
    reservedFunds,
  );
};

export const addCheck = async ( bankName, owner, number, currency, amount, issueDate, cuil, userId ) => {
  const user = await userRepository.getUserById(userId);
  const clientId = user.clientId;

  return await paymentMethodsRepository.addCheck(
    clientId,
    number,
    bankName,
    amount,
    owner,
    cuil,
    currency,
    issueDate,
  );
};

