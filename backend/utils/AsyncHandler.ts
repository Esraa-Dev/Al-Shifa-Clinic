import { Request, Response, NextFunction } from "express";

type controllerFunc = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const AsyncHandler = (CtrFunc: controllerFunc) => {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(CtrFunc(req, res, next)).catch((err) => next(err));
  };
};
