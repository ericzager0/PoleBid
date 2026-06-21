import catchAsync from "../utils/catchAsync.js";
import * as auctionsService from "../services/auctions.service.js";

export const getProductInfo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const productInfo = await auctionsService.getProductInfo(id);

  res.status(200).json({
    status: "success",
    data: productInfo,
  });
});

export const getAuctions = catchAsync(async (req, res) => {
  const auctions = await auctionsService.getAuctions();

  res.status(200).json({
    status: "success",
    data: auctions,
  });
});

export const getAuctionById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const auction = await auctionsService.getAuctionById(id);

  res.status(200).json({
    status: "success",
    data: auction,
  });
});

export const getCurrentItem = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { bidsonly } = req.query;

  const currentItem = await auctionsService.getCurrentItem(id, userId);

  const { fotos, ...itemSinFotos } = currentItem;

  const data = bidsonly === "true" ? itemSinFotos : currentItem;

  res.status(200).json({
    status: "success",
    data,
  });
});

export const placeBid = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id, itemId } = req.params;
  const { amount } = req.body;

  await auctionsService.placeBid(id, itemId, userId, amount);

  res.status(200).json({
    status: "success",
    message: "Bid placed successfully",
  });
});
