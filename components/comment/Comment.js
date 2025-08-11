import { getCommentReplies } from "@/sanity/lib/comment/getCommentReplies";
import { UserCircle } from "lucide-react";
import Image from "next/image";
import TimeAgoRef from "../TimeAgo";
import CommentList from "./CommentList";
import CommentReply from "./CommentReply";
import PostVoteButton from "../posts/PostVoteButton";

async function Comment({ postId, comment, userId }) {
  const replies = await getCommentReplies(comment._id, userId);
  const userVoteStatus = comment.votes.votesStatus;
  return (
    <article className="py-5 border-b border-gray-100 last:border-0">
      <div className="flex gap-4">
        {/* PostvoteButtons */}
        <PostVoteButton
          contentId={comment._id}
          votes={comment.votes}
          vote={userVoteStatus}
          contentType="comment"
        />
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {comment.author?.imageUrl ? (
              <div className="flex-shrink-0">
                <Image
                  src={comment.author.imageUrl}
                  alt={`${comment.author.username}'s profile image`}
                  className="w-10 h-10 rounded-full object-cover"
                  width={40}
                  height={40}
                />
              </div>
            ) : (
              <div className="flex-shrink-0">
                <UserCircle className="h-10 w-10 text-gray-300" />
              </div>
            )}
            <h3 className="font-medium text-gray-900">
              {comment.author?.username || "Anonymous"}
            </h3>
            <span className="text-xs text-gray-500">
              <TimeAgoRef date={new Date(comment._createdAt)} />
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed">{comment.content}</p>
          <CommentReply postId={postId} comment={comment} />
          {replies?.length > 0 && (
            <div className="mt-3 ps-2 border-s-2 border-gray-100">
              <CommentList postId={postId} comments={replies} userId={userId} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default Comment;
