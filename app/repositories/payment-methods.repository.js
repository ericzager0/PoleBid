import { supabase } from "../config/supabase.config.js";

export const addCard = async (
  clientId,
  lastFour,
  expMonth,
  expYear,
  brand,
  owner,
) => {
  const { data, error } = await supabase
    .from("cards")
    .insert({
      client_id: clientId,
      last_four: lastFour,
      exp_month: expMonth,
      exp_year: expYear,
      brand: brand,
      owner: owner,
    })
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error("Error al agregar la tarjeta: " + error.message);
  }

  return data;
};

export const getPaymentMethodsByClientId = async (clientId) => {
  const { data: cards, error: cardsError } = await supabase
    .from("cards")
    .select(
      "id, lastFour:last_four, expMonth:exp_month, expYear:exp_year, brand, owner",
    )
    .eq("client_id", clientId);

  if (cardsError) {
    throw new Error("Error al obtener las tarjetas: " + cardsError.message);
  }

  const { data: bankAccounts, error: bankAccountsError } = await supabase
    .from("bank_accounts")
    .select(
      "id, bankName:bank_name, cbu, alias, owner, cuitCuil:cuit_cuil",
    )
    .eq("client_id", clientId);

  if (bankAccountsError) {
    throw new Error("Error al obtener las cuentas bancarias: " + bankAccountsError.message);
  }

  return { cards, bankAccounts };
};

export const addBankAccount = async (
  clientId,
  bankName,
  cbu,
  alias,
  owner,
  cuitCuil,
) => {
  const { data, error } = await supabase
    .from("bank_accounts")
    .insert({
      client_id: clientId,
      bank_name: bankName,
      cbu: cbu,
      alias: alias,
      owner: owner,
      cuit_cuil: cuitCuil,
    })
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error("Error al agregar la cuenta bancaria: " + error.message);
  }

  return data;
};

