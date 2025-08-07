import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: '("ChannelAttachButton")',
    replace: {
      match: /(?<="Invalid popout type provided"\)}},children:\i=>\(0,\i\.jsx\)\(\i\.\i,)(\i)\((\i)\({(look|ref):/,
      replacement: (_, defineProps, mergeProps, firstProp) =>
        `require("betterUploadButton_fixProps").default(${mergeProps}({${firstProp}:`
    }
  },
  {
    find: ".CHAT_INPUT_BUTTON_NOTIFICATION,width:",
    replace: {
      match: /,onClick:(\i)\?void 0:/,
      replacement: (orig, disabled) => `,onContextMenu:${disabled}?void 0:arguments[0].onContextMenu${orig}`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  fixProps: {}
};
