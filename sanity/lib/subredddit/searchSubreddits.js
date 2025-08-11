import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const searchSubreddits = async (queryKey) => {
  if (queryKey === undefined) {
    console.error("no query found ");
    return;
  }
  if (!queryKey || queryKey.trim() === "") {
    return [];
  }
  const searchSubredditsQeury = defineQuery(`
        *[_type =="subreddit" && title match "${queryKey}*"]{
            ...,
            "slug":slug.current,
            "moderator":moderator->,
        } | order(createdAt desc)
        `);

  try {
    const subredditsFetch = await sanityFetch({
      query: searchSubredditsQeury,
      params: {
        queryKey: queryKey.toLowerCase(),
      },
    });
    console.log("subreddits found>>>", subredditsFetch);
    return subredditsFetch.data || [];
  } catch (error) {
    console.log("Failed to fetch subreddits" + error);
    return { error: "Error " + error };
  }
};
