import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { adminclient } from "../adminclient";

export const downVotePost = async (contentId, userId) => {
    const existingPostdownvoteQuery = defineQuery(`
           *[_type == "vote" && post._ref == $contentId && user._ref == $userId][0]
        `);

  try {
    const existingVote = await sanityFetch({
      query: existingPostdownvoteQuery,
      params: {
        contentId,
        userId,
      },
    });

console.log(existingVote)
    if (existingVote.data?.voteType === "downvote") {
      return await adminclient.delete(existingVote.data?._id);
    }

    if (existingVote.data?.voteType === "upvote") {
      return await adminclient
        .patch(existingVote.data?._id)
        .set({ voteType: "downvote" })
        .commit();
    }

    return await adminclient.create({
      _type: "vote",
      post: {
        _type: "reference",
        _ref: contentId,
      },
      user: {
        _type: "reference",
        _ref: userId,
      },
      voteType: "downvote",
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.log('Error adding post vote:',error)
    return {error:'Failed to add post vote:'+error}
  }
};
