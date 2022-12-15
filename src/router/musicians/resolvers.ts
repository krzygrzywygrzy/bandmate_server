import { Request, Response } from "express";
import { Musician } from "../../mongo/schemas";
import { excludePasswordAndVersion, handleErrors } from "../../mongo/utils";
import { CommonErrors } from "../types";
import { MusicianMessages } from "./types";

export const getMusicians = async (req: Request, res: Response) => {
  try {
    const { _id, genres } = req.you;

    const response = await Musician.find({
      _id: { $ne: _id },
      genres: { $in: genres },
    }).select(excludePasswordAndVersion);

    res.status(200).send(response);
  } catch (error) {
    handleErrors(res, error);
  }
};
