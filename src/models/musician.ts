import { Types } from "mongoose";

export type IMusician = {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  instruments: string[];
  genres: string[];
  likes: string[];
};
