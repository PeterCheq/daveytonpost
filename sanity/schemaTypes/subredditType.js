const { TagIcon } = require("lucide-react");
const { defineType, defineField } = require("sanity");

export const subredditType = defineType({
  name: "subreddit",
  title: "Subreddits",
  type: "document",
  icon: TagIcon,
  description: "A community were users can post and engage with content",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Name of the subreddit",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "A brief description of what this subreddit is about",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "The unique URL-friendly identifier for this subreddit",
      options: {
        source: "title",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Icon or banner image for the subreddit",
    }),

    defineField({
      name: "moderator",
      title: "Moderator",
      type: "reference",
      description:
        "The user who created this subreddit and has admin privilages",
      to: [{ type: "user" }],
      validation: (rule) => rule.required(),
    }),
    
    defineField({
      name: "createdAt",
      title: "Create At",
      type: "datetime",
      description: "When this subreddit was created",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
    prepare({ title, media }) {
      return {
        title,
        media,
      };
    },
  },
});
