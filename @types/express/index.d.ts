import { IMusician } from "../../src/models/musician";

declare global {
  namespace Express {
    interface Request {
      you: IMusician;
    }
  }
}
