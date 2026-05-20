//Routes - For the whole auth process
import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";

const router = Router();

router.post("/onboarding/email", authController.requestOnboardingEmail);

export default router;
