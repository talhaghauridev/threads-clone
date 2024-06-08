"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createThread } from "@/lib/actions/thread.actions";
import { ThreadType, ThreadValidation } from "@/lib/validations/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { memo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { useOrganization } from "@clerk/nextjs";
type PostThreadProps = {
  userId: string;
};

const PostThread = ({ userId }: PostThreadProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();
  const form = useForm<ThreadType>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      accountId: userId,
      thread: "",
    },
  });

  const onSubmit = useCallback(
    async (values: ThreadType) => {
      await createThread({
        author: userId,
        path: pathname,
        text: values.thread,
        communityId: organization ? organization.id : null,
      });
      router.push("/");
    },
    [router, pathname, userId,organization]
  );
  return (
    <Form {...form}>
      <form
        className="mt-10 flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-primary-500">
          Post Thread
        </Button>
      </form>
    </Form>
  );
};

export default memo(PostThread);
