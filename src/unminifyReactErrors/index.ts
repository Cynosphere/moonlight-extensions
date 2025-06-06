import { Patch, ExtensionWebpackModule } from "@moonlight-mod/types";

import ERROR_CODES from "./codes.json";

const ERROR_MATCH =
  /function (\i)\(\i\){var \i="https:\/\/react\.dev\/errors\/"\+\i;if\(1<arguments\.length\){\i\+="\?args\[\]="\+encodeURIComponent\(arguments\[1\]\);for\(var \i=2;\i<arguments\.length;\i\+\+\)\i\+="&args\[\]="\+encodeURIComponent\(arguments\[\i\]\)}return"Minified React error #"\+\i\+"; visit "\+\i\+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings\."}/g;

export const patches: Patch[] = [
  {
    find: ERROR_MATCH,
    replace: {
      match: ERROR_MATCH,
      replacement: (_, functionName) =>
        `function ${functionName}(){return require("unminifyReactErrors_unminify").apply(null,arguments);}`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  unminify: {
    run: function (module, exports, require) {
      module.exports = function unminify(code: string, ...args: any[]) {
        let index = 0;
        return (
          (ERROR_CODES as Record<string, string>)[code]?.replace(/%s/g, () => {
            const arg = args[index];
            index++;
            return arg;
          }) ?? `<unknown code ${code}, React probably updated>`
        );
      };
    }
  }
};
