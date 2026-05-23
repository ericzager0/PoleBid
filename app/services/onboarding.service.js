import AppError from "../utils/appError.js";
import * as onboardingRepository from "../repositories/onboarding.repository.js";

export const startOnboarding = async (email) => {
  const existingOnboarding =
    await onboardingRepository.getOnboardingByEmail(email);

  if (existingOnboarding) {
    throw new AppError("El email ya está en uso", 400);
  }

  const code = Math.floor(100000 + Math.random() * 900000);
  const onboarding = await onboardingRepository.createOnboarding(email, code);

  // Enviar el email con el código de verificación usando algún servicio de email

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

  return onboarding.status;
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
