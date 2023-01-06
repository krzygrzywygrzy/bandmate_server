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
    const {
      _id,
      about: { genres },
    } = req.you;

    const musicians = await Musician.find({
      _id: { $ne: _id },
      "about.genres": { $in: genres },
    }).select(excludePasswordAndVersion);

    res.status(200).send({ musicians });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const like = async (
  req: Request<unknown, unknown, { id: string }>,
  res: Response
) => {
  try {
    const { _id: yourId } = req.you;
    const { id: likedId } = req.body;

    const liked = await Musician.findById(likedId);
    if (!liked) {
      res.status(404).send({ error: CommonErrors.NOT_FOUND });
      return;
    }
    const {
      swipes: { likes },
    } = liked;

    if (likes.includes(yourId!)) {
      //it's a match
      const session = await Musician.startSession();

      const match = await session.withTransaction(async () => {
        const { _id } = await Match.create({ musicians: [yourId, likedId] });

        await Musician.findByIdAndUpdate(yourId, {
          $addToSet: { "swipes.matches": _id, "swipes.likes": likedId },
        });

        return await Musician.findByIdAndUpdate(likedId, {
          $addToSet: { "swipes.matches": _id },
        }).select({
          ...excludePasswordAndVersion,
          ...excludeLikesAndMatches,
        });
      });

      session.endSession();

      res.status(200).send({ message: MusicianMessages.MATCH, match });

      return;
    }

    await Musician.findByIdAndUpdate(yourId, {
      $addToSet: { "swipes.likes": likedId },
    });
    res.status(200).send({ message: MusicianMessages.LIKED });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const dislike = async (
  req: Request<unknown, unknown, { id: string }>,
  res: Response
) => {
  try {
    const {
      body: { id: dislikeId },
      you: { _id },
    } = req;

    await Musician.findByIdAndUpdate(_id, {
      $addToSet: { "swipes.dislikes": dislikeId },
    });

    res.status(200).send({ ok: true });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const getYourMatches = async (req: Request, res: Response) => {
  try {
    const {
      you: { swipes },
    } = req;
    const matches = await Match.find({ _id: { $in: swipes.matches } });
    res.status(200).send({ matches });
  } catch (error) {
    handleErrors(res, error);
  }
};
