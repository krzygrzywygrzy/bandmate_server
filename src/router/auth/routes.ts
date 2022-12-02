import { Router } from "express";
import { register, logIn } from "./resolvers";
import { AuthRoutes } from "./types";

const authRouter = Router();

authRouter.post(AuthRoutes.REGISTER, register);
authRouter.post(AuthRoutes.LOGIN, logIn)

export { authRouter };
