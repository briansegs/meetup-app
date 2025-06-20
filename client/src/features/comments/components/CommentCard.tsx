import Card from "@/features/shared/components/ui/Card";
import { CommentForList, CommentOptimistic } from "../types";
import { useState } from "react";
import { CommentEditForm } from "./CommentEditForm";
import { Button } from "@/features/shared/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/shared/components/ui/Dialog";
import { trpc } from "@/router";
import { useToast } from "@/features/shared/hooks/useToast";
import { UserAvatar } from "@/features/users/components/UserAvatar";
import Link from "@/features/shared/components/ui/Link";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

type CommentCardProps = {
  comment: CommentForList;
};

export function CommentCard({ comment }: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return <CommentEditForm comment={comment} setIsEditing={setIsEditing} />;
  }

  return (
    <Card className="space-y-4">
      <CommentCardHeader comment={comment} />
      <CommentCardContent comment={comment} />
      <CommentCardButtons setIsEditing={setIsEditing} comment={comment} />
    </Card>
  );
}

type CommentCardHeaderProps = Pick<CommentCardProps, "comment">;

function CommentCardHeader({ comment }: CommentCardHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <Link to="/users/$userId" params={{ userId: comment.user.id }}>
        <UserAvatar user={comment.user} />
      </Link>

      <time className="text-sm text-neutral-500">
        {new Date(comment.createdAt).toLocaleString()}
      </time>
    </div>
  );
}

type CommentCardContentProps = Pick<CommentCardProps, "comment">;

function CommentCardContent({ comment }: CommentCardContentProps) {
  return <p>{comment.content}</p>;
}

type CommentCardButtonsProps = Pick<CommentCardProps, "comment"> & {
  setIsEditing: (value: boolean) => void;
};

function CommentCardButtons({
  setIsEditing,
  comment,
}: CommentCardButtonsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const { currentUser } = useCurrentUser();

  const deleteMutation = trpc.comments.delete.useMutation({
    onMutate: async ({ id }) => {
      setIsDeleteDialogOpen(false);

      await Promise.all([
        utils.comments.byExperienceId.cancel({
          experienceId: comment.experienceId,
        }),
        utils.experiences.byId.cancel({ id: comment.experienceId }),
      ]);

      const previousData = {
        byExperienceId: utils.comments.byExperienceId.getData({
          experienceId: comment.experienceId,
        }),
        experienceById: utils.experiences.byId.getData({
          id: comment.experienceId,
        }),
      };

      utils.comments.byExperienceId.setData(
        { experienceId: comment.experienceId },
        (oldData) => {
          if (!oldData) {
            return;
          }

          return oldData.filter((c) => c.id != id);
        },
      );

      utils.experiences.byId.setData(
        { id: comment.experienceId },
        (oldData) => {
          if (!oldData) {
            return;
          }

          return {
            ...oldData,
            commentsCount: Math.max(0, oldData.commentsCount - 1),
          };
        },
      );

      const { dismiss } = toast({
        title: "Comment deleted",
        description: "Your comment has been deleted",
      });

      return { dismiss, previousData };
    },

    onError: (error, _, context) => {
      context?.dismiss?.();

      utils.comments.byExperienceId.setData(
        { experienceId: comment.experienceId },
        context?.previousData.byExperienceId,
      );

      utils.experiences.byId.setData(
        { id: comment.experienceId },
        context?.previousData.experienceById,
      );

      toast({
        title: "Failed to delete comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isCommentOwner = currentUser?.id === comment.userId;
  const isExperienceOwner = currentUser?.id === comment.experience.userId;

  if (!isCommentOwner && !isExperienceOwner) {
    return null;
  }

  return (
    <div className="flex gap-4">
      {isCommentOwner && (
        <Button
          variant="link"
          onClick={() => setIsEditing(true)}
          disabled={(comment as CommentOptimistic).optimistic}
        >
          Edit
        </Button>
      )}

      {(isCommentOwner || isExperienceOwner) && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="destructive-link"
              disabled={(comment as CommentOptimistic).optimistic}
            >
              Delete
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Comment</DialogTitle>
            </DialogHeader>
            <p className="text-neutral-600 dark:text-neutral-400">
              Are you sure you want to delete the comment? This action cannot be
              undone.
            </p>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteMutation.mutate({ id: comment.id });
                }}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
