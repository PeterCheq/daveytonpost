import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { adminclient } from "../adminclient";

export async function createSubreddit(values, user) {
  try {
    const checkExistingQuery = defineQuery(`
            *[_type == 'subreddit' && title == $name][0]{
                _id
            }
            `);

    const existingSubreddit = await sanityFetch({
      query: checkExistingQuery,
      params: {
        name: values.name,
      },
    });
    if (existingSubreddit.data) {
      console.log("Subreddit with the name ", values.name, " already exists");
      return { error: "A subreddit with this name aleady exists" };
    }

    // check if slug aleardy exists if custom slug is provided
    if (values.slug) {
      const checkExistingSlugQuery = defineQuery(`
        *[_type == 'subreddit' && slug.current == $slug][0]{
          _id
        }
        `);

      const existingSlug = await sanityFetch({
        query: checkExistingSlugQuery,
        params: { slug: values.slug },
      });

      if (existingSlug.data) {
        console.log("Subreddit with the slug already exists");
        return { error: "A subreddit with this Url already exists" };
      }
    }

    let imageAsset = null;
    if (values.photo) {
      const imageFile = values.photo;
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
    }

    const subredditDoc = {
      _type: "subreddit",
      title: values.name,
      description: values.description || `Welcome to r/${values.name}`,
      slug: {
        current: values?.slug
          ? values.slug
          : values.name.toLowerCase().replace(/\$+/g, "-"),
        _type: "slug",
      },
      moderator: {
        _type: "reference",
        _ref: user._id,
      },
      image: imageAsset ? imageAsset : undefined,
      createdAt: new Date().toISOString(),
    };

    const subreddit = await adminclient.create(subredditDoc);
    console.log("Subreddit created successfully");
    return { subreddit };
  } catch (error) {
    console.error("Error creating subreddit:", error);
    return { error: "Falied to creat subreddit:" };
  }
}
