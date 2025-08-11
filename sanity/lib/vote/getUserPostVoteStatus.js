import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getUserPostVoteStatus(postId, userId) {
  const getUserPostVoteStatusQuery = defineQuery(`
        *[_type == 'vote' && post._ref == $postId && user._ref == $userId][0].voteType
        `);

  try {
    const userPostStatus = await sanityFetch({
      query: getUserPostVoteStatusQuery,
      params: {
        postId,
        userId: userId || "",
      },
    });

    return userPostStatus.data;
  } catch (error) {
    console.log("Failed to get user post votes status:", error);
    return { error: "Failed to get user post votes status:" + error };
  }
}
