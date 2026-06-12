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
  const { data: cards, error } = await supabase
    .from("cards")
    .select("*")
    .eq("client_id", clientId);

  if (error) {
    throw new Error("Error al obtener los métodos de pago: " + error.message);
  }

  return { cards };
};
