import { Button } from "@/features/shared/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/shared/components/ui/Dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/shared/components/ui/Form";
import Input from "@/features/shared/components/ui/Input";
import { useToast } from "@/features/shared/hooks/useToast";
import { trpc } from "@/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { userEditSchema } from "@meetup-app/shared/schema/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User } from "@meetup-app/server/database/schema";
import { TextArea } from "@/features/shared/components/ui/TextArea";

type UserFormData = z.infer<typeof userEditSchema>;

type UserEditDialogProps = {
  user: User;
};

export function UserEditDialog({ user }: UserEditDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { toast } = useToast();
  const utils = trpc.useUtils();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      id: user.id,
      name: user.name,
      bio: user.bio ?? "",
    },
  });

  const editUserMutation = trpc.users.edit.useMutation({
    onSuccess: async ({ id }) => {
      await Promise.all([
        utils.users.byId.invalidate({ id }),
        utils.auth.currentUser.invalidate(),
      ]);

      setIsOpen(false);

      toast({
        title: "User edited",
        description: "User profile has been edited",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to edit user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    }

    editUserMutation.mutate(formData);
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <TextArea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={editUserMutation.isPending}>
                {editUserMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
