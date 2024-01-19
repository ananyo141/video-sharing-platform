import { CustomApiError } from "./custom.error";
import { StatusCodes } from "http-status-codes";

class UnauthorizedError extends CustomApiError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

export { UnauthorizedError };
