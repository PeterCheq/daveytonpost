"use client";

import { deleteComment } from "@/actions/deleteComment";
import { deletePost } from "@/actions/deletePost";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

function DeleteButton({ contentId, contentType, contentOwnerId }) {
  const [isDeleting, startDeleting] = useTransition();
  const [error, setError] = useState();
  const { user, isSignedIn } = useUser();

  const handleDelete = () => {
    if (isDeleting || !isSignedIn) return;
    if (!window.confirm("Are you sure you want to delete this?")) {
      return;
    }
    startDeleting(async () => {
      const isOwner = contentOwnerId === user?.id;
      if (!isOwner) return null;
      setError(null);
      try {
        const response =
          contentType === "post"
            ? await deletePost(contentId)
            : deleteComment(contentId);
        if (response.error) setError(response.error);
      } catch (error) {
        setError(response.error);
        console.log("Error:" + error);
      }
    });
  };
  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting || !isSignedIn}
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors mt-1 disabled:opacity-500 disabled:cursor-not-allowed"
      )}
      aria-label={`Delte ${contentType}`}
    >
      <Trash2 size={14} />
      <span className="hidden md:block">
        {isDeleting
          ? "Deleting..."
          : isSignedIn
            ? "Delete"
            : "Sign in to delete"}
      </span>
      {error && <span className="text-red-500 ml-2">{error}</span>}
    </button>
  );
}

export default DeleteButton;
