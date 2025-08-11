import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getSubredditBySlug = async (slug) => {
  console.log("subreddit slug >>", slug);
  const getSubredditBySlugQuery = defineQuery(`
        *[_type == 'subreddit' && slug.current == $slug][0]{
            ...,
            "slug": slug.current,
            "moderator": moderator->,
        }
        `);

  try {
    const subreddit = await sanityFetch({
      query: getSubredditBySlugQuery,
      params: {
        slug,
      },
    });
    return subreddit.data;
  } catch (error) {
    console.log("Error: Failed to get subreddit,", error);
    return { error: "Error: Falied to get subreddit" + error };
  }
};
