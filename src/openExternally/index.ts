import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "discord/utils/MaskedLinkUtils",
    replace: {
      match: /(\i)=encodeURI\((\i)\)}/,
      replacement: (_, href, sanitized) =>
        `${href}=encodeURI(${sanitized})}const openExternally=require("openExternally_open").default(${href});if(openExternally!=null)return openExternally(arguments[1]);`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  open: {}
};
