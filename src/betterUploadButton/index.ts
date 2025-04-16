import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: '("ChannelAttachButton")',
    replace: {
      match: /(?<="Invalid popout type provided"\)}},children:\i=>\(0,\i\.jsx\)\(\i\.\i,)(\i)\((\i)\({look:/,
      replacement: (_, defineProps, mergeProps) => `require("betterUploadButton_fixProps").default(${mergeProps}({look:`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  fixProps: {}
};
