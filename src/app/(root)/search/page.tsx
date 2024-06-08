import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user?.id!);
  if (!userInfo.onboarded) redirect("/onboarding");

  return <div>Search</div>;
};

export default page;
