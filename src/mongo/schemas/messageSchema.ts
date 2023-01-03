import { Schema, model } from "mongoose";
import { IMessage } from "../../models/message";
import { Collections } from "../types";

const messageSchema = new Schema<IMessage>({
  message: { type: String, required: true },
  sentBy: { type: String, required: true },
  when: { type: Date, required: true, default: new Date() },
});

export const Message = model<IMessage>(Collections.MESSAGES, messageSchema);
