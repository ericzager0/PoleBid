import * as paymentMethodsService from "../services/payment-methods.service.js";
import catchAsync from "../utils/catchAsync.js";
import { requireNumber, requireString } from "../utils/validators.js";

export const addCard = catchAsync(async (req, res, next) => {
  const number = requireString(req.body.number, "number");
  const expMonth = requireString(req.body.expMonth, "expMonth");
  const expYear = requireString(req.body.expYear, "expYear");
  const owner = requireString(req.body.owner, "owner");
  const tope = requireNumber(req.body.tope, "tope");

  const userId = req.user.id;

  await paymentMethodsService.addCard(number, expMonth, expYear, owner, tope, userId);

  res.status(200).json({
    status: "success",
  });
});

export const addBankAccount = catchAsync(async (req, res, next) => {
  const bankName = requireString(req.body.bankName, "bankName");
  const owner = requireString(req.body.owner, "owner");
  const cuil = requireString(req.body.cuil, "cuil");
  const cbu = requireString(req.body.cbu, "cbu");

  const reservedFunds =
    req.body.reservedFunds !== undefined
      ? requireNumber(req.body.reservedFunds, "reservedFunds")
      : 0;

  const userId = req.user.id;

  await paymentMethodsService.addBankAccount(
    bankName,
    owner,
    cuil,
    cbu,
    reservedFunds,
    userId,
  );

  res.status(200).json({
    status: "success",
  });
});

export const addCheck = catchAsync(async (req, res, next) => {
  const bankName = requireString(req.body.bankName, "bankName");
  const owner = requireString(req.body.owner, "owner");
  const number = requireNumber(req.body.number, "number");
  const currency = requireString(req.body.currency, "currency");
  const amount = requireNumber(req.body.amount, "amount");
  const issueDate = requireString(req.body.issueDate, "issueDate");

  const userId = req.user.id;

  await paymentMethodsService.addCheck(
    bankName,
    owner,
    number,
    currency,
    amount,
    issueDate,
    userId,
  );

  res.status(200).json({
    status: "success",
  });
});
