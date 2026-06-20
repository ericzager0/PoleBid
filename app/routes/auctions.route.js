import { Router } from "express";
import * as auctionsController from "../controllers/auctions.controller.js";

const router = Router();

router.get("/", auctionsController.getAuctions);

export default router;
