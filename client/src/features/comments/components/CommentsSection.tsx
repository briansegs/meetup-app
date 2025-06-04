import { trpc } from "@/router";
import { Experience } from "@meetup-app/server/features/experience/models";
import CommentsList from "./CommentsList";
import { CommentCreateForm } from "./CommentCreateForm";
import { ErrorComponent } from "@/features/shared/components/ErrorComponent";

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

      <CommentCreateForm experienceId={experienceId} />

      <CommentsList
        comments={commentsQuery.data ?? []}
        isLoading={commentsQuery.isLoading}
      />
    </div>
  );
}
