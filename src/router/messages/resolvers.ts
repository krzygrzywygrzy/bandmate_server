import { Request, Response } from "express";
import { handleErrors } from "../../mongo/utils";
import { CommonErrors } from "../types";
import { SendMessageInput } from "./types";
import { Message } from "../../mongo/schemas/messageSchema";
import { Match } from "../../mongo/schemas/matchSchema";

// TODO: integrate web sockets so user does not have to refresh messages by hand

export const sendMessage = async (
  req: Request<unknown, unknown, SendMessageInput>,
  res: Response
) => {
  try {
    const {
      you: { _id: sentBy },
      body,
    } = req;

    if (!sentBy) {
      res.status(400).send({ error: CommonErrors.UNKNOWN_ERROR });
      return;
    }

    const data = SendMessageInput.parse(body);
    await Message.create({ ...data, sentBy });

    res.status(200).send({ ok: true });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const getMessages = async (
  req: Request<unknown, unknown, unknown, { matchId: string }>,
  res: Response
) => {
  try {
    const {
      query: { matchId },
      you: { _id },
    } = req;

    const match = await Match.findById(matchId).select({ musicians: 1 });

    if (!match) {
      res.status(404).send({ error: CommonErrors.NOT_FOUND });
      return;
    }

    const { musicians } = match;
    if (!musicians.includes(_id!)) {
      res.status(403).send({ error: CommonErrors.FORBIDDEN });
      return;
    }
  } catch (error) {
    handleErrors(res, error);
  }
};
