import { adminclient } from "../adminclient";

export async function addComment({ postId, content, userId, parentCommentId }) {
  console.log("preparing data for sanity");
  const commentData = {
    _type: "comment",
    author: {
      _type: "reference",
      _ref: userId,
    },
    content,
    post: {
      _type: "reference",
      _ref: postId,
    },
    parentComment: parentCommentId
      ? {
          _type: "reference",
          _ref: parentCommentId,
        }
      : undefined,
  };
  try {
    const comment = await adminclient.create(commentData);
    console.log("comment create successfully in back end");
    return { comment };
  } catch (error) {
    console.log("Failed to add comment:", error);
    return { error: "Failed to add comment" };
  }
}
