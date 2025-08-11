import { commentType } from "./commentType";
import { postType } from "./postType";
import { subredditType } from "./subredditType";
import { userType } from "./userType";
import { voteType } from "./voteType";

export const schema = {
  types: [userType, postType, subredditType, commentType, voteType],
};
