import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { adminclient } from "../adminclient";

export const downVoteComment = async (contentId, userId) => {
    console.log("✨ check if vote exists with contentId >>>",contentId,'userId',userId);  
    const existingdownvoteQuery = defineQuery(`
           *[_type == "vote" && comment._ref == $contentId && user._ref == $userId][0]
        `);

  try {
    const existingVote = await sanityFetch({
      query: existingdownvoteQuery,
      params: {
        contentId,
        userId,
      },
    });

console.log(existingVote)
    if (existingVote.data?.voteType === "downvote") {
      console.log("✔  exsisting downvote found");
      return await adminclient.delete(existingVote.data?._id);
    }

    if (existingVote.data?.voteType === "upvote") {
      console.log("✔ existing downvote found");
      return await adminclient
        .patch(existingVote.data?._id)
        .set({ voteType: "downvote" })
        .commit();
    }

    console.log("✨ c creating new vote");

    return await adminclient.create({
      _type: "vote",
      comment: {
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
