import { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: ".author.username}),confirmText:",
    replace: {
      match: /function \i\(\i,\i\){/,
      replacement: "$&return !0;",
    },
  },
];
