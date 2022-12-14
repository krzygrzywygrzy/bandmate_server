import { Router } from "express";
import { MessagesRoutes } from "./types";
import { getMessages, sendMessage } from "./resolvers";
import { isAuthenticated } from "../../common/auth";

const messagesRouter = Router();

messagesRouter.get(MessagesRoutes.GET, isAuthenticated, getMessages);
messagesRouter.post(MessagesRoutes.SEND, isAuthenticated, sendMessage);

export { messagesRouter };
