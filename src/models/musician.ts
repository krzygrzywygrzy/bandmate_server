import { PhoneNumber } from "./phoneNumber";

export type IMusician = {
  _id: string;
  name: { firstName: string; lastName?: string };
  contact: { email: string; phoneNumber?: PhoneNumber };
  password?: string;
  about: {
    instruments: string[];
    genres: string[];
    desciption?: string;
  };
  swipes: {
    likes: string[];
    matches: string[];
    dislikes: string[];
  };
};
