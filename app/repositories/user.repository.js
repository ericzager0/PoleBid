import { supabase } from "../config/supabase.config.js";

export const getClientIdByUserId = async (userId) => {
  const { data, error } = await supabase
    .from("onboardings")
    .select("cliente_id")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.cliente_id ?? null;
};

export const getUserById = async (id) => {
  const { data, error } = await supabase
    .from("onboardings")
    .select(
      `
      id,
      email,
      onboarding_documents (
        first_name,
        last_name
      ),
      clientes (
        categoria,
        numeropais
      ),
      cliente_id
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) return null;

  const { data: persona, error: error2 } = await supabase
    .from("personas")
    .select("direccion, documento")
    .eq("identificador", data.cliente_id)
    .maybeSingle();

  if (error2) {
    throw error2;
  }

  const { data: owner, error: error3 } = await supabase
    .from("duenios")
    .select("identificador")
    .eq("identificador", data.cliente_id)
    .maybeSingle();

  const isSeller = !!owner;

  if (error3) {
    throw error3;
  }

  return {
    id: data.id,
    email: data.email,
    firstName: data.onboarding_documents?.first_name ?? null,
    lastName: data.onboarding_documents?.last_name ?? null,
    categoria: data.clientes?.categoria ?? null,
    numeropais: data.clientes?.numeropais ?? null,
    clientId: data.cliente_id,
    documento: persona?.documento ?? null,
    direccion: persona?.direccion ?? null,
    isSeller,
  };
};

export const approveAsSeller = async (clientId, empleadoId) => {
  const { data, error } = await supabase
    .from("duenios")
    .insert({ identificador: clientId, verificador: empleadoId });
};

/**
 * Devuelve estadísticas agregadas de un cliente.
 *
 * @param {number} clientId - identificador del cliente
 * @returns {Promise<{
 *   subastasParticipadas: number,
 *   pujasRealizadas: number,
 *   totalInvertido: number,
 *   subastasGanadas: number,
 * }>}
 */
export async function getStatsByClientId(clientId) {
  // 1. Asistencias del cliente (cada fila = una participación en una subasta)
  const { data: asistentes, error: asistentesError } = await supabase
    .from("asistentes")
    .select("identificador")
    .eq("cliente", clientId);

  if (asistentesError) {
    throw asistentesError;
  }

  const subastasParticipadas = asistentes?.length ?? 0;

  if (subastasParticipadas === 0) {
    return {
      subastasParticipadas: 0,
      pujasRealizadas: 0,
      totalInvertido: 0,
      subastasGanadas: 0,
    };
  }

  const asistenteIds = asistentes.map((a) => a.identificador);

  // 2. Todas las pujas hechas por el cliente, a través de sus asistencias
  const { data: pujos, error: pujosError } = await supabase
    .from("pujos")
    .select("importe, ganador")
    .in("asistente", asistenteIds);

  if (pujosError) {
    throw pujosError;
  }

  const pujasRealizadas = pujos?.length ?? 0;
  const pujosGanadores = (pujos ?? []).filter((p) => p.ganador === "si");

  const totalInvertido = pujosGanadores.reduce(
    (acc, p) => acc + Number(p.importe),
    0,
  );
  const subastasGanadas = pujosGanadores.length;

  return {
    subastasParticipadas,
    pujasRealizadas,
    totalInvertido,
    subastasGanadas,
  };
}
