import { Types } from "mongoose";

export const musiciansMock = [
  {
    _id: new Types.ObjectId("63ab2cfce8c152fff7917d98"),
    name: {
      firstName: "Jan",
    },
    contact: {
      email: "jan@wp.pl",
    },
    password: "Kwakwa5!",
    swipes: {
      likes: [],
      dislikes: [],
      matches: [],
    },
    about: {
      instruments: ["guitar", "voice"],
      genres: ["metal", "rock"],
      description: "Sample Description",
    },
  },
  {
    _id: new Types.ObjectId("63ab2cfce8c152fff7917d99"),
    name: {
      firstName: "Jan",
    },
    contact: {
      email: "jan2@wp.pl",
    },
    password: "Kwakwa5!",
    swipes: {
      likes: [],
      dislikes: [],
      matches: [],
    },
    about: {
      instruments: ["guitar", "voice"],
      genres: ["rock", "pop"],
      description: "Sample Description",
    },
  },
];
