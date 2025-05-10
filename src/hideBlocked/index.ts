import { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: '},"forum-post-action-bar-".concat(',
    replace: {
      match: /if\((\i)\.type===(\i\.\i)\.MESSAGE_GROUP_BLOCKED\|\|/,
      replacement: (orig, message, types) =>
        `if(${message}.type===${types}.MESSAGE_GROUP_BLOCKED&&(moonlight.getConfigOption("hideBlocked","blocked")??false))return;
if(${message}.type===${types}.MESSAGE_GROUP_IGNORED&&(moonlight.getConfigOption("hideBlocked","ignored")??false))return;
${orig}`
    }
  }
];
