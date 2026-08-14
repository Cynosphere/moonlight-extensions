import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: 'type:"UPLOAD_TEXT_AS_FILE",',
    replace: {
      match:
        /(?<="Invalid popout type provided"\)},children:\i=>.+?),(onDoubleClick:.+?:void 0),"aria-haspopup":"menu",\.\.\.(\i),/,
      replacement: (_, onDoubleClick, props) =>
        `,"aria-haspopup":"menu",...require("betterUploadButton_fixProps").default(${props},{${onDoubleClick}}),`
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
