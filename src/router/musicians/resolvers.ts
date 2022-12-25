import { Request, Response } from "express";
import { Musician } from "../../mongo/schemas";
import {
  excludeLikesAndMatches,
  excludePasswordAndVersion,
  handleErrors,
} from "../../mongo/utils";
import { CommonErrors } from "../types";
import { MusicianMessages } from "./types";
import { Match } from "../../mongo/schemas/matchSchema";

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

export const like = async (
  req: Request<unknown, unknown, { _id: string }>,
  res: Response
) => {
  try {
    const { _id: yourId } = req.you;
    const { _id: likedId } = req.body;

    const liked = await Musician.findById(likedId);
    if (!liked) {
      res.status(404).send({ error: CommonErrors.NOT_FOUND });
      return;
    }
    const { likes } = liked;

    if (likes.includes(yourId!)) {
      //it's a match
      const session = await Musician.startSession();

      const match = await session.withTransaction(async () => {
        const { _id } = await Match.create({ musicians: [yourId, likedId] });

        await Musician.findByIdAndUpdate(yourId, {
          $addToSet: { matches: _id, likes: likedId },
        });

        return await Musician.findByIdAndUpdate(likedId, {
          $addToSet: { matches: _id },
        }).select({
          ...excludePasswordAndVersion,
          ...excludeLikesAndMatches,
        });
      });

      session.endSession();

      res.status(200).send({ message: MusicianMessages.MATCH, match });

      return;
    }

    await Musician.findByIdAndUpdate(yourId, { $addToSet: { likes: likedId } });
    res.status(200).send({ message: MusicianMessages.LIKED });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const getYourMatches = async (req: Request, res: Response) => {
  try {
    const { you } = req;
    const matches = await Musician.findById({ _id: { $in: you.matches } });
    res.status(200).send({ matches });
  } catch (error) {
    handleErrors(res, error);
  }
};
