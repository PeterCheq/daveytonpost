import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getPostsComments(postId, userId) {
  const getPostCommentQuery = defineQuery(`
        *[_type == 'comment' && post._ref == $postId && !defined(parentComment)]{
            ...,
            'author':author->,
            'replies':*[_type == 'comment' && parentComment._ref == ^._id],
            'votes':{
                'upvotes':count(*[_type == 'vote' && comment._ref == ^._id && voteType == 'upvote']),
                'downvotes':count(*[_type == 'vote' && comment._ref == ^._id && voteType == 'downvote']),
                'netScore':count(*[_type == 'vote' && comment._ref == ^._id && voteType == 'upvote'])-count(*[_type == 'vote' && comment._ref == ^._id && voteType == 'downvote']),
                'votesStatus':*[_type == 'vote' && comment._ref == ^._id && user._ref == $userId][0].voteType,
            }
        } | order(votes.netScore desc, createAt desc)
        `);
  try {
    const postComment = await sanityFetch({
      query: getPostCommentQuery,
      params: {
        postId,
        userId: userId || "",
      },
    });

    return postComment.data || null;
  } catch (error) {
    console.log("Failed to fetch post comments:", error);
    return { error: "Failed to fetch pos comments:" + error };
  }
}
