import { Patch, ExtensionWebpackModule } from "@moonlight-mod/types";

const webhookTag = () => moonlight.getConfigOption<boolean>("chatTweaks", "webhookTag") ?? true;

export const patches: Patch[] = [
  // no reply ping
  {
    find: ',source:"message-actions"})',
    replace: {
      match: /,message:(\i),shouldMention:(!(\i)\.shiftKey&&!(\i)),/,
      replacement: (_, message, shouldMention, keyEvent, self) =>
        `,message:${message},shouldMention:require("chatTweaks_noReplyPing")?.default?.(${message},${keyEvent},${self})??(${shouldMention}),`
    }
  },

  // no reply chain nag
  {
    find: ",replyChainLength:",
    replace: {
      match: /=(\i\.showThreadPromptOnReply)&&/,
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
      match: /case \i\.\i\.BOT:default:(\i)=/,
      replacement: (orig, tag) => `case 99:${tag}="WEBHOOK";break;${orig}`
    },
    prerequisite: webhookTag
  },
  {
    find: ".Types.ORIGINAL_POSTER",
    replace: {
      match: /(\i)=\i\.\i\.Types\.ORIGINAL_POSTER\),/,
      replacement: (orig, type) =>
        `${orig}(arguments[0].user?.bot&&arguments[0].message?.webhookId&&arguments[0].user?.isNonUserBot?.()&&(${type}=99)),`
    },
    prerequisite: webhookTag
  },

  // jump to blocked/ignored
  {
    find: '("interactionAvatarProfile",',
    replace: {
      match: /&&\(\i\?\i\.\i.show\({.+?:(\i\.\i).jumpToMessage/,
      replacement: (_, mod) => `&&(${mod}.jumpToMessage`
    },
    prerequisite: () => moonlight.getConfigOption<boolean>("chatTweaks", "jumpToBlocked") ?? true
  },

  // hide blocked/ignored
  {
    find: 'key:"pending-upload-".concat(',
    replace: {
      match: /if\((\i)\.type===(\i\.\i)\.MESSAGE_GROUP_BLOCKED\|\|/,
      replacement: (orig, message, types) =>
        `if(${message}.type===${types}.MESSAGE_GROUP_BLOCKED&&(moonlight.getConfigOption("chatTweaks","hideBlocked")??false))return;if(${message}.type===${types}.MESSAGE_GROUP_IGNORED&&(moonlight.getConfigOption("chatTweaks","hideIgnored")??false))return;${orig}`
    }
  },

  // always show owner crown
  {
    find: ".lostPermission",
    replace: {
      match: /=>null!=(\i)&&\i&&null==/,
      replacement: (_, isOwner) =>
        `=>null!=(${isOwner}=require("chatTweaks_ownerCrown")?.default?.(arguments[0]))&&${isOwner}&&null==`
    }
  },

  // no masked link paste
  {
    find: '.insertText("](".concat',
    replace: {
      match: /if\((null!=\i&&null==\i)\){/,
      replacement: (_, linkCheck) =>
        `if((moonlight.getConfigOption("chatTweaks","noMaskedLinkPaste")??true)?false:${linkCheck}){`
    }
  },

  // double click edit/reply
  {
    find: ',role:"article",children:[',
    replace: {
      match: "}),ref:",
      replacement:
        '}),onDoubleClick:(event)=>require("chatTweaks_doubleClick")?.default?.(arguments[0].childrenMessageContent.props,event),ref:'
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  ownerCrown: {
    dependencies: [{ ext: "common", id: "stores" }, { ext: "spacepack", id: "spacepack" }, { id: "discord/Constants" }]
  },
  noReplyPing: {},
  doubleClick: {
    dependencies: [{ ext: "common", id: "stores" }, { ext: "spacepack", id: "spacepack" }, { id: "discord/Dispatcher" }]
  }
};
