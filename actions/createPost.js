"use server";
import { adminclient } from "@/sanity/lib/adminclient";
import { getSubredditBySlug } from "@/sanity/lib/subredddit/getSubredditBySlug";
import { getUser } from "@/sanity/lib/user/getUser";

async function createPost(formData, subreddit) {
  console.log("creating post for ", formData, "in ", subreddit, " community");

  const user = await getUser();
  if (user.error) {
    throw new Error("No user found");
  }

  const subredditType = await getSubredditBySlug(subreddit);
  console.log("subreddit", subredditType);
  if (!subredditType) {
    console.log("No subreddit found");
    return {
      error: "No subreddit found with slug" + subredditType,
    };
  }
  let imageAsset;

  try {
    if (formData.imagePreview) {
      const imageFile = formData.imagePreview;
      const asset = await adminclient.assets.upload("image", imageFile, {
        contentType: imageFile.type,
        filename: imageFile.name,
      });

      imageAsset = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      };
      console.log("image file uploaded succefully");
    }
    const postDoc = {
      _type: "post",
      title: formData.title,
      body: formData.body
        ? [
            {
              _type: "block",
              _key: Date.now().toString(),
              children: [
                {
                  _type: "span",
                  _key: Date.now().toString() + "1",
                  text: formData.body,
                },
              ],
            },
          ]
        : undefined,
      author: {
        _type: "reference",
        _ref: user._id,
      },
      subreddit: {
        _type: "reference",
        _ref: subredditType._id,
      },
      image: imageAsset ? imageAsset : undefined,
      publishedAt: new Date().toISOString(),
    };
    const results = await adminclient.create(postDoc);
    return {
      success: true,
      id: results._id,
    };
  } catch (error) {
    console.log("Error adding Post to sanity" + error);
    return { error: "Error: Failed to upload Post:" + error };
  }
}

export default createPost;
