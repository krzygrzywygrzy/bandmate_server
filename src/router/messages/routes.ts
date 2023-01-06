import { Router } from "express";
import { MessagesRoutes } from "./types";
import { isAuthenticated } from "../../common/auth";
import { getMessages, sendMessage } from "./resolvers";

const messagesRouter = Router();

messagesRouter.get(MessagesRoutes.GET, isAuthenticated, getMessages);
messagesRouter.post(MessagesRoutes.SEND, isAuthenticated, sendMessage);

export { messagesRouter };
