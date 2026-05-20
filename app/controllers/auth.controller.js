import catchAsync from "../utils/catchAsync.js";
import * as authService from "../services/auth.service.js";
import { findOnboardingByEmail } from "../repositories/auth.repository.js";

export const requestOnboardingEmail = catchAsync(async (req, res, next) => {
  const email = req.body.email;

  if (!email) {
    return res
      .status(400)
      .json({ message: "Email is required in the request body." });
  }

  const onboarding = await findOnboardingByEmail(email);

  if (onboarding.data.length > 0) {
    return res
      .status(400)
      .json({
        message: "An onboarding request with this email already exists.",
      });
  }

  res.status(201).json({ message: `Hello, ${onboarding.email}! Data saved` });
});
