"use server";
import { UpdateUserParams } from "@/types";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";

export async function fetchUser(userId: string) {
  try {
    await connectToDB();
    return await User.findOne({ id: userId })
    // .populate({
    //   path: "communities",
    //   model: "Community",
    // });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function updateUser({
  bio,
  image,
  userId,
  name,
  username,
  path,
}: UpdateUserParams) {
  try {
    await connectToDB();
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
