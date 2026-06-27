import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "discord/modules/messages/web/UserMention",
    replace: {
      match: /(function \i\(\i\){return.+?\.\.\.\i,)children:`@\${(\i\?\?\i)}`(?=}\)}return \i\?(\(0,(\i)\.jsx\)))/,
      replacement: (_, body, name, createElement, ReactJSX) =>
        `let __mentionAvatars_props=arguments[0];${body}children:[
  ${createElement}(require("mentionAvatars_avatar")?.default??${ReactJSX}.Fragment,{...__mentionAvatars_props, children:moonlight.getConfigOption("mentionAvatars","keepAt")?"":"@"}),
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
