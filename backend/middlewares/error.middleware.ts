import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      data: null,
      errors: err.errors || null,
    });
  }

  console.error("Unexpected Error:", err);

  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Internal Server Error",
    data: null,
    errors: null,
  });
};
