import { ExtensionWebpackModule } from "@moonlight-mod/types";

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  shiftjis: {
    entrypoint: true,
    dependencies: [{ ext: "markdown", id: "markdown" }, { id: "react" }]
  }
};
