"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Icons } from "./icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { useUser } from "@clerk/nextjs";
import { POST_TYPE_TABS } from "@/lib/constants";
import Link from "next/link";
import { Trash } from "lucide-react";
import { z } from "zod";
import { POST_TYPE } from "@/lib/db/schema";
import { api } from "@/lib/trpc/client";

import { useRouter } from "next/navigation";

const Schema = z.object({
  content: z
    .string()
    .trim()
    .nonempty({ message: "Post cannot be empty." })
    .max(512, {
      message: "Post cannot be longer than 512 characters.",
    }),
  type: z.enum(POST_TYPE).default(POST_TYPE[0]),
});
export default function PostForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: {
      type: "following",
      content: "",
    },
  });

  const createPostMutation = api.posts.create.useMutation({
    onSuccess: async () => {
      router.push(
        form.getValues("type") === "following"
          ? "/"
          : `/?tab=${form.getValues("type")}`,
      );
      router.refresh();
    },
  });
  const { user } = useUser();
  const [isFocused, setIsFocused] = useState(false);

  async function onSubmit(values: z.infer<typeof Schema>) {
    await createPostMutation.mutateAsync(values);

    form.reset();
  }

  useEffect(() => {
    form.reset();
  }, [isFocused, form]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isFocused) return;

      if (e.key === "Escape") {
        form.reset();
        setIsFocused(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFocused, form]);

  return (
    <div
      // className="xs:flex hidden gap-x-4"
      className="flex gap-x-4"
    >
      {!user?.imageUrl ? (
        <Skeleton className="h-10 w-10 rounded-full" />
      ) : (
        <div>
          <Link href={`/${user.username}`} className="min-w-max">
            <Image
              src={user.imageUrl}
              alt="Profile picture"
              width={40}
              height={40}
              className="rounded-full"
            />
          </Link>
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 space-y-4"
        >
          <div className="flex gap-x-2">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex-1">
                  {/* <FormLabel>Post</FormLabel> */}
                  <FormControl>
                    {!isFocused ? (
                      <Input
                        placeholder="What's on your mind?"
                        className="text-base"
                        onFocus={() => setIsFocused(true)}
                      />
                    ) : (
                      <Textarea
                        placeholder="What's on your mind?"
                        className="text-base"
                        autoFocus
                        maxLength={256}
                        {...field}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isFocused && <Button disabled>Post</Button>}
          </div>

          {isFocused && (
            <div className="flex items-center justify-between gap-x-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Post type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Privacy</SelectLabel>
                            {POST_TYPE_TABS.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.id === "following"
                                  ? "Follower"
                                  : type.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-x-2">
                <Button
                  size="icon"
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    form.reset();
                    setIsFocused(false);
                  }}
                >
                  <Trash className="h-4 w-4 text-rose-500" />
                </Button>
                <Button
                  type="submit"
                  disabled={
                    form.formState.isSubmitting || !form.formState.isValid
                  }
                >
                  {form.formState.isSubmitting && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Post
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
