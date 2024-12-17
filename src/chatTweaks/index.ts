import { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  // no reply mention
  {
    find: ',source:"message-actions"})',
    replace: {
      match: /,message:(.),shouldMention:!(.)\.shiftKey&&/,
      replacement: (_, message, keyEvent) =>
        `,message:${message},shouldMention:moonlight.getConfigOption("chatTweaks","noReplyPing")??true?${keyEvent}.shiftKey:!${keyEvent}.shiftKey&&`
    }
  },

  // no reply chain nag
  {
    find: ",replyChainLength:",
    replace: {
      match: /=(.\.showThreadPromptOnReply)&&/,
      replacement: (_, showThreadPromptOnReply) =>
        `=(moonlight.getConfigOption("chatTweaks","noReplyChainNag")??true?false:${showThreadPromptOnReply})&&`
    }
  }
];

