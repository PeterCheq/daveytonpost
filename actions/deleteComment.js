"use server";
import { adminclient } from "@/sanity/lib/adminclient";
import { getCommentById } from "@/sanity/lib/comment/getCommentById";
import { currentUser } from "@clerk/nextjs/server";
export async function deleteComment(commentId) {
  const user = await currentUser();
  if (!user) {
    return { error: "No user found" };
  }
  const comment = await getCommentById(commentId);
  if (!comment) {
    return { error: "No comment found" };
  }
  if (comment.author?._id !== user.id) {
    return { error: "You are not authorized to delete this comment" };
  }
  const patch = adminclient.patch(commentId);
  patch.set({ content: "[DELETED]" });
  patch.set({ isDeleted: true });
  await patch.commit();
  return { success: "Comment deleted successfully" };
}
