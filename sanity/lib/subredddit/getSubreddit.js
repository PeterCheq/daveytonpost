import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getSubreddit() {
  const getAllSubredditQuery = defineQuery(`
        *[_type == 'subreddit']{
            ...,
            'slug':slug.current,
            'moderator':moderator->
        }|order(createdAt desc)
        `);

  try {
    const results = await sanityFetch({
      query: getAllSubredditQuery,
    });

    return results.data;
  } catch (error) {
    console.log("Failed to get subreddits:", error);
    return { error: "Error Fetch Failed:" };
  }
}
