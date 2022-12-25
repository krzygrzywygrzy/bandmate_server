import { Router } from "express";
import { isAuthenticated } from "../auth/resolvers";
import { getMusicians, getYourMatches, like } from "./resolvers";
import { MusicianRoutes } from "./types";

const musicianRouter = Router();

musicianRouter.get(MusicianRoutes.GET, isAuthenticated, getMusicians);
musicianRouter.post(MusicianRoutes.LIKE, isAuthenticated, like);
musicianRouter.get(MusicianRoutes.MATCHES, isAuthenticated, getYourMatches);

export { musicianRouter };
