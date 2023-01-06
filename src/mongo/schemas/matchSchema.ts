import { Schema, model } from "mongoose";
import { IMatch } from "../../models/match";
import { Collections } from "../types";

const matchSchema = new Schema<IMatch>({
  matchedAt: { type: Date, required: true, default: new Date() },
  musicians: { type: [String], required: true },
});

export const Match = model<IMatch>(Collections.MATCHES, matchSchema);
