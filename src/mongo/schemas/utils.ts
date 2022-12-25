export const strongPasswordRegex =
  /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;

export const emailRegex = /.+\@.+\..+/;

export const saltRounds = 10;
