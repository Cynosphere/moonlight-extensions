import { Patch, ExtensionWebpackModule } from "@moonlight-mod/types";

const webhookTag = () => moonlight.getConfigOption<boolean>("chatTweaks", "webhookTag") ?? true;

export const patches: Patch[] = [
  // no reply ping
  {
    find: ',source:"message-actions"})',
    replace: {
      match: /,message:(.),shouldMention:(!(.)\.shiftKey&&!(.)),/,
      replacement: (_, message, shouldMention, keyEvent, self) =>
        `,message:${message},shouldMention:require("chatTweaks_noReplyPing")?.default?.(${message},${keyEvent},${self})??(${shouldMention}),`
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
  },

  // always show owner crown
  {
    find: ".lostPermission",
    replace: {
      match: /=>null!=(.)&&.&&null==/,
      replacement: (_, isOwner) =>
        `=>null!=(${isOwner}=require("chatTweaks_ownerCrown").default(arguments[0]))&&${isOwner}&&null==`
    }
  },

  // no masked link paste
  {
    find: '.insertText("](".concat',
    replace: {
      match: /if\((null!=.&&null==.)\){/,
      replacement: (_, linkCheck) =>
        `if((moonlight.getConfigOption("chatTweaks","noMaskedLinkPaste")??true)?false:${linkCheck}){`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  ownerCrown: {
    dependencies: [{ ext: "common", id: "stores" }, { ext: "spacepack", id: "spacepack" }, { id: "discord/Constants" }]
  },
  noReplyPing: {}
};
