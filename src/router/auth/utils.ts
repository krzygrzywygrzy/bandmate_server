import { Error } from "mongoose";
import { CommonErrors } from "../types";

export const mapErrors = (error: Error.ValidationError) => {
  //TODO: implement
  console.log(error);

  return CommonErrors.BAD_REQUEST;
};
