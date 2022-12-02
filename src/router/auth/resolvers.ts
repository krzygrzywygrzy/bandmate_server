import { Request, Response } from "express";
import { IMusician } from "../../models/musician";
import { Musician } from "../../mongo/schemas";
import { AuthErrors, LogInInput } from "./types";
import { CommonErrors } from "../types";
import { Error } from "mongoose";
import * as jwt from "jsonwebtoken";
import { mapErrors } from "./utils";
import * as bcrypt from "bcrypt";

export const register = async (
  req: Request<unknown, unknown, IMusician>,
  res: Response
) => {
  try {
    const jwtString = process.env.JWT_STRING;

    if (!jwtString) {
      res.status(500).send({ error: CommonErrors.UNKNOWN_ERROR });
      return;
    }

    const musician = new Musician({ ...req.body });
    const document = await musician.save();

    const { _id: id } = document;

    const token = jwt.sign({ id }, jwtString);

    res.status(201).send({
      musician: { ...req.body, id },
      token,
    });
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      const errorMessage = mapErrors(error);
      res.status(400).send({ error: errorMessage });
      return;
    }

    res.status(500).send({ error: CommonErrors.UNKNOWN_ERROR });
  }
};

export const logIn = async (
  req: Request<unknown, unknown, LogInInput>,
  res: Response
) => {
  const jwtString = process.env.JWT_STRING;

  if (!jwtString) {
    res.status(500).send({ error: CommonErrors.UNKNOWN_ERROR });
    return;
  }

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({ error: CommonErrors.BAD_REQUEST });
    return;
  }

  try {
    const document = await Musician.findOne({ email }).select({
      name: 1,
      password: 1,
    });

    if (!document) {
      res.status(404).send({ error: AuthErrors.USER_NOT_FOUND });
      return;
    }

    if (await bcrypt.compare(password, document.password ?? "")) {
      res.status(400).send({ error: AuthErrors.WRONG_PASSWORD });
      return;
    }

    const { name, _id: id } = document;
    const token = jwt.sign({ id }, jwtString);

    res.status(200).send({ musician: { name, email, id }, token });
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      const errorMessage = mapErrors(error);
      res.status(400).send({ error: errorMessage });
      return;
    }

    res.status(500).send({ error: CommonErrors.UNKNOWN_ERROR });
  }
};
