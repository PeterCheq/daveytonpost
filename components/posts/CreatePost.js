"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

function CreatePostButton() {
  const router = useRouter();
  const pathName = usePathname();
  const { user } = useUser();

  console.log(pathName);
  const handleCreatePost = () => {
    // Extract the community name frm the pathname if it follows the pattern / community/[name]
    const communityName = pathName.includes("/community/")
      ? pathName.split("/community/")[1]
      : null;
    if (communityName) {
      router.push(`/create-post?subreddit=${communityName}`);
    } else {
      router.push("/create-post");
    }
  };
  return (
    <Button variant={"outline"} disabled={!user} onClick={handleCreatePost}>
      <Plus className="w-4 h-4 mr-2" />
      {user ? "Create Post" : "Sign in to create post"}
    </Button>
  );
}

export default CreatePostButton;
