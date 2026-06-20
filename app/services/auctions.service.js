import * as auctionsRepository from "../repositories/auctions.repository.js";

export const getAuctions = async () => {
  return await auctionsRepository.getAuctions();
};
