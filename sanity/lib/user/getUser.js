"use server";
import { currentUser } from "@clerk/nextjs/server";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { addUser } from "./addUser";

const parseUsername = (username) => {
  const randomNum = Math.floor(1000 + Math.random() * 900);

  return (
    username
      .replace(/\$+(.)/g, (_, char) => char.toUpperCase())
      .replace(/\$+/g, "") + randomNum
  );
};

export async function getUser() {
  const user = await currentUser();

  if (!user) {
    console.log("No user logged in");
    return { error: "User not found" };
  }

  const getExistingUserQuery = defineQuery(`
        *[_type == 'user' && _id == $id][0]
        `);

  try {
    const existingUserQeury = await sanityFetch({
      query: getExistingUserQuery,
      params: { id: user.id },
    });

    if (existingUserQeury.data) {
      console.log(
        "User found in database with Id:",
        existingUserQeury.data._id
      );
      return existingUserQeury.data;
    }

    console.log("User not found ,creating a new user ");

    const newUser = await addUser({
      id: user.id,
      username:
        parseUsername(user.firstName) ??
        parseUsername(user.fullName) ??
        "Unknown User",
      email: user.emailAddresses[0]?.emailAddress,
      imageUrl: user?.imageUrl,
    });

    console.log("New user created with with this credentials:", newUser);
    return newUser;
  } catch (error) {
    console.log("failed to fetch user:", error);
    return { error: "failed to get user credentilas", error };
  }
}
