import { User } from "@meetup-app/server/database/schema";

type UserWithFollowCount = User & {
  followersCount: number;
  followingCount: number;
};

type UserWithHostedExperiences = User & {
  hostedExperiencesCount: number;
};

export type UserWithUserContext = User & {
  isFollowing: boolean;
};

export type UserForList = User & UserWithUserContext;

export type UserForDetails = UserWithFollowCount &
  UserWithHostedExperiences &
  UserWithUserContext;
