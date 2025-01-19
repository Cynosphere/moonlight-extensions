import { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: '.insertText("](".concat',
    replace: {
      match: /if\(null!=\i&&null==\i\){/,
      replacement: "if(false){"
    }
  }
];
