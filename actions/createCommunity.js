"use server";

import { createSubreddit } from "@/sanity/lib/subredddit/createSubreddit";
import { getUser } from "@/sanity/lib/user/getUser";

export async function createCommunity(values) {
  try {
    const user = await getUser();

    if (user.error) {
      return { error: user.error };
    }
    const results = await createSubreddit(values, user);
   console.log("subreddit results >>>", results);

    return { slug: results.subreddit.slug.current };
  } catch (error) {
    console.log("Failed creating community:", error);
    return { error: "Failed creating community" };
  }
}
