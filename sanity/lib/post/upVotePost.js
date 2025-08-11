import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { adminclient } from "../adminclient";

export const upVotePost = async (contentId, userId) => {
  console.log("✨ check if vote exists with contentId >>>",contentId,'userId',userId);  const existingUpvoteQuery = defineQuery(`
        *[_type == "vote" && post._ref == $contentId && user._ref == $userId][0]
        `);

  try {
    const existingVote = await sanityFetch({
      query: existingUpvoteQuery,
      params: {
        contentId,
        userId,
      },
    });

console.log(existingVote)
    if (existingVote.data?.voteType === "upvote") {
      console.log("✔  exsisting upvote found");
      return await adminclient.delete(existingVote.data?._id);
    }

    if (existingVote.data?.voteType === "downvote") {
      console.log("✔ existing downvote found");
      return await adminclient
        .patch(existingVote.data?._id)
        .set({ voteType: "upvote" })
        .commit();
    }

    console.log("✨ c creating new vote");

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
      voteType: "upvote",
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.log('Error adding post vote:',error)
    return {error:'Failed to add post vote:'+error}
  }
};
