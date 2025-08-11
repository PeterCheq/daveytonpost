import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getCommentById(commentId) {
  const getCommentByIDQeury = defineQuery(`
    *[_type == 'comment' && _id ==$commentId][0]{
        "author":author->,
    }
    `);

  try {
    const comment = await sanityFetch({
      query: getCommentByIDQeury,
      params: { commentId },
    });
    return comment.data;
  } catch (error) {
    console.log("Error: Could not get Comment" + error);
    return { error: "Error: Could not get Comment" + error };
  }
}
