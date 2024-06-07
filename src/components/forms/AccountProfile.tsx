"use client";
import { User } from "@/types";
import React, { memo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserType, UserValidation } from "@/lib/validations/user";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.actions";
type AccountProfileProps = {
  user: User;
  btnTitle: string;
};

const AccountProfile = ({ btnTitle, user }: AccountProfileProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");
  const pathname = usePathname();
  const router = useRouter();
  const form = useForm<UserType>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      name: user.name || "",
      bio: user.bio || "",
      username: user.username || "",
      profile_photo: user.image || "",
    },
  });

  const onSubmit = useCallback(
    async (values: UserType) => {
      const blob = values.profile_photo;
      const hasImageChanged = isBase64Image(blob);
      if (hasImageChanged) {
        const imageRes = await startUpload(files);
        if (imageRes && imageRes[0].url) {
          values.profile_photo = imageRes[0].url;
          console.log(imageRes[0]);
        }
      }

      await updateUser({
        userId: user.id,
        path: pathname,
        image: values.profile_photo,
        bio: values.bio,
        name: values.name,
        username: values.username,
      });
      if (pathname === "profiel/edit") {
        router.back();
      } else {
        router.push("/");
      }
    },
    [files, pathname, router, startUpload, updateUser, user.id]
  );

  const handleImage = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      fileChange: (value: string) => void
    ) => {
      e.preventDefault();
      const fileReader = new FileReader();
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setFiles(Array.from(e.target.files!));

        if (!file.type.includes("image")) return;
        fileReader.onload = async (event) => {
          const imageUrl = event.target?.result?.toString() || "";
          fileChange(imageUrl);
        };
        fileReader.readAsDataURL(file);
      }
    },
    []
  );

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile_icon"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-contain"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile_icon"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Add profile photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-primary-500">
          {btnTitle}
        </Button>
      </form>
    </Form>
  );
};

export default memo(AccountProfile);
