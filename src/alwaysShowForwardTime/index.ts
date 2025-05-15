import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: /\.messageSnapshots\.map\(/g,
    replace: {
      match: /(?<=return null==\i\?)null(?=:(\(0,(\i)\.jsxs\))\(\i\.\i,{className:(\i)\.footerContainer,)/,
      replacement: (_, createElement, ReactJSX, classes) =>
        `${createElement}(require("alwaysShowForwardTime_timestamp")?.default??${ReactJSX}.Fragment,{wrapperClass:${classes}.footerContainer,className:${classes}.footerText,timestamp:arguments[0].snapshot.message.timestamp})`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  timestamp: {
    dependencies: [{ id: "react" }, { ext: "spacepack", id: "spacepack" }, { id: "discord/components/common/index" }]
  }
};
