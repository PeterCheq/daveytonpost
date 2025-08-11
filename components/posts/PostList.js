import { currentUser } from "@clerk/nextjs/server";
import { getPosts } from "@/sanity/lib/post/getAllPost";
import Post from "./Post";

async function PostList() {
  const user = await currentUser();
  const allPost = await getPosts();
  return (
    <div className="space-y-4">
      {allPost?.map((post) => (
        <Post key={post._id} post={post} userId={user?.id || null} />
      ))}
    </div>
  );
}

export default PostList;
