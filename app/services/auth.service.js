import AppError from "../utils/appError.js";
import * as onboardingRepository from "../repositories/onboarding.repository.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import jwt from "jsonwebtoken";

export const register = async (email, password) => {
  const onboarding = await onboardingRepository.getOnboardingByEmail(email);

  if (!onboarding) {
    throw new AppError(
      "No se encontró un proceso de onboarding para este email",
      404,
    );
  }

  if (onboarding.status !== "documents_approved") {
    throw new AppError("El proceso de onboarding no está aprobado", 400);
  }

  const hashedPassword = await hashPassword(password);

  await onboardingRepository.completeOnboarding(email, hashedPassword);
};

export const login = async (email, password) => {
  const onboarding = await onboardingRepository.getOnboardingByEmail(email);
  if (!onboarding) throw new Error("Credenciales inválidas");

  const valid = await comparePassword(password, onboarding.password);
  if (!valid) throw new Error("Credenciales inválidas");

  return jwt.sign({ id: onboarding.id }, process.env.JWT_SECRET);
};
