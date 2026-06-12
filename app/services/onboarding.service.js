import AppError from "../utils/appError.js";
import * as onboardingRepository from "../repositories/onboarding.repository.js";
import * as clientRepository from "../repositories/client.repository.js";
import * as userRepository from "../repositories/user.repository.js";
import { sendEmail } from "../services/email.service.js";
import { supabase } from "../config/supabase.config.js";

export const startOnboarding = async (email) => {
  const existingOnboarding =
    await onboardingRepository.getOnboardingByEmail(email);

  if (existingOnboarding) {
    throw new AppError("El email ya está en uso", 400);
  }

  const code = Math.floor(100000 + Math.random() * 900000);
  const onboarding = await onboardingRepository.createOnboarding(email, code);

  await sendEmail(email, "VERIFICATION_CODE", { code });

  return onboarding;
};

export const getOnboardingStatus = async (email) => {
  const onboarding = await onboardingRepository.getOnboardingByEmail(email);

  if (!onboarding) {
    throw new AppError(
      "No se encontró un proceso de onboarding para este email",
      404,
    );
  }

  if (onboarding.status === "documents_approved") {
    const user = await userRepository.getUserById(onboarding.id);

    return {
      status: onboarding.status,
      categoria: user.categoria,
    };
  }

  return { status: onboarding.status };
};

export const verifyEmail = async (email, code) => {
  const onboarding = await onboardingRepository.getOnboardingByEmail(email);

  if (!onboarding) {
    throw new AppError(
      "No se encontró un proceso de onboarding para este email",
      404,
    );
  }

  if (onboarding.status !== "pending") {
    throw new AppError("El proceso de onboarding ya no está pendiente", 400);
  }

  if (String(onboarding.code) !== String(code)) {
    throw new AppError("Código de verificación incorrecto", 400);
  }

  const verifiedOnboarding = await onboardingRepository.updateOnboardingStatus(
    email,
    "verified",
  );

  if (!verifiedOnboarding) {
    throw new AppError("No se pudo verificar el email", 500);
  }

  return {
    email: verifiedOnboarding.email,
    status: verifiedOnboarding.status,
  };
};

export const uploadDocuments = async (email, documentData) => {
  const onboarding = await onboardingRepository.getOnboardingByEmail(email);

  if (!onboarding) {
    throw new AppError(
      "No se encontró un proceso de onboarding para este email",
      404,
    );
  }

  if (onboarding.status !== "verified") {
    throw new AppError(
      "El proceso de onboarding debe estar verificado para subir documentos",
      400,
    );
  }

  const { documentFront, documentBack, ...rest } = documentData;

  const [frontUrl, backUrl] = await Promise.all([
    uploadToStorage(documentFront, `${email}/front`),
    uploadToStorage(documentBack, `${email}/back`),
  ]);

  await onboardingRepository.saveDocuments(onboarding.id, {
    ...rest,
    document_front_url: frontUrl,
    document_back_url: backUrl,
  });

  await onboardingRepository.updateOnboardingStatus(
    email,
    "documents_pending_review",
  );
};

// Helper para subir las imagenes al bucket de supabase storage
const uploadToStorage = async (file, path) => {
  const { error } = await supabase.storage
    .from("dnis")
    .upload(path, file.buffer, { contentType: file.mimetype });

  if (error) throw new AppError("Error al subir el archivo a storage", 500);

  const { data } = supabase.storage.from("dnis").getPublicUrl(path);
  return data.publicUrl;
};

export const approveDocuments = async (
  email,
  empleadoId,
  documento,
  categoria,
) => {
  const onboarding = await onboardingRepository.getOnboardingByEmail(email);

  if (!onboarding) {
    throw new AppError(
      "No se encontró un proceso de onboarding para este email",
      404,
    );
  }

  if (onboarding.status !== "documents_pending_review") {
    throw new AppError("El proceso de onboarding no está pendiente", 400);
  }

  const verifiedOnboarding = await onboardingRepository.updateOnboardingStatus(
    email,
    "documents_approved",
  );

  // obtengo los datos del cliente
  const documents = await onboardingRepository.getOnboardingDocumentsById(
    onboarding.id,
  );

  // ✅ Correcto
  console.log("Creando cliente con los siguientes datos:", {
    direccion: documents.direccion,
    documento,
    nombre: documents.nombre,
    numeropais: documents.numeropais,
    empleadoId,
    categoria,
    onboardingId: onboarding.id,
  });

  // creo el cliente (incluye crear la persona y agregar la referencia al onboarding)
  await clientRepository.createClient(
    documents.direccion,
    documento,
    documents.nombre,
    documents.numeropais,
    empleadoId,
    categoria,
    onboarding.id,
  );

  if (!verifiedOnboarding) {
    throw new AppError("No se pudo aprobar los documentos", 500);
  }

  await sendEmail(email, "ACCOUNT_APPROVED", { categoria });

  return {
    email: verifiedOnboarding.email,
    status: verifiedOnboarding.status,
  };
};

export const rejectDocuments = async (email) => {
  const onboarding = await onboardingRepository.getOnboardingByEmail(email);

  if (!onboarding) {
    throw new AppError(
      "No se encontró un proceso de onboarding para este email",
      404,
    );
  }

  if (onboarding.status !== "documents_pending_review") {
    throw new AppError("El proceso de onboarding no está pendiente", 400);
  }

  const verifiedOnboarding = await onboardingRepository.updateOnboardingStatus(
    email,
    "documents_rejected",
  );

  if (!verifiedOnboarding) {
    throw new AppError("No se pudo rechazar los documentos", 500);
  }

  await sendEmail(email, "ACCOUNT_REJECTED");

  return {
    email: verifiedOnboarding.email,
    status: verifiedOnboarding.status,
  };
};
