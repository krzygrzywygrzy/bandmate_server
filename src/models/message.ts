export type IMessage = {
  _id?: string;
  matchId: string;
  message: string;
  sentBy: string;
  when: Date;
};
