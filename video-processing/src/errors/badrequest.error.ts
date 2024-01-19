import { CustomApiError } from "./custom.error";
import { StatusCodes } from "http-status-codes";

class BadRequestError extends CustomApiError {
  errors: any[];
  constructor(message: string, errors: any = []) {
    super(message, StatusCodes.BAD_REQUEST);
    this.errors = errors;
  }
}

export { BadRequestError };
