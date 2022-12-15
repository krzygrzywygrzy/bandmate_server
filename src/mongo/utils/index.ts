import { Response } from "express";
import { Error } from "mongoose";
import { ZodError } from "zod";
import { CommonErrors } from "../../router";

export const excludePasswordAndVersion = {
  password: 0,
  __v: 0,
};

export const mapValidationError = (error: Error.ValidationError) => {
  const splittedMessage = error.message.split(":");

  return splittedMessage[splittedMessage.length - 1].trim();
};

export const handleErrors = (res: Response, error: unknown) => {
  if (error instanceof ZodError) {
    res.status(400).send({ error: CommonErrors.BAD_REQUEST });
    return;
  }

  if (error instanceof Error.ValidationError) {
    const errorMessage = mapValidationError(error);
    res.status(400).send({ error: errorMessage });
    return;
  }

  res.status(500).send({ error: CommonErrors.UNKNOWN_ERROR });
};
