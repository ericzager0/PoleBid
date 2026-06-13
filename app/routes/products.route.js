import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import * as productsController from "../controllers/products.controller.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "foto1", maxCount: 1 },
    { name: "foto2", maxCount: 1 },
    { name: "foto3", maxCount: 1 },
    { name: "foto4", maxCount: 1 },
    { name: "foto5", maxCount: 1 },
    { name: "foto6", maxCount: 1 },
  ]),
  productsController.newProduct,
);

export default router;
