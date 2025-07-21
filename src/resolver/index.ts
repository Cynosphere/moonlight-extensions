import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "discord/modules/messages/web/UserMention",
    replace: [
      {
        match: /\.default\.getUser\((\i)\)/,
        replacement: (_, id) => `.default.getUser(${id}??arguments[0].parsedUserId)`
      }
    ]
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  user: {
    dependencies: [
      { id: "react" },
      { ext: "spacepack", id: "spacepack" },
      { ext: "contextMenu", id: "contextMenu" },
      { id: "discord/components/common/index" },
      { id: "discord/actions/UserActionCreators" },
      { id: "discord/actions/UserProfileModalActionCreators" }
    ],
    entrypoint: true
  }
};
