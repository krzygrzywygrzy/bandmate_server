import { Router } from "express";
import { getMusicians, getYourMatches, like } from "./resolvers";
import { MusicianRoutes } from "./types";
import { isAuthenticated } from "../../common/auth";

const musicianRouter = Router();

musicianRouter.get(MusicianRoutes.GET, isAuthenticated, getMusicians);
musicianRouter.post(MusicianRoutes.LIKE, isAuthenticated, like);
musicianRouter.get(MusicianRoutes.MATCHES, isAuthenticated, getYourMatches);

export { musicianRouter };
