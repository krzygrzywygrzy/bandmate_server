import { Request, Response } from "express";
import { Musician } from "../../mongo/schemas";
import { AuthErrors, LogInInput, RegisterInput } from "./types";
import * as jwt from "../../core/jwt";
import * as bcrypt from "bcrypt";
import { handleErrors } from "../../mongo/utils";

export const register = async (
  req: Request<unknown, unknown, RegisterInput>,
  res: Response
) => {
  try {
    const body = RegisterInput.parse(req.body);

    const musician = new Musician({ ...body });
    const document = await musician.save();

    const { _id } = document;

    const token = jwt.sign(_id);

    res.status(201).send({
      musician: { ...req.body, _id },
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

    const { _id, name, about } = document;
    const token = jwt.sign(_id);

    res.status(200).send({ musician: { _id, name, about }, token });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const you = (req: Request, res: Response) => {
  const { you } = req;
  res.status(200).send({ you });
};
