import * as userService from "../services/user.service.js";
import catchAsync from "../utils/catchAsync.js";

export const getMe = catchAsync(async (req, res, next) => {
  const user = await userService.getMe(req.user.id);

  res.status(200).json({
    status: "success",
    data: user,
  });
});
