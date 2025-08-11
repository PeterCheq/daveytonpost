import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getSubredditPosts = async (id) => {
  const getSubredditPostsQuery = defineQuery(`
        *[_type == 'post' && subreddit._ref == $id ]{
            ...,
            "author": author->,
            "subreddit":subreddit->,
            "category": category->,
            "upvotes": count(*[_type == 'vote' && post._ref == ^._id && voteType == 'upvote']),
            "downvotes": count(*[_type == 'vote' && post._ref == ^._id && voteType == 'downvote']),
            "netScore": count(*[_type == 'vote' && post._ref == ^._id && voteType == 'upvote'])-count(*[_type == 'vote' && post._ref == ^._id && voteType == 'downvote']),
            "commentCount": count(*[_type == 'comment' && post.ref == ^._id])
        } | order(publishAt desc)
        `);

  try {
    const posts = await sanityFetch({
      query: getSubredditPostsQuery,
      params: { id },
    });
    return posts.data || [];
  } catch (error) {
    console.log("Error: Failed fetching posts" + error);
    return { error: "Error: Falied fetching posts" + error };
  }
};
