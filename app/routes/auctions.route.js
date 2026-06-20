import { Router } from "express";
import * as auctionsController from "../controllers/auctions.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", auctionsController.getAuctions);

router.get("/:id", auctionsController.getAuctionById);

router.get(
  "/:id/current-item",
  authMiddleware,
  auctionsController.getCurrentItem,
);

router.post(
  "/:id/items/:itemId/bids",
  authMiddleware,
  auctionsController.placeBid,
);

export default router;
