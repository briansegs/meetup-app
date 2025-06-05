import { User } from "@meetup-app/server/database/schema";

type UserWithHostedExperiences = User & {
  hostedExperiencesCount: number;
};

export type UserForDetails = UserWithHostedExperiences;
