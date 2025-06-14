import { trpc } from "@/router";
import { Experience } from "@meetup-app/server/features/experience/models";
import CommentsList from "./CommentsList";
import { CommentCreateForm } from "./CommentCreateForm";
import { ErrorComponent } from "@/features/shared/components/ErrorComponent";
import Card from "@/features/shared/components/ui/Card";
import Spinner from "@/features/shared/components/ui/Spinner";

type CommentsSectionProps = {
  experienceId: Experience["id"];
  commentsCount: number;
};

export function CommentsSection({
  experienceId,
  commentsCount,
}: CommentsSectionProps) {
  const commentsQuery = trpc.comments.byExperienceId.useQuery({ experienceId });

  const experienceQuery = trpc.experiences.byId.useQuery({ id: experienceId });

  if (commentsQuery.error || experienceQuery.error) {
    return <ErrorComponent />;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Comments ({commentsCount})</h3>

      {commentsQuery.isPending || experienceQuery.isPending ? (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      ) : (
        <>
          <Card>
            <CommentCreateForm experience={experienceQuery.data} />
          </Card>

          <CommentsList comments={commentsQuery.data} />
        </>
      )}
    </div>
  );
}
