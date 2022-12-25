import { Schema, Types, model } from "mongoose";
import { IMusician } from "../../models/musician";
import { AuthErrors } from "../../router/user/types";
import { Collections } from "../types";
import { emailRegex, saltRounds, strongPasswordRegex } from "./utils";
import * as bcrypt from "bcrypt";
import { CommonErrors } from "../../router";

const validateEmail = (email: string) => emailRegex.test(email);
const validatePassword = (password: string) =>
  strongPasswordRegex.test(password);

const musicianSchema = new Schema<IMusician>({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validateEmail, AuthErrors.WRONG_EMAIL_FORMAT],
  },
  password: {
    type: String,
    validate: [validatePassword, AuthErrors.PASSWORD_TO_WEAK],
  },
  instruments: {
    type: [String],
  },
  genres: {
    type: [String],
  },
  matches: {
    type: [Types.ObjectId],
  },
});

musicianSchema.pre("save", async function (next) {
  const { password } = this;

  if (!password) {
    throw Error(CommonErrors.BAD_REQUEST);
  }

  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);

  this.password = hashedPassword;
  this.instruments = [];
  this.genres = [];
  this.matches = [];
  next();
});

export const Musician = model<IMusician>(Collections.MUSICIANS, musicianSchema);
