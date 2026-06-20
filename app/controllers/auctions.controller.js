import catchAsync from "../utils/catchAsync.js";
import * as auctionsService from "../services/auctions.service.js";

export const getAuctions = catchAsync(async (req, res) => {
  const auctions = await auctionsService.getAuctions();

  res.status(200).json({
    status: "success",
    data: auctions,
  });
});
