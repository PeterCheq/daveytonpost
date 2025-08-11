"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createComment } from "@/actions/createComment";

function CommentInput({ postId, parentCommentId, isReplying, setIsReplying }) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { user } = useUser();
  const handleSubmit = (e) => {
    e.preventDefault();

    startTransition(async () => {
      console.log("isReplying", isReplying);
      try {
        const result = createComment(postId, content, parentCommentId);
        if (result.error) {
          console.error("Error adding comment:", result.error);
        } else {
          setContent("");
          isReplying && setIsReplying(false);
        }
      } catch (error) {
        console.error("failed to create comment:", error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={user ? "Add a comment..." : "Sign in to comment"}
        disabled={isPending || !user}
      />
      <Button
        className="cursor-pointer disabled:bg-gray-200"
        variant="outline"
        type="submit"
        disabled={isPending || !user || content.length === 0}
      >
        {isPending ? "Commenting..." : "Comment"}
      </Button>
    </form>
  );
}

export default CommentInput;
