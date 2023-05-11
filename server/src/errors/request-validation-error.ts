import { ValidationError } from "express-validator";
import { SerializedError } from "./interfaces/serialized-error";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super("Request invalid");
  }

  serializeErrors(): SerializedError[] {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.type };
    });
  }
}
