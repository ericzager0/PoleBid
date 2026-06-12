import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import * as onboardingService from "../services/onboarding.service.js";
import { requireNumber, requireString } from "../utils/validators.js";

export const startOnboarding = catchAsync(async (req, res, next) => {
  const email = req.body.email;

  if (!email || typeof email !== "string" || !email.trim()) {
    throw new AppError("El campo email es obligatorio", 400);
  }

  const onboarding = await onboardingService.startOnboarding(email.trim());

  res.status(201).json({
    status: "success",
    data: {
      email: onboarding.email,
    },
  });
});

export const getOnboardingStatus = catchAsync(async (req, res, next) => {
  const email = req.query.email;

  if (!email || typeof email !== "string" || !email.trim()) {
    throw new AppError("El campo email es obligatorio", 400);
  }

  const status = await onboardingService.getOnboardingStatus(email.trim());

  res.status(200).json({
    status: "success",
    data: {
      status,
    },
  });
});

export const verifyEmail = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const code = req.body.code;

  if (!email || typeof email !== "string" || !email.trim()) {
    throw new AppError("El campo email es obligatorio", 400);
  }

  if (code === undefined || code === null || code === "") {
    throw new AppError("El campo código es obligatorio", 400);
  }

  const result = await onboardingService.verifyEmail(email.trim(), code);

  res.status(200).json({
    status: "success",
    data: {
      email: result.email,
      status: result.status,
    },
  });
});

export const uploadDocuments = catchAsync(async (req, res) => {
  const country = requireNumber(req.body.country, "country");
  const firstName = requireString(req.body.firstName, "firstName");
  const lastName = requireString(req.body.lastName, "lastName");
  const email = requireString(req.body.email, "email");
  const address = requireString(req.body.address, "address");

  const frontFile = req.files?.documentFront?.[0];
  const backFile = req.files?.documentBack?.[0];

  if (!frontFile || !backFile) {
    throw new AppError(
      "Los archivos documentFront y documentBack son obligatorios",
      400,
    );
  }

  await onboardingService.uploadDocuments(email, {
    country,
    firstName,
    lastName,
    email,
    address,
    documentFront: frontFile,
    documentBack: backFile,
  });

  res.status(200).json({ status: "success" });
});

export const approveDocuments = catchAsync(async (req, res, next) => {
  const email = requireString(req.body.email, "email");
  const empleadoId = requireNumber(req.body.empleadoId, "empleadoId");
  const documento = requireString(req.body.documento, "documento");
  const categoria = requireString(req.body.categoria, "categoria");

  const result = await onboardingService.approveDocuments(
    email,
    empleadoId,
    documento,
    categoria,
  );

  res.status(200).json({
    status: "success",
  });
});

export const rejectDocuments = catchAsync(async (req, res, next) => {
  // Verificar con el token que sea un admin quien este llamado.

  const email = requireString(req.body.email, "email");

  const result = await onboardingService.rejectDocuments(email);

  res.status(200).json({
    status: "success",
  });
});
