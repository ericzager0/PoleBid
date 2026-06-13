import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", authMiddleware, userController.getMe);
router.post("/approve-as-seller", userController.approveAsSeller);

export default router;
