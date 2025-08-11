import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getPosts() {
  const getPostsQuery = defineQuery(`
        *[_type =='post' && isDeleted != true]{
            ...,
            'slug':slug.current,
            'author':author->,
            'subreddit':subreddit ->
        }| order(publishedAt desc)
        `);
  try {
    const posts = await sanityFetch({
      query: getPostsQuery,
    });

    return posts.data;
  } catch (error) {
    console.log("Falied to fetch posts:", error);
    return { error: "Faied to fetch posts" };
  }
}
