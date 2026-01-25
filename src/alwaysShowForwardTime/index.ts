import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: 'location:"ForwardFooter"',
    replace: {
      match: /(?<=return null==\i\?)null(?=:(\(0,(\i)\.jsxs\))\(\i\.\i,{className:(\i)\.\i,onClick:)/,
      replacement: (_, createElement, ReactJSX, classes) =>
        `${createElement}(require("alwaysShowForwardTime_timestamp")?.default??${ReactJSX}.Fragment,{classes:${classes},timestamp:arguments[0].snapshot.message.timestamp})`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  timestamp: {
    dependencies: [{ id: "react" }, { ext: "spacepack", id: "spacepack" }, { id: "discord/components/common/index" }]
  }
};
