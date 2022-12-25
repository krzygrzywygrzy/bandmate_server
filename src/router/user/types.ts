import { z } from "zod";

export enum UserRoutes {
  REGISTER = "/register",
  LOGIN = "/login",
  POST_REGISTER = "/postRegister",
  YOU = "/you",
}

export enum AuthErrors {
  PASSWORD_TO_WEAK = "PASSWROD_TOO_WEAK",
  WRONG_EMAIL_FORMAT = "WRONG_EMAIL_FORMAT",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  WRONG_PASSWORD = "WRONG_PASSWORD",
}

export const LogInInput = z.object({
  email: z.string(),
  password: z.string(),
});

export type LogInInput = z.infer<typeof LogInInput>;

export const PostRegisterInput = z.object({
  genres: z.array(z.string()),
  instruments: z.array(z.string()),
});

export type PostRegisterInput = z.infer<typeof PostRegisterInput>;
