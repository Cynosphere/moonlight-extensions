import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: '("ChannelAttachButton")',
    replace: {
      match:
        /(?<="Invalid popout type provided"\)}},children:\i=>\(0,\i\.jsx\)\(\i\.\i,)(\i)\((\i)\({(buttonRef|look):/,
      replacement: (_, defineProps, mergeProps, firstProp) =>
        `require("betterUploadButton_fixProps").default(${mergeProps}({${firstProp}:`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  fixProps: {}
};
