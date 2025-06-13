import { User } from "@meetup-app/server/database/schema";

type UserWithFollowCount = User & {
  followersCount: number;
  followingCount: number;
};

type UserWithHostedExperiences = User & {
  hostedExperiencesCount: number;
};

export type UserForList = User;

export type UserForDetails = UserWithFollowCount & UserWithHostedExperiences;
