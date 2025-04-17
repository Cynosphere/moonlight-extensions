import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "discord/utils/MaskedLinkUtils",
    replace: {
      match: /let (\i)=(\i);try{decodeURI/,
      replacement: (_, href, sanitized) =>
        `let ${href}=require("openExternally_open").default(${sanitized});try{decodeURI`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  open: {}
};
