"use client";

import { reportContent } from "@/actions/reportContent";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Flag } from "lucide-react";
import { useState, useTransition } from "react";

function ReportButton({ contentId }) {
  const [isReported, setIsReported] = useState(false);
  const [isLoading, startTransition] = useTransition();
  const { isSignedIn } = useUser();

  const handleReport = async () => {
    if (isReported || isLoading || !isSignedIn) return;

    startTransition(async () => {
      try {
        setIsReported(true);
        const results = await reportContent(contentId);
        if ("error" in results) {
          setIsReported(false);
          console.error(results.error);
        }
      } catch (error) {
        console.log("Error: Failed to report" + error);
        console.error("Error: Failed to report" + error);
      }
    });
  };

  return (
    <button
      onClick={handleReport}
      disabled={isReported || isLoading || !isSignedIn}
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors mt-1 disabled:opacity-50 disabled:cursor-not-allowed",
        isReported ? "text-red-600 dark:text-red-400" : ""
      )}
    >
      <Flag
        className={cn(
          "w-3.5 h-3.5",
          isReported ? "fill-red-600 dark:fill-red-400" : ""
        )}
      />
      <span className="hidden md:block">
        {isReported ? "Reported" : isSignedIn ? "Report" : "Sign in to report"}
      </span>
    </button>
  );
}

export default ReportButton;
