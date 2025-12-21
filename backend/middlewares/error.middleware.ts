import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

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

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e: any) => e.message);

    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Validation Error",
      data: null,
      errors,
    });
  }

  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Internal Server Error",
    data: null,
    errors: null,
  });
};
