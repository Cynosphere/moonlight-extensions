import {Patch} from "@moonlight-mod/types";

export const patches: Patch[] = [
  // reply mention
  {
    find: /,message:(.),shouldMention:!(.)\.shiftKey&&!.(&&!.)?,/,
    replace: {
      match: /,message:(.),shouldMention:!(.)\.shiftKey&&!.(&&!.)?,/,
      replacement: (_, orig, keyEvent) => `,message:${orig},shouldMention:moonlight.getConfigOption("chatTweaks","noReplyPing")??true?${keyEvent}.shiftKey:!${keyEvent}.shiftKey,`
    }
  }
];