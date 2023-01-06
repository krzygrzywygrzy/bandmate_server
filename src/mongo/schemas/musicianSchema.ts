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
  name: { firstName: { type: String, required: true } },
  contact: {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validateEmail, AuthErrors.WRONG_EMAIL_FORMAT],
    },
    phoneNumber: { number: String, prefix: String, required: false },
  },
  password: {
    type: String,
    validate: [validatePassword, AuthErrors.PASSWORD_TO_WEAK],
  },
  about: {
    instruments: { type: [String], default: [] },
    genres: { type: [String], default: [] },
    description: { type: String },
  },
  swipes: {
    likes: { type: [String], default: [] },
    dislikes: { type: [String], default: [] },
    matches: { type: [String], default: [] },
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

  next();
});

export const Musician = model<IMusician>(Collections.MUSICIANS, musicianSchema);
