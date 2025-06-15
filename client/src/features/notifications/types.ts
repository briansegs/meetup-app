import { Notification } from "@meetup-app/server/database/schema";

type NotificationWithContent = Notification & {
  content: string;
};

export type NotificationForList = NotificationWithContent;
