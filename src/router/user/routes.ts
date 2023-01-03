import { Router } from "express";
import { isAuthenticated } from "../auth/resolvers";
import { register, logIn, you } from "./resolvers";
import { UserRoutes } from "./types";

const userRouter = Router();

userRouter.post(UserRoutes.REGISTER, register);
userRouter.post(UserRoutes.LOGIN, logIn);
userRouter.get(UserRoutes.YOU, isAuthenticated, you);

export { userRouter };
