import { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  // Image URLs
  {
    find: "allowLinks:!!",
    replace: {
      match: /,(\(null!=.\?.:.\)\.embeds\)\),)/,
      replacement: (_, orig) =>
        `,moonlight.getConfigOption("mediaTweaks","imageUrls")??true?{}:${orig}`
    }
  },

  // No GIF Autosend
  {
    find: ".TOGGLE_GIF_PICKER,handler:",
    replace: {
      match: /.{1,2}===.\..\.CREATE_FORUM_POST/,
      replacement: (orig: string) =>
        `(moonlight.getConfigOption("mediaTweaks","noGifAutosend")??true?true:${orig})`
    }
  }
];

//export const webpackModules: Record<string, ExtensionWebpackModule> = {};
