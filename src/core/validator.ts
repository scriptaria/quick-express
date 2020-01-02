import { Request } from "express";
import { validate } from "validate.js";
import { DefaultResponse } from "./interfaces";

interface Validations {
  body?: any;
  query?: any;
  parameters?: any;
}

export class Validator {
  public static validate(request: Request, validations: Validations): DefaultResponse {

    let success = true;
    const errors = {};

    for (const key in validations) {
      if (validations.hasOwnProperty(key)) {
        const error = validate(request[key], validations[key]);
        if (error) {
          errors[key] = error;
          success = false;
        }
      }
    }

    return { success, errors };
  }
}
