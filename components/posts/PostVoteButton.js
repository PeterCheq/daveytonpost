"use client";
import { downvote } from "@/actions/downvote";
import { upvote } from "@/actions/upvote";
import { useUser } from "@clerk/nextjs";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState, useTransition } from "react";

function PostVoteButton({ contentId, votes, vote, contentType }) {
  const { isSignedIn } = useUser();
  const [optimisticVote, setOptimisticVote] = useState(vote);
  const [optimisticScore, setOptimisticScore] = useState(votes.netScore);
  const [isPending, startTransition] = useTransition();

  const handleUpvote = () => {
    if (!isSignedIn || isPending) return;

    // Calculate score change based on currrent vote status
    let scoreChange = 0;
    if (optimisticVote === "upvote") {
      // user is canceling thier upvote
      scoreChange = -1;
      setOptimisticVote(null);
    } else if (optimisticVote === "downvote") {
      // user is changing from downvote to upvote (+2 because we remove and add upvote)
      scoreChange = 2;
      setOptimisticVote("upvote");
    } else {
      // user is adding a new vote
      scoreChange++;
      setOptimisticVote("upvote");
    }

    setOptimisticScore((prev) => prev + scoreChange);

    startTransition(async () => {
      try {
        await upvote(contentId, contentType);
      } catch (error) {
        setOptimisticVote(vote);
        setOptimisticScore(votes.netScore);
        console.error("Failed to upvote: " + contentType + error);
      }
    });
  };
  const handleDownVote = () => {
    if (!isSignedIn || isPending) return;

    let scoreChange = 0;
    if (optimisticVote === "downvote") {
      scoreChange = 1;
      setOptimisticVote(null);
    } else if (optimisticVote === "upvote") {
      scoreChange = -2;
    } else {
      scoreChange--;
      setOptimisticVote("downvote");
    }

    setOptimisticScore((prev) => prev + scoreChange);
    startTransition(async () => {
      try {
        await downvote(contentId, contentType);
      } catch (error) {
        setOptimisticVote(vote);
        setOptimisticScore(votes.netScore);
        console.error("Failed to downvote: " + contentType + error);
      }
    });
  };
  return (
    <div className="flex flex-col items-center bg-gray-50 p-2 rounded-l-md">
      <button
        onClick={handleUpvote}
        className={`p-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${optimisticVote === "upvote" ? "bg-orange-100" : "hover:bg-gray-100"} ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <ArrowUp
          className={`w-5 h-5 ${optimisticVote === "upvote" ? "text-orange-500 font-bold" : "text-gray-400 hover:text-orange-500"}`}
        />
      </button>
      <span className="text-sm font-medium text-gray-900">
        {optimisticScore}
      </span>
      <button
        onClick={handleDownVote}
        className={`p-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${optimisticVote === "upvote" ? "bg-orange-100" : "hover:bg-gray-100"} ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <ArrowDown
          className={`w-5 h-5 ${optimisticVote === "downvote" ? "text-orange-500 font-bold" : "text-gray-400 hover:text-orange-500"}`}
        />
      </button>
    </div>
  );
}

export default PostVoteButton;
