import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Button } from "@/features/shared/components/ui/Button";
import { Experience } from "@meetup-app/server/database/schema";
import { useExperienceMutations } from "../hooks/useExperienceMutations";

type ExperienceAttendButtonProps = {
  experienceId: Experience["id"];
  isAttending: boolean;
};

export function ExperienceAttendButton({
  experienceId,
  isAttending,
}: ExperienceAttendButtonProps) {
  const { currentUser } = useCurrentUser();

  const { attendMutation, unattendMutation } = useExperienceMutations();

  if (!currentUser) {
    return null;
  }

  return (
    <Button
      variant={isAttending ? "outline" : "default"}
      onClick={() => {
        if (isAttending) {
          unattendMutation.mutate({ id: experienceId });
        } else {
          attendMutation.mutate({ id: experienceId });
        }
      }}
      disabled={attendMutation.isPending}
    >
      {isAttending ? "Not Going" : "Going"}
    </Button>
  );
}
