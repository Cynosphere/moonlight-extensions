import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  // Voice
  {
    find: ".listCollapse",
    replace: {
      match:
        /(?<=\.usernameSpeaking]:(.+?)}\),)children:\[(null!=\i\?\i:\i\.\i\.getName\(\i\)),(?=\i\?(\(0,(\i)\.jsxs\)).+?,userId:(\i\.id),contextGuildId:(\i),)/,
      replacement: (_, speaking, name, createElement, React, userId, guildId) =>
        `children:[${createElement}(require("colorConsistency_wrapper")?.default??${React}.Fragment,{children:${name},userId:${userId},guildId:${guildId},speaking:${speaking}}),`
    },
    prerequisite: () => moonlight.getConfigOption<boolean>("colorConsistency", "voice") ?? true
  },

  // Typing
  {
    find: '("TypingUsers")',
    replace: {
      match: /=>(\i\.\i\.getName\((\i),\i\.id,(\i)\))(?=.+?(\(0,(\i)\.jsxs\)))/,
      replacement: (_, name, guildId, user, createElement, React) =>
        `=>${createElement}(require("colorConsistency_wrapper")?.default??${React}.Fragment,{children:${name},userId:${user}.id,guildId:${guildId}})`
    },
    prerequisite: () => moonlight.getConfigOption<boolean>("colorConsistency", "typing") ?? true
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  wrapper: {
    dependencies: [
      { id: "react" },
      { ext: "common", id: "stores" },
      { id: "discord/packages/flux" },
      { ext: "spacepack", id: "spacepack" }
    ]
  }
};
