import catchAsync from "../utils/catchAsync.js";
import * as authService from "../services/auth.service.js";

export const register = catchAsync(async (req, res) => {
  const email = requireString(req.body.email, "email");
  const password = requireString(req.body.password, "password");
  const user = await authService.register(email, password);

  res.status(201).json({
    status: "success",
  });
});
