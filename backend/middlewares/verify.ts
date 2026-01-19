import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { DecodedUser } from "../types/index.d";
import User from "../models/UserSchema.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { UserRole } from "../constants.js";

export const verifyToken = AsyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new ApiError(req.t("common:unauthorized"), 401);
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error("ACCESS_TOKEN_SECRET is missing");
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
      ) as DecodedUser;

      const user = await User.findById(decoded._id).select(
        "-password -refreshToken",
      );

      if (!user) {
        throw new ApiError(req.t("common:userNotFound"), 401);
      }

      req.user = decoded;
      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw new ApiError(req.t("common:unauthorized"), 401);
      }
      throw new ApiError(req.t("common:unauthorized"), 401);
    }
  },
);

export const verifyPermission = (roles: UserRole[] = []) => {
  return AsyncHandler(
    async (req: Request, _res: Response, next: NextFunction) => {
      if (!req.user?._id) {
        throw new ApiError(req.t("common:unauthorized"), 401);
      }

      if (roles.includes(req.user?.role as UserRole)) {
        next();
      } else {
        throw new ApiError(req.t("common:unauthorized"), 403);
      }
    },
  );
};
