import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  // Voice
  {
    find: '},"mute"))}',
    replace: {
      match:
        /(?<=\[\i\.\i]:(.+?)}\),)children:\[(\i\?\?\i\.\i\.getName\(\i\)),(?=\i\?(\(0,(\i)\.jsxs\)).+?,userId:(\i\.id),contextGuildId:(\i),)/,
      replacement: (_, speaking, name, createElement, React, userId, guildId) =>
        `children:[${createElement}(require("colorConsistency_wrapper")?.default??${React}.Fragment,{children:${name},userId:${userId},guildId:${guildId},speaking:${speaking}}),`
    },
    prerequisite: () => moonlight.getConfigOption<boolean>("colorConsistency", "voice") ?? true
  },

  // Typing
  {
    find: "this.handleDismissInviteEducation",
    replace: {
      match: /(?<=(\(0,(\i)\.jsx\)).+?)=>(\i\.\i\.getName\((\i\.guild_id),\i\.id,(\i)\))/,
      replacement: (_, createElement, React, name, guildId, user) =>
        `=>${createElement}(require("colorConsistency_wrapper")?.default??${React}.Fragment,{children:${name},userId:${user}.id,guildId:${guildId}})`
    },
    prerequisite: () => moonlight.getConfigOption<boolean>("colorConsistency", "typing") ?? true
  },

  // Mentions
  {
    find: "discord/modules/messages/web/UserMention",
    replace: {
      match: /!0,children:(\i)=>(\i)\(\i\)/,
      replacement: (_, props, func) =>
        `!0,children:${props}=>${func}(require("colorConsistency_mention")?.default?.(arguments[0],${props})??${props})`
    }
  },

  // patch useGradient to ignore no colors
  {
    find: "animatedGradientId:`dotAnimatedGradient-",
    replace: {
      match: /(?<==(\i)\?\.tertiaryColor!=null.+?)return{gradientStyle:/,
      replacement: (_, colorStrings) =>
        `return ${colorStrings}?.primaryColor==null?{gradientStyle:{},gradientClassname:"",gradientGlowClassname:""}:{gradientStyle:`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  wrapper: {
    dependencies: [
      { id: "react" },
      { ext: "common", id: "stores" },
      { id: "discord/packages/flux" },
      { ext: "spacepack", id: "spacepack" },
      { id: "classnames" }
    ]
  },
  mention: {
    dependencies: [{ ext: "common", id: "stores" }, { ext: "spacepack", id: "spacepack" }, { id: "classnames" }]
  }
};
