import { Request } from "express";
import { validate } from "validate.js";
import { DefaultResponse } from "./interfaces";

export interface Validations {
  body?: any;
  query?: any;
  params?: any;
}

export const validateRequest = (request: Request, validations: Validations): DefaultResponse<void> => {
  let success = true;
  const errors = {};

  const validation = Object.keys(validations).map((key) => {
    const error = validate(request[key], validations[key]);
    if (error) {
      errors[key] = error;
      success = false;
    }
  });

  return { success, errors };
};
