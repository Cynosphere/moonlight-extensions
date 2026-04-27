import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "discord/modules/messages/web/UserMention",
    replace: {
      match: /children:`@\${(.+?)}`(?=}\);return \i\?(\(0,(\i)\.jsx\)))/,
      replacement: (_, name, createElement, ReactJSX) =>
        `children:[
  ${createElement}(require("mentionAvatars_avatar")?.default??${ReactJSX}.Fragment,{...arguments[0], children:moonlight.getConfigOption("mentionAvatars","keepAt")?"":"@"}),
  \`\${moonlight.getConfigOption("mentionAvatars","keepAt")?"@":""}\${${name}}\`
]`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  avatar: {
    dependencies: [
      { id: "react" },
      { id: "discord/packages/flux" },
      { id: "discord/design/components/Avatar/web/Avatar" },
      { id: "discord/design/components/Avatar/web/AvatarConstants" },
      { ext: "common", id: "stores" }
    ]
  }
};
