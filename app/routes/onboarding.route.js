import { Router } from "express";
import * as onboardingController from "../controllers/onboarding.controller.js";

const router = Router();

router.post("/email", onboardingController.startOnboarding);
router.get("/status", onboardingController.getOnboardingStatus);
router.post("/verify-email", onboardingController.verifyEmail);

export default router;
