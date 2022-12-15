import { Router } from "express";
import { isAuthenticated } from "../auth/resolvers";
import { getMusicians } from "./resolvers";
import { MusicianRoutes } from "./types";

const musicianRouter = Router();

musicianRouter.get(MusicianRoutes.GET, isAuthenticated, getMusicians);

export { musicianRouter };
