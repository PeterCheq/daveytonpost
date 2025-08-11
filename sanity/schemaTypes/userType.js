import { defineField, defineType } from "sanity";
import { UserIcon } from "lucide-react";
import Image from "next/image";

export const userType = defineType({
  name: "user",
  title: "Users",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "username",
      type: "string",
      title: "Username",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      description: "User's email address",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imageUrl",
      title: "Image Url",
      description: "User's clerk profile picture",
      type: "string",
    }),
    defineField({
      name: "isReported",
      title: "Is Reported",
      type: "boolean",
      description: "Whether this user has been reported",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "username",
      media: "imageUrl",
    },
    prepare({ title, media }) {
      return {
        title,
        media: media ? (
          <Image src={media} alt={`${title}'s avata`} width={40} height={40} />
        ) : (
          <UserIcon />
        ),
      };
    },
  },
});
