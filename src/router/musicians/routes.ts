import { Router } from "express";
import { getMusicians } from "./resolvers";
import { MusicianRoutes } from "./types";

const musicianRouter = Router();

musicianRouter.get(MusicianRoutes.GET, getMusicians);

export { musicianRouter };
