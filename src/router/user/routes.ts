import { Router } from "express";
import { register, logIn, you } from "./resolvers";
import { UserRoutes } from "./types";
import { isAuthenticated } from "../../common/auth";

const userRouter = Router();

userRouter.post(UserRoutes.REGISTER, register);
userRouter.post(UserRoutes.LOGIN, logIn);
userRouter.get(UserRoutes.YOU, isAuthenticated, you);

export { userRouter };
