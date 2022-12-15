import { Request, Response } from "express";
import { IMusician } from "../../models/musician";
import { Musician } from "../../mongo/schemas";
import { AuthErrors, LogInInput, PostRegisterInput } from "./types";
import * as jwt from "../../core/jwt";
import * as bcrypt from "bcrypt";
import { handleErrors } from "../../mongo/utils";

export const register = async (
  req: Request<unknown, unknown, IMusician>,
  res: Response
) => {
  try {
    const musician = new Musician({ ...req.body });
    const document = await musician.save();

    const { _id, instruments, genres } = document;

    const token = jwt.sign(_id);

    res.status(201).send({
      musician: { ...req.body, _id, instruments, genres },
      token,
    });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const logIn = async (
  req: Request<unknown, unknown, LogInInput>,
  res: Response
) => {
  try {
    const { email, password } = LogInInput.parse(req.body);

    const document = await Musician.findOne({ email }).select({
      __v: 0,
    });

    if (!document) {
      res.status(404).send({ error: AuthErrors.USER_NOT_FOUND });
      return;
    }

    const passwordCheck = await bcrypt.compare(
      password,
      document.password ?? ""
    );

    if (!passwordCheck) {
      res.status(400).send({ error: AuthErrors.WRONG_PASSWORD });
      return;
    }

    const { _id, name, genres, instruments } = document;
    const token = jwt.sign(_id);

    res
      .status(200)
      .send({ musician: { _id, name, genres, instruments }, token });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const postRegisterUpdate = async (
  req: Request<unknown, unknown, PostRegisterInput>,
  res: Response
) => {
  try {
    const { body, you } = req;

    const { genres, instruments } = PostRegisterInput.parse(body);

    await Musician.findByIdAndUpdate(you._id, {
      $addToSet: {
        instruments: { $each: instruments },
        genres: { $each: genres },
      },
    });

    res.status(200).send({ ok: true });
  } catch (error) {
    handleErrors(res, error);
  }
};
