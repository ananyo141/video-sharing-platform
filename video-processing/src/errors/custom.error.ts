export class CustomApiError extends Error {
  statusCode: number;
  errors: any[];
  constructor(message: string, statusCode: number, errors: any = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
