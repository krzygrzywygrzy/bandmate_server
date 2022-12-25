import { Router } from "express";
import { isAuthenticated } from "../auth/resolvers";
import { register, logIn, postRegisterUpdate, you } from "./resolvers";
import { UserRoutes } from "./types";

const userRouter = Router();

userRouter.post(UserRoutes.REGISTER, register);
userRouter.post(UserRoutes.LOGIN, logIn);
userRouter.put(UserRoutes.POST_REGISTER, isAuthenticated, postRegisterUpdate);
userRouter.get(UserRoutes.YOU, isAuthenticated, you);

export { userRouter };
