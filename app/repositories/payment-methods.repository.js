import { supabase } from "../config/supabase.config.js";

export const addCard = async (clientId, lastFour, expMonth, expYear, brand) => {
  const { data, error } = await supabase
    .from("cards")
    .insert({
      client_id: clientId,
      last_four: lastFour,
      exp_month: expMonth,
      exp_year: expYear,
      brand: brand,
    })
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error("Error al agregar la tarjeta: " + error.message);
  }

  return data;
};
