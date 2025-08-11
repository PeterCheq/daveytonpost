import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getPostById(postId) {
  const getPostByIDQuery = defineQuery(`
        *[_type =='post' && _id == $postId][0]{
            "author":author->
        }
        `);

  try {
    const post = await sanityFetch({
      query: getPostByIDQuery,
      params: { postId },
    });

    return post.data;
  } catch (error) {
    console.log("Error: Failed to get post" + error);
    return { error: "Error: Failed to get post" + error };
  }
}
