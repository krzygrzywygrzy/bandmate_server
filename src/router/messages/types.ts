import { z } from "zod";

export enum MessagesRoutes {
  SEND = "/send",
  GET = "/:matchId",
}

export const SendMessageInput = z.object({
  message: z.string(),
  matchId: z.string(),
});

export type SendMessageInput = z.infer<typeof SendMessageInput>;
