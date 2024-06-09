"use client";
import { likeThread, unlikeThread } from "@/lib/actions/thread.actions";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { memo, useCallback, useMemo, useState } from "react";

type LikeThreadProps = {
  userId: string;
  threadId: string;
  authorId: string;
  likes: string[];
};

const LikeThread = ({ userId, threadId, authorId, likes }: LikeThreadProps) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const addLiked = useCallback(async () => {
    setLoading(true);
    await likeThread(userId, threadId, pathname);
    setLoading(false);
  }, [pathname, userId, threadId]);

  const addUnLiked = useCallback(async () => {
    setLoading(true);
    await unlikeThread(userId, threadId, pathname);
    setLoading(false);
  }, [pathname, userId, threadId]);

  return useMemo(
    () => (
      <>
        {likes.includes(userId) ? (
          <button
            className="flex items-center justify-center gap-1 text-[#697c89]"
            disabled={loading}
          >
            <Heart
              width={20}
              height={20}
              onClick={addUnLiked}
              className={cn(
                "cursor-pointer !fill-red-500",
                loading
                  ? "opacity-[0.6] cursor-not-allowed"
                  : "active:animate-pulse"
              )}
            />
            {likes.length}
          </button>
        ) : (
          <button
            className="flex items-center justify-center gap-1 text-[#697c89]"
            disabled={loading}
          >
            <Heart
              width={20}
              height={20}
              onClick={addLiked}
              className={cn(
                "cursor-pointer ",
                loading
                  ? "opacity-[0.6] cursor-not-allowed "
                  : "active:animate-pulse"
              )}
            />
            {likes.length}
          </button>
        )}
      </>
    ),
    [userId, likes, loading, addLiked, addUnLiked]
  );
};

export default memo(LikeThread);
