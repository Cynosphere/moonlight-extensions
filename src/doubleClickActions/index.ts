import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: /hasReply:\i,author:\i,/,
    replace: {
      match: "}),ref:",
      replacement:
        '}),onDoubleClick:(event)=>require("doubleClickActions_actions")?.default?.(arguments[0].childrenMessageContent.props,event),ref:'
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  actions: {
    dependencies: [{ ext: "common", id: "stores" }, { ext: "spacepack", id: "spacepack" }, { id: "discord/Dispatcher" }]
  }
};
