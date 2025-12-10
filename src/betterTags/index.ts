import { Patch } from "@moonlight-mod/types";

const webhookTag = () => moonlight.getConfigOption<boolean>("betterTags", "webhookTag") ?? true;

export const patches: Patch[] = [
  // revert app to bot
  {
    find: ".BOT:default:",
    replace: {
      match: "9RNkeF", // APP_TAG
      replacement: "PQt9z6" // BOT_TAG_BOT
    },
    prerequisite: () => moonlight.getConfigOption<boolean>("betterTags", "appToBot") ?? true
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
  }
];
