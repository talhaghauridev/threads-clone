"use server";
import { UpdateUserParams } from "@/types";
import User from "../models/user.model";
import { contectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";

export async function updateUser({
  bio,
  image,
  userId,
  name,
  username,
  path,
}: UpdateUserParams) {
  await contectToDB();
  try {
    await User.findOneAndUpdate(
      { id: userId },
      { bio, name, username: username.toLowerCase(), onboarded: true, image },
      { upsert: true }
    );
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}
