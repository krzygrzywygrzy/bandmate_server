export enum Routes {
  MUSICIANS = "/musicians",
  AUTH = "/auth",
  USER = "/user",
  MESSAGES = "/messages",
}

export enum CommonErrors {
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHENTICATED = "UNAUTHENTICATED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  NO_JWT_SECRET = "NO_JWT_SECRET",
  NOT_FOUND = "NOT_FOUND",
  ITEM_ALREADY_EXISTS = "ITEM_ALREADY_EXISTS",
  FORBIDDEN = "FORBIDDEN",
}
