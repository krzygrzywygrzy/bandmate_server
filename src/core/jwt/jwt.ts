import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { CommonErrors } from "../../router";

export const jwtSecretCheck = () => {
  const jwtString = process.env.JWT_STRING;

  if (!jwtString) {
    throw Error(CommonErrors.NO_JWT_SECRET);
  }
};

const getJwtString = () => process.env.JWT_STRING!;

export const sign = (_id: Types.ObjectId) => jwt.sign({ _id }, getJwtString());

export const decode = (token: string) => jwt.verify(token, getJwtString());
