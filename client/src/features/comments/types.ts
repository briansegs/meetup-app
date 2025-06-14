import { Comment, Experience, User } from "@meetup-app/server/database/schema";

type CommentWithUser = Comment & {
  user: User;
};

type CommentWithExperience = Comment & {
  experience: Experience;
};

export type CommentForList = CommentWithUser & CommentWithExperience;

export type CommentOptimistic = CommentWithUser &
  CommentWithExperience & {
    optimistic: true;
  };
