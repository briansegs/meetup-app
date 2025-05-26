import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentValidationSchema } from "@meetup-app/shared/schema/comment";
import { Experience } from "@meetup-app/server/database/schema";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/features/shared/components/ui/Form";
import { TextArea } from "@/features/shared/components/ui/TextArea";
import { Button } from "@/features/shared/components/ui/Button";
import { trpc } from "@/trpc";
import { useToast } from "@/features/shared/hooks/useToast";

type CommentCreateFormData = z.infer<typeof commentValidationSchema>;

type CommentCreateFormProps = {
  experienceId: Experience["id"];
};

export function CommentCreateForm({ experienceId }: CommentCreateFormProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const form = useForm<CommentCreateFormData>({
    resolver: zodResolver(commentValidationSchema),
    defaultValues: {
      content: "",
    },
  });

  const addCommentMutation = trpc.comments.add.useMutation({
    onSuccess: async ({ experienceId }) => {
      await Promise.all([
        utils.comments.byExperienceId.invalidate({
          experienceId,
        }),
        utils.experiences.feed.invalidate(),
      ]);

      form.reset();

      toast({
        title: "Comment added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to edit comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    addCommentMutation.mutate({
      content: data.content,
      experienceId,
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextArea {...field} placeholder="Add a comment..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={addCommentMutation.isPending}>
          Add Comment
        </Button>
      </form>
    </Form>
  );
}
