import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getCommentReplies = async (commentId, userId) => {
  const getCommentRepliesQuery = defineQuery(`
        *[_type=='comment' && parentComment._ref == $commentId]{
            ...,
            "author":author->,
            "replies":*[_type== 'comment' && parentComment._ref == ^._id],
            'votes':{
                "upvotes":count(*[_type == 'vote' && comment._ref == ^._id && voteType == 'upvote']),
                "downvotes":count(*[_type == 'vote' && comment._ref == ^._id && voteType == 'downvote']),
                "netScore":count(*[_type == 'vote' && comment._ref == ^._id && voteType == 'upvote'])-count(*[_type == 'vote' && comment._ref == ^._id && voteType == 'downvote']),
                "voteStatus": *[_type == 'vote' && comment._ref == ^._id && user._ref == $userId][0].voteType
                
            }
        }| order(votes.netScore desc)
        `);

  try {
    const replies = await sanityFetch({
      query: getCommentRepliesQuery,
      params: { commentId, userId: userId || "" },
    });

    return replies.data;
  } catch (error) {
    console.log("Error fetching comment Replies:", error);
    return { error: "Failed fetching comment Replies" };
  }
};
