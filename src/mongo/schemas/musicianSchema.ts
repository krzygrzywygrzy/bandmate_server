import { Schema, model } from "mongoose";
import { IMusician } from "../../models/musician";
import { Collections } from "../types";

const musicianSchema = new Schema<IMusician>({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

export const Musician = model<IMusician>(Collections.MUSICIANS, musicianSchema);
