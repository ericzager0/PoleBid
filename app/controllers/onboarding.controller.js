import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import * as onboardingService from "../services/onboarding.service.js";

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
