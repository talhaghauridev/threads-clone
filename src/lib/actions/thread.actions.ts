"use server";
import mongoose from "mongoose";
import { CreateThreadParams } from "@/types";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Community from "../models/community.model";
export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  await connectToDB();
  try {
    const skipAmount = (pageNumber - 1) * pageSize;

    const postsQuery = Thread.find({
      parentId: { $in: [undefined, null] },
    })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "author",
        model: User,
      })
      .populate({ path: "community", model: Community })
      .populate({
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });

    const totalPostsCount = await Thread.countDocuments({
      parentId: { $in: [undefined, null] },
    });
    const posts = await postsQuery.exec();
    const isNext = totalPostsCount > pageSize + posts.length;

    return {
      posts,
      isNext,
    };
  } catch (error) {
    throw new Error(`Failed to fetch posts: ${error}`);
  }
}

export async function createThread({
  author,
  text,
  communityId,
  path,
}: CreateThreadParams) {
  try {
    await connectToDB();

    const thread = await Thread.create({ author, text, community: null });
    await User.findByIdAndUpdate(author, { $push: { threads: thread._id } });
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

export async function fetchThreadById(threadId: string) {
  try {
    await connectToDB();
    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        model: Thread,
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();
    return thread;
  } catch (error: any) {
    throw new Error("Unable to fetch thread");
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string, 
  path: string
) {
  await connectToDB();

  try {
    if (!mongoose.Types.ObjectId.isValid(threadId)) {
      throw new Error("Invalid thread ID");
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const originalThread = await Thread.findById(threadId);
    if (!originalThread) {
      throw new Error("Thread not found");
    }

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    const savedCommentThread = await commentThread.save();

    originalThread.children.push(savedCommentThread._id);

    await originalThread.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}
