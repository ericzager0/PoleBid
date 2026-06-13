import * as userService from "../services/user.service.js";
import catchAsync from "../utils/catchAsync.js";
import { requireNumber, requireString } from "../utils/validators.js";

export const getMe = catchAsync(async (req, res, next) => {
  const user = await userService.getMe(req.user.id);

  res.status(200).json({
    status: "success",
    data: user,
  });
});

export const approveAsSeller = catchAsync(async (req, res, next) => {
  const clientId = requireNumber(req.body.clientId, "clientId");
  const empleadoId = requireNumber(req.body.empleadoId, "empleadoId");

  await userService.approveAsSeller(clientId, empleadoId);

  res.status(200).json({
    status: "success",
  });
});
