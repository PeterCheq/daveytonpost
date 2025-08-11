import Post from "@/components/posts/Post";
import { urlFor } from "@/sanity/lib/image";
import { getSubredditPosts } from "@/sanity/lib/post/getSubredditPosts";
import { getSubredditBySlug } from "@/sanity/lib/subredddit/getSubredditBySlug";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
async function CommunityPage({ params }) {
  const { slug } = await params;
  const community = await getSubredditBySlug(slug);
  if (!community) return null;

  const user = await currentUser();
  const posts = await getSubredditPosts(community._id);
  // console.log("community>>", community, "posts >>>", posts);
  return (
    <>
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center gap-4">
            {community?.image && community.image.asset?._ref && (
              <div className="relative h-16 w-16 overflow-hidden rounded-full border">
                <Image
                  src={urlFor(community.image).url()}
                  alt="community icon"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{community?.title}</h1>
              {community?.description && (
                <p className="text-sm text-gray-600">{community.description}</p>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="my-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col gap-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Post key={post._id} post={post} userId={user.id || null} />
              ))
            ) : (
              <div className="bg-white rounded-md p-6 text-center">
                <p className="text-gray-500">No posts in this community yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default CommunityPage;
