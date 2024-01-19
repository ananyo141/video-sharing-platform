import { CustomApiError } from "./custom.error";
import { StatusCodes } from "http-status-codes";

class ForbiddenError extends CustomApiError {
  constructor(message: string) {
    super(message, StatusCodes.FORBIDDEN);
  }
}

export { ForbiddenError };
