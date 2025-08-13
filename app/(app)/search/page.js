import { searchSubreddits } from "@/sanity/lib/subredddit/searchSubreddits";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
async function SearchPage({ searchParams }) {
  const { query } = await searchParams;
  console.log("title in question >>>>", query);
  const subreddits = await searchSubreddits(query);
  console.log("><<", subreddits);
  return (
    <>
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold">
                Search Results ({subreddits?.length})
              </h1>
              <p className="text-sm text-gray-600">
                Communities matching &quot;{query}&quot;
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="my-8">
        <div className="mx-auto max-w-7xl px-4">
          <ul className="flex flex-col gap-4">
            {subreddits?.map((sub) => (
              <li
                key={sub._id}
                className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
              >
                <Link
                  href={`community/${sub.slug}`}
                  className="flex items-center cursor-pointer gap-4 py-5 px-4 hover:bg-red-50 dark:hover-bg-red-100 transition-colors"
                >
                  <Avatar className="h-12 w-12 border-2 border-red-200 dark:border-red-800 shadow-sm">
                    {sub.image && (
                      <AvatarImage
                        src={urlFor(sub.image).url()}
                        className="object-contain"
                      />
                    )}
                    <AvatarFallback className="text-lg font-semibold bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">
                      {sub.title?.charAt[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-lg font-medium">{sub.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {sub.description}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export default SearchPage;
