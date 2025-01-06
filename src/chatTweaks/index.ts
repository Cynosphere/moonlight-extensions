import { Patch } from "@moonlight-mod/types";

let webhookTag = () => moonlight.getConfigOption<boolean>("chatTweaks", "webhookTag") ?? true;

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
  },

  // revert app to bot
  {
    find: ".BOT:default:",
    replace: {
      match: "9RNkeH", // APP_TAG
      replacement: "PQt9z8" // BOT_TAG_BOT
    },
    prerequisite: () => moonlight.getConfigOption<boolean>("chatTweaks", "appToBot") ?? true
  },

  // webhook tag
  {
    find: ".BOT:default:",
    replace: {
      match: /case .\..{1,3}\.BOT:default:(.)=/,
      replacement: (orig, tag) => `case 99:${tag}="WEBHOOK";break;${orig}`
    },
    prerequisite: webhookTag
  },
  {
    find: ".Types.ORIGINAL_POSTER",
    replace: {
      match: /(.)=.\.Z\.Types\.ORIGINAL_POSTER\),/,
      replacement: (orig, type) =>
        `${orig}(arguments[0].user?.bot&&arguments[0].message?.webhookId&&arguments[0].user?.isNonUserBot?.()&&(${type}=99)),`
    },
    prerequisite: webhookTag
  },

  // jump to blocked/ignored
  {
    find: '("interactionAvatarProfile",',
    replace: {
      match: /&&\(.\?.\.Z.show\({.+?:(.)\.Z.jumpToMessage/,
      replacement: (_, mod) => `&&(${mod}.Z.jumpToMessage`
    },
    prerequisite: () => moonlight.getConfigOption<boolean>("chatTweaks", "jumpToBlocked") ?? true
  },

  // hide blocked/ignored
  {
    find: 'key:"pending-upload-".concat(',
    replace: {
      match: /if\((.)\.type===(.\..{1,3})\.MESSAGE_GROUP_BLOCKED\|\|/,
      replacement: (orig, message, types) =>
        `if(${message}.type===${types}.MESSAGE_GROUP_BLOCKED&&(moonlight.getConfigOption("chatTweaks","hideBlocked")??false))return;if(${message}.type===${types}.MESSAGE_GROUP_IGNORED&&(moonlight.getConfigOption("chatTweaks","hideIgnored")??false))return;${orig}`
    }
  }
];
