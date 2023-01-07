import { Types } from "mongoose";

export const authHeader = { Authorization: "Bearer token" };

export const musiciansMock = [
  {
    _id: new Types.ObjectId("63ab2cfce8c152fff7917d98"),
    name: {
      firstName: "Jan",
    },
    contact: {
      email: "user1@email.com",
    },
    password: "Kwakwa5!",
    swipes: {
      likes: ["63ab2cfce8c152fff7917d12"],
      dislikes: [],
      matches: ["63ab2cfce8c152fff7917d11"],
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
      email: "user2@email.com",
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
  {
    _id: new Types.ObjectId("63ab2cfce8c152fff7917d10"),
    name: {
      firstName: "Jan",
    },
    contact: {
      email: "user3@email.com",
    },
    password: "Kwakwa5!",
    swipes: {
      likes: [],
      dislikes: [],
      matches: [],
    },
    about: {
      instruments: ["guitar", "voice"],
      genres: ["rap", "r&b"],
      description: "Sample Description",
    },
  },
  {
    _id: new Types.ObjectId("63ab2cfce8c152fff7917d11"),
    name: {
      firstName: "Jan",
    },
    contact: {
      email: "user4@email.com",
    },
    password: "Kwakwa5!",
    swipes: {
      likes: ["63ab2cfce8c152fff7917d98"], //has previously liked user1
      dislikes: [],
      matches: [],
    },
    about: {
      instruments: ["guitar", "voice"],
      genres: ["metal"],
      description: "Sample Description",
    },
  },
  {
    _id: new Types.ObjectId("63ab2cfce8c152fff7917d12"),
    name: {
      firstName: "Jan",
    },
    contact: {
      email: "user5@email.com",
    },
    password: "Kwakwa5!",
    swipes: {
      likes: ["63ab2cfce8c152fff7917d98"], //has previously liked user1
      dislikes: [],
      matches: ["63ab2cfce8c152fff7917d11"], //has matched with user1
    },
    about: {
      instruments: ["guitar", "voice"],
      genres: ["metal"],
      description: "Sample Description",
    },
  },
];

export const matchesMock = [
  {
    _id: new Types.ObjectId("63ab2cfce8c152fff7917d11"),
    musicians: ["63ab2cfce8c152fff7917d12", "63ab2cfce8c152fff7917d98"],
  },
];
