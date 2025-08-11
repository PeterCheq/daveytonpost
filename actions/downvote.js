"use server";
import { downVoteComment } from "@/sanity/lib/comment/downVoteComment";
import { downVotePost } from "@/sanity/lib/post/downVotePost";
import { getUser } from "@/sanity/lib/user/getUser";

export async function downvote(contentId, contentType) {
  const user = await getUser();

  if (user.error) {
    return { error: user.error };
  }
  let vote;
  if (contentType === "comment") {
    vote = await downVoteComment(contentId, user._id);
    return { vote };
  } else {
    vote = await downVotePost(contentId, user._id);
    return { vote };
  }
}
