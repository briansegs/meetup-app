import Spinner from "@/features/shared/components/ui/Spinner";

import { NotificationCard } from "./NotificationCard";
import { NotificationForList } from "../types";

type NotificationListProps = {
  notifications: NotificationForList[];
  isLoading?: boolean;
};

export function NotificationList({
  notifications,
  isLoading,
}: NotificationListProps) {
  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}

      {isLoading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {!isLoading && notifications.length === 0 && (
        <div className="flex justify-center">No Notifications yet</div>
      )}
    </div>
  );
}
