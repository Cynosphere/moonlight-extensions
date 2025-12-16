import { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: '("interactionAvatarProfile",',
    replace: {
      match: /\(null==\i\|\|\(0,\i\.\i\)\(\i\)\)&&(\i\(\))/,
      replacement: (_, jumpToMessage) => jumpToMessage
    }
  }
];
