import { Router } from "express";
import * as paymentMethodsController from "../controllers/payment-methods.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/cards", authMiddleware, paymentMethodsController.addCard);

export default router;
