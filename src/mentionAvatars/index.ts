import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: ',"Unexpected missing user"),',
    replace: {
      match: /children:"@".concat\((.+?)\)(?=}\)\)?;return \i\?(\(0,(\i)\.jsx\)))/,
      replacement: (_, concat, createElement, ReactJSX) =>
        `children:[
  ${createElement}(require("mentionAvatars_avatar")?.default??${ReactJSX}.Fragment,{...arguments[0], children:moonlight.getConfigOption("mentionAvatars","keepAt")?"":"@"}),
  (moonlight.getConfigOption("mentionAvatars","keepAt")?"@":"").concat(${concat})
]`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  avatar: {
    dependencies: [
      { id: "react" },
      { id: "discord/packages/flux" },
      { id: "discord/components/common/index" },
      { ext: "common", id: "stores" }
    ]
  }
};
