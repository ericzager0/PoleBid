import catchAsync from "../utils/catchAsync.js";
import * as auctionsService from "../services/auctions.service.js";

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
