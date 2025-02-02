import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: 'navId:"user-settings-cog"',
    replace: [
      {
        match: /(?<=,\i=\(0,(\i\.\i)\)\(\)\.filter\(.+?),children:\[(?=\i\.map\()/,
        replacement: (_, getSections) => `,children:[require("neatSettingsContext_menu").default(${getSections},`
      },
      {
        match: /\),(?=\i\.user\.isStaff\(\)&&)/,
        replacement: ")),"
      }
    ],
    hardFail: true
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  menu: {
    dependencies: [{ id: "react" }, { ext: "contextMenu", id: "contextMenu" }, { ext: "settings", id: "settings" }]
  }
};
