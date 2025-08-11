import { ArrowDown, ArrowUp, ArrowUp10 } from "lucide-react";
import { defineField, defineType } from "sanity";

export const voteType = defineType({
  name: "vote",
  title: "Votes",
  type: "document",
  icons: ArrowUp10,
  description: "Tracks user votes on posts and comments",
  fields: [
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      description: "The user who cast this vote",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "voteType",
      title: "Vote Type",
      type: "string",
      description: "Whether this is an upvote or downvote",
      options: {
        list: [
          { title: "Upvote", value: "upvote" },
          { title: "Downvote", value: "downvote" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "post",
      title: "Post",
      type: "reference",
      description: "The post being voted on if applicable",
      to: [{ type: "post" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "comment",
      title: "Comment",
      type: "reference",
      description: "To which comment this vote belongs to",
      to: [{ type: "comment" }],
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      description: "When this vote was cast",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      voteType: "voteType",
      postTitle: "post.title",
            username: "user.username",
    },
    prepare({ voteType, postTitle, username }) {
      return {
        title: postTitle || 'comment',
        subtitle: username,
        media: voteType === "upvote" ? <ArrowUp /> : <ArrowDown />,
      };
    },
  },
  alidation: (rule) =>
    rule.custom((fields) => {
      if (fields?.post && fields?.comment) {
        return "Cannot vote on both a post and comment simultanously";
      }
      if (!fields?.post && !fields?.comment) {
        return "Must vote on either a post or comment";
      }
      return true; // ✅ explicitly return valid
    }),
});
