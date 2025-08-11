"use client";
import TimeAgo from "timeago-react";
function TimeAgoRef({ date }) {
  return <TimeAgo datetime={date} />;
}

export default TimeAgoRef;
