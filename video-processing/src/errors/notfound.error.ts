import { CustomApiError } from "./custom.error";
import { StatusCodes } from "http-status-codes";

class NotFoundError extends CustomApiError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND);
  }
}

export { NotFoundError };
