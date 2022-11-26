import { Request, Response } from "express";
import { Musician } from "../../mongo/schemas";

export const getMusicians = async (_: Request, res: Response) => {
  const response = await Musician.find();
  res.status(200).send(response);
};
