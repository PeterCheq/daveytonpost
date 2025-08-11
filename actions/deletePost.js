"use server";
import { adminclient } from "@/sanity/lib/adminclient";
import { getPostById } from "@/sanity/lib/post/getPostById";
import { currentUser } from "@clerk/nextjs/server";
export async function deletePost(postId) {
  const user = await currentUser();

  if (!user) {
    return { error: "No User found" };
  }
  const post = await getPostById(postId);
  if (!post) {
    return { error: "Post not found" };
  }
  console.log(post);
  console.log(
    "checking if post matches with user that is currently loggedin with this id",
    user.id,
    "and post userId",
    post.author?._id
  );
  if (post.author?._id == user?.id) {
    return { error: "You are not authorized to delete this post" };
  }

  const patch = adminclient.patch(postId);
  if (post.image?.asset?._ref) {
    patch.set({ image: null });
  }
  patch.set({
    body: [{ children: [{ text: "[DELETED CONTENTS]" }], type: "paragraph" }],
  });
  patch.set({ title: "[DELETED POST]" });
  const result = await patch.commit();
  if (result) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Deleting image from post");
    if (post.image?.asset?._ref) {
      await adminclient.delete(post.image.asset._ref);
    }
  }
  return { success: "Post deleted successfully" };
}
