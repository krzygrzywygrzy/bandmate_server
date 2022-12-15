import { NextFunction, Request, Response } from "express";
import { CommonErrors } from "../types";
import * as jwt from "../../core/jwt";
import { JwtPayload } from "jsonwebtoken";
import { Musician } from "../../mongo/schemas";
import { excludePasswordAndVersion } from "../../mongo/utils";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.decode(token);
    const { _id } = decoded as JwtPayload;

    const musician = await Musician.findById(_id).select(
      excludePasswordAndVersion
    );

    if (!musician) {
      throw new Error();
    }

    req.you = musician;

    next();
  } catch (_) {
    res.status(401).send({ error: CommonErrors.UNAUTHENTICATED });
  }
};
