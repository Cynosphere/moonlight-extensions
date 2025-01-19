import { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: ",replyChainLength:",
    replace: {
      match: /=\i\.showThreadPromptOnReply&&/,
      replacement: "=false&&"
    }
  }
];
