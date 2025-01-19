import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: ".lostPermission",
    replace: {
      match: /=>null!=(\i)&&\i&&null==/,
      replacement: (_, isOwner) =>
        `=>null!=(${isOwner}=require("ownerCrown_logic")?.default?.(arguments[0]))&&${isOwner}&&null==`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  logic: {
    dependencies: [{ ext: "common", id: "stores" }, { ext: "spacepack", id: "spacepack" }, { id: "discord/Constants" }]
  }
};
