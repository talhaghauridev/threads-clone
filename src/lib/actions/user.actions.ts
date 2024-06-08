"use server";
import { UpdateUserParams } from "@/types";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import Community from "../models/community.model";
import { FilterQuery, SortOrder } from "mongoose";

export async function fetchUser(userId: string) {
  try {
    await connectToDB();
    return await User.findOne({ id: userId });
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

export async function fetchUserPosts(userId: string) {
  try {
    await connectToDB();
    const threads = await User.findOne({ id: userId })
      .populate({
        path: "threads",
        model: Thread,
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "community",
            model: Community,
            select: "_id id name image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "image id name ",
            },
          },
        ],
      })
      .exec();
    return threads;
  } catch (error) {
    throw new Error("Unable to delete thread");
  }
}

type SearchParams = {
  pageSize?: number;
  pageNumber?: number;
  searchString?: string;
  userId: string;
  sortBy?: SortOrder;
};
export async function fetchUsers({
  pageSize = 20,
  pageNumber = 1,
  searchString = "",
  sortBy = "desc",
  userId,
}: SearchParams) {
  try {
    await connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };
    if (searchString.trim() !== "") {
      query.$or = [
        {
          name: {
            $regex: regex,
          },
        },
        { username: { $regex: regex } },
      ];
    }
    const sortOptions = { createdAt: sortBy };
    const userQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUserCount = await User.countDocuments(query);

    const users = await userQuery.exec();
    const isNext = totalUserCount > skipAmount + users.length;
    return { users, isNext };
  } catch (error) {
    throw new Error("Unable to delete thread");
  }
}

export async function getActivity(userId: string) {
  try {
    await connectToDB();
    const threads = await Thread.find({ author: userId });

    const childThreadIds = threads.reduce((acc, curr) => {
      return acc.concat(curr.children);
    }, []);
    
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "_id name image",
    });

    return replies;
  } catch (error) {
    throw new Error("Unable to delete thread");
  }
}
