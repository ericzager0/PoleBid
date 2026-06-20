import * as auctionsRepository from "../repositories/auctions.repository.js";

export const getAuctions = async () => {
  return await auctionsRepository.getAuctions();
};

export const getAuctionById = async (id) => {
  return await auctionsRepository.getAuctionById(id);
};
