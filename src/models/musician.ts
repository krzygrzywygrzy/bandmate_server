export type IMusician = {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  instruments: string[];
  genres: string[];
  likes: string[];
  matches: string[];
};
