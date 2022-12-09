export enum AuthRoutes {
  REGISTER = "/register",
  LOGIN = "/login",
}

export enum AuthErrors {
  PASSWORD_TO_WEAK = "PASSWROD_TOO_WEAK",
  WRONG_EMAIL_FORMAT = "WRONG_EMAIL_FORMAT",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  WRONG_PASSWORD = "WRONG_PASSWORD",
}

export type LogInInput = {
  email: string;
  password: string;
};
