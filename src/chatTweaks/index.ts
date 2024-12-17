import {Patch} from "@moonlight-mod/types";

export const patches: Patch[] = [
  // reply mention
  {
    find: ',source:"message-actions"})',
    replace: {
      match: /,message:(.),shouldMention:!(.)\.shiftKey&&/,
      replacement: (_, message, keyEvent) => `,message:${message},shouldMention:moonlight.getConfigOption("chatTweaks","noReplyPing")??true?${keyEvent}.shiftKey:!${keyEvent}.shiftKey&&`
    }
  }
];