// middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const authMiddleware = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new AppError("No hay token de autenticación", 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decoded;

  next();
});
