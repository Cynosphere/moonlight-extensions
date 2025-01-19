import { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: '("interactionAvatarProfile",',
    replace: {
      match: /&&\(\i\?\i\.\i.show\({.+?:(\i\.\i)\.jumpToMessage/,
      replacement: (_, mod) => `&&(${mod}.jumpToMessage`
    }
  }
];
