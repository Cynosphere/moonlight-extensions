import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: ".lostPermission",
    replace: {
      match: /,{user:(\i),isOwner:(\i),lostPermissionTooltipText:/,
      replacement: (_, user, isOwner) =>
        `,{user:${user},isOwner:require("ownerCrown_logic")?.default?.(arguments[0])??${isOwner},lostPermissionTooltipText:`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  logic: {
    dependencies: [{ ext: "common", id: "stores" }, { ext: "spacepack", id: "spacepack" }, { id: "discord/Constants" }]
  }
};
