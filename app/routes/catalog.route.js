import { Router } from "express";
import * as CatalogController from "../controllers/catalog.controller.js";

const router = Router();

router.post("/items", CatalogController.addItem);

export default router;
