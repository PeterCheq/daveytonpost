import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getPostVotes(postId) {
  const getPostVotesQuery = defineQuery(`
        {
            'upvotes':count(*[_type == 'vote' && post._ref == $postId && voteType =='upvote']),
            'downvotes':count(*[_type == 'vote' && post._ref == $postId && voteType =='downvote']),
            'netScore':count(*[_type == 'vote' && post._ref == $postId && voteType =='upvote'])-count(*[_type == 'vote' && post._ref == $postId && voteType =='downvote']),
        }
        `);

  try {
    const postVote = await sanityFetch({
      query: getPostVotesQuery,
      params: {
      postId,
      },
    });

    return postVote.data;
  } catch (error) {
    console.log("Faile fetching votes:", error);
    return { error: "Failed fetching votes: " + error };
  }
}
