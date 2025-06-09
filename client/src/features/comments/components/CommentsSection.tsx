import { trpc } from "@/router";
import { Experience } from "@meetup-app/server/features/experience/models";
import CommentsList from "./CommentsList";
import { CommentCreateForm } from "./CommentCreateForm";
import { ErrorComponent } from "@/features/shared/components/ErrorComponent";
import Card from "@/features/shared/components/ui/Card";

type CommentsSectionProps = {
  experienceId: Experience["id"];
  commentsCount: number;
};

export function CommentsSection({
  experienceId,
  commentsCount,
}: CommentsSectionProps) {
  const commentsQuery = trpc.comments.byExperienceId.useQuery(
    { experienceId },
    {
      enabled: commentsCount > 0,
    },
  );

  if (commentsQuery.error) {
    return <ErrorComponent />;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Comments ({commentsCount})</h3>

      <Card>
        <CommentCreateForm experienceId={experienceId} />
      </Card>

      <CommentsList
        comments={commentsQuery.data ?? []}
        isLoading={commentsQuery.isLoading}
      />
    </div>
  );
}
