import { Patch, ExtensionWebpackModule } from "@moonlight-mod/types";

// @ts-expect-error
import ERROR_CODES from "./codes.json";

const ERROR_MATCH =
  /function (.)\(.\){for\(var .="https:\/\/reactjs\.org\/docs\/error-decoder\.html\?invariant="\+.,.=1;.<arguments\.length;.\+\+\).\+="&args\[\]="\+encodeURIComponent\(arguments\[.\]\);return"Minified React error #"\+.\+"; visit "\+.\+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings\."}/;

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
        return ERROR_CODES[code].replace(/%s/g, () => {
          const arg = args[index];
          index++;
          return arg;
        });
      };
    }
  }
};
