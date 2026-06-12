import * as paymentMethodsService from "../services/payment-methods.service.js";
import catchAsync from "../utils/catchAsync.js";
import { requireNumber, requireString } from "../utils/validators.js";

export const addCard = catchAsync(async (req, res, next) => {
  const number = requireString(req.body.number, "number");
  const expMonth = requireString(req.body.expMonth, "expMonth");
  const expYear = requireString(req.body.expYear, "expYear");

  const userId = req.user.id;

  await paymentMethodsService.addCard(number, expMonth, expYear, userId);

  res.status(200).json({
    status: "success",
  });
});
