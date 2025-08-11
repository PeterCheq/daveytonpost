import CreateCommunityButton from "@/components/header/CreateCommunityButton";
import CreatePostForm from "@/components/posts/CreatePostForm";
import SubredditCombobox from "@/components/posts/SubredditCombobox";
import { getSubreddit } from "@/sanity/lib/subredddit/getSubreddit";

async function CreatePost({ searchParams }) {
  const { subreddit } = await searchParams;
  const subreddits = await getSubreddit();
  if (subreddit) {
    return (
      <>
        <section className="bg-white border-b">
          <div className="mx-auto max-w-7xl px-4 py-7">
            <div className="flex items-center">
              <div>
                <h1 className="text-2xl font-bold">Create Post</h1>
                <p className="text-sm text-gray-600">
                  Create a post in the{" "}
                  <span className="font-bold">{subreddit}</span> Community
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="my-8">
          <CreatePostForm subreddit={subreddit} />
        </section>
      </>
    );
  }
  return (
    <>
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold">Create Post</h1>
              <p className="text-sm text-gray-600">
                Select a community for your post
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="my-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col gap-4">
            <div className="max-w-3xl">
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="select community"
              >
                Select a community to post in
              </label>
              <SubredditCombobox subreddits={subreddits} />
              <hr className="my-4" />
              <p className="mt-4 text-sm text-gray-600">
                If you don&apos;t see your community, you can create it here.
              </p>
              <div className="mt-2">
                <CreateCommunityButton />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CreatePost;
