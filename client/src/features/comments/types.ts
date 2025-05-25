import { Comment, User } from "@meetup-app/server/database/schema";

type CommentWithUser = Comment & {
  user: User;
};

export type CommentForList = CommentWithUser;
