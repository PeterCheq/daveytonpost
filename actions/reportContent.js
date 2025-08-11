"use server";

import { adminclient } from "@/sanity/lib/adminclient";
import { getUser } from "@/sanity/lib/user/getUser";

export async function reportContent(contentId) {
  const user = await getUser();
  if ("error" in user) return { error: user.error };
  console.log(
    "reporting user contentId >>",
    contentId,
    "from this user>>>",
    user._id
  );

  try {
    const result = await adminclient
      .patch(contentId)
      .set({ isReported: true })
      .commit();
    return { result };
  } catch (error) {
    console.error("Error: Could not report try again..." + error);
    return {
      error: "Error: Could not report try again" + error,
    };
  }
}
