import { Schema, model } from "mongoose";
import { IMatch } from "../../models/match";
import { Collections } from "../types";

const matchSchema = new Schema<IMatch>({
  matchedAt: { type: Date, required: true },
  musicians: { type: [String], required: true },
});

matchSchema.pre("save", function () {
  this.matchedAt = new Date();
});

export const Match = model<IMatch>(Collections.MATCHES, matchSchema);
