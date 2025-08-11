"use server";
import { upVoteComment } from "@/sanity/lib/comment/upVoteComment";
import { upVotePost } from "@/sanity/lib/post/upVotePost";
import { getUser } from "@/sanity/lib/user/getUser";

export async function upvote(contentId, contentType) {
  const user = await getUser();

  if (user.error) {
    return { error: user.error };
  }
  let vote;
  if (contentType === "comment") {
    vote = await upVoteComment(contentId, user._id);
    return { vote };
  } else {
    vote = await upVotePost(contentId, user._id);
    return { vote };
  }
}
