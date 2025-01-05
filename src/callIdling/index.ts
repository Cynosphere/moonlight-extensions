import { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "CallIdleManager:",
    replace: {
      match: /CallIdleManager:{actions:\[".+?},/,
      replacement: ""
    }
  }
];
