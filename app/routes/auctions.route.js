import { Router } from "express";
import * as auctionsController from "../controllers/auctions.controller.js";

const router = Router();

router.get("/", auctionsController.getAuctions);

router.get("/:id", auctionsController.getAuctionById);

export default router;
