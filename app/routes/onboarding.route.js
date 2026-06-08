import { Router } from "express";
import * as onboardingController from "../controllers/onboarding.controller.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

router.post("/email", onboardingController.startOnboarding);
router.get("/status", onboardingController.getOnboardingStatus);
router.post("/verify-email", onboardingController.verifyEmail);
router.post(
  "/documents",
  upload.fields([
    { name: "documentFront", maxCount: 1 },
    { name: "documentBack", maxCount: 1 },
  ]),
  onboardingController.uploadDocuments,
);
router.post("/approve-documents", onboardingController.approveDocuments);
router.post("/reject-documents", onboardingController.rejectDocuments);

export default router;
