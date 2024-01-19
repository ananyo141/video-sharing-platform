import { Request, Response } from "express";
import CustomError from "@/errors";

export const routeNotFound = (_req: Request, _res: Response) => {
  throw new CustomError.NotFoundError("Bad method or route does not exist");
};
