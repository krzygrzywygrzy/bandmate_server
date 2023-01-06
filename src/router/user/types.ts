import { z } from "zod";

export enum UserRoutes {
  REGISTER = "/register",
  LOGIN = "/login",
  YOU = "/you",
}

export enum AuthErrors {
  USER_NOT_FOUND = "USER_NOT_FOUND",
  //PASSWORD
  WRONG_PASSWORD = "WRONG_PASSWORD",
  PASSWORD_REQUIRED = "PASSWORD_REQUIRED",
  PASSWORD_TO_WEAK = "PASSWROD_TOO_WEAK",
  //EMAIL
  WRONG_EMAIL_FORMAT = "WRONG_EMAIL_FORMAT",
  EMAIL_REQUIRED = "EMAIL_REQUIRED",
  //NAME
  NAME_REQUIRED = "NAME_REQUIRED",
}

export const LogInInput = z.object({
  email: z.string({ required_error: AuthErrors.PASSWORD_REQUIRED }),
  password: z.string(),
});

export type LogInInput = z.infer<typeof LogInInput>;

export const RegisterInput = z.object({
  name: z.object({
    firstName: z.string({ required_error: AuthErrors.NAME_REQUIRED }),
    lastName: z.string().optional(),
  }),
  contact: z.object({
    email: z.string({ required_error: AuthErrors.EMAIL_REQUIRED }),
    phoneNumber: z
      .object({ number: z.string(), prefix: z.string() })
      .optional(),
  }),
  password: z.string({ required_error: AuthErrors.PASSWORD_REQUIRED }),
  about: z.object({
    instruments: z.array(z.string()).optional(),
    genres: z.array(z.string()).optional(),
  }),
});

export type RegisterInput = z.infer<typeof RegisterInput>;
