import { MessageSquare } from "lucide-react";
import { defineField, defineType } from "sanity";

export const commentType = defineType({
  name: "comment",
  title: "Comments",
  type: "document",
  icon: MessageSquare,
  fields: [
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      description: "The text content of the comment",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      description: "The user who wrote this comment",
      to: [{ type: "user" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "post",
      title: "Post",
      type: "reference",
      description:
        "The post this comment belongs to (even for nested comments)",
      to: [{ type: "post" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "parentComment",
      title: "Parent Comment",
      type: "reference",
      description: "If this is a reply, reference to the parent comment",
      to: [{ type: "comment" }],
    }),
    defineField({
      name: "isDeleted",
      title: "Is Deleted",
      type: "boolean",
      description: "Indicates if this comment has been deleted",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "content",
      subtitle: "author.name",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle,
      };
    },
  },
});
