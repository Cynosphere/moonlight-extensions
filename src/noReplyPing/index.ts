import { Patch, ExtensionWebpackModule } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: ',source:"message-actions"})',
    replace: {
      match: /,message:(\i),shouldMention:(!(\i)\.shiftKey&&!(\i)),/,
      replacement: (_, message, shouldMention, keyEvent, self) =>
        `,message:${message},shouldMention:require("noReplyPing_logic")?.default?.(${message},${keyEvent},${self})??(${shouldMention}),`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  logic: {}
};
