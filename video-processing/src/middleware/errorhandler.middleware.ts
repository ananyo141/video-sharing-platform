// Intercept and serialize errors into readable error messages with status
// codes to be returned to the client.
import { NextFunction, Request, Response } from "express";

import logger from "@utils/logger";
import { httpResponse } from "@utils/httpResponse";
import { CustomApiError } from "@/errors/custom.error";

export const errorHandler = (
  err: CustomApiError,
  _req: Request,
  _res: Response,
  _next: NextFunction
) => {
  logger.error(`Error ${err.statusCode}: ${err.message}`);
  return _res
    .status(err.statusCode)
    .json(httpResponse(false, err.message, err.errors));
};
