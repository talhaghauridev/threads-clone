import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { User } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Onboarding -- Threads",
};

const page = async () => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user?.id!);

  const userData: User = {
    id: user?.id.toString(),
    objectId: (userInfo?._id).toString(),
    username: (userInfo?.username || user?.username || "").toString(),
    name: (userInfo?.name || user?.firstName || "").toString(),
    bio: (userInfo?.bio || "").toString(),
    image: (userInfo?.image || user?.imageUrl).toString(),
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now, to use Threds.
      </p>

      <section className="mt-9 p-10 bg-dark-2">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </main>
  );
};

export default page;
