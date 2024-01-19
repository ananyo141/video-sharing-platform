import { CustomApiError } from "./custom.error";
import { StatusCodes } from "http-status-codes";

class InternalServerError extends CustomApiError {
  constructor(message: string) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export { InternalServerError };
