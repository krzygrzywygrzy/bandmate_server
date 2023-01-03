import { Response } from "express";
import { Error } from "mongoose";
import { ZodError } from "zod";
import { CommonErrors } from "../../router";

export enum MongoErrorCodes {
  DUPLICATE = "E11000",
}

export const mapValidationError = (error: Error.ValidationError) => {
  const splittedMessage = error.message.split(":");

  return splittedMessage[splittedMessage.length - 1].trim();
};

export const handleErrors = (res: Response, error: unknown) => {
  console.log(error);

  if ((error as Error).message.includes(MongoErrorCodes.DUPLICATE)) {
    res.status(400).send({ error: CommonErrors.ITEM_ALREADY_EXISTS });
    return;
  }

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
